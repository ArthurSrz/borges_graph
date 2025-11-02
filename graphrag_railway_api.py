#!/usr/bin/env python3
"""
API GraphRAG fonctionnelle pour déploiement Railway - Mode local uniquement
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import xml.etree.ElementTree as ET
from pathlib import Path
import random
import requests
import zipfile

app = Flask(__name__)

def download_from_google_drive(file_id, destination):
    """Télécharge un fichier depuis Google Drive"""
    try:
        print(f"📥 Téléchargement depuis Google Drive: {destination}")

        session = requests.Session()
        initial_url = f"https://drive.google.com/uc?export=download&id={file_id}"
        response = session.get(initial_url, stream=True)

        # Gérer les gros fichiers avec avertissement antivirus
        if response.status_code == 200 and ('confirm=' in response.text or 'virus scan warning' in response.text.lower()):
            print("⚠️  Gros fichier détecté, extraction du lien...")

            import re
            confirm_match = re.search(r'confirm=([^&"]*)', response.text)
            if confirm_match:
                confirm_token = confirm_match.group(1)
                confirm_url = f"https://drive.google.com/uc?export=download&confirm={confirm_token}&id={file_id}"
                response = session.get(confirm_url, stream=True)

        response.raise_for_status()

        with open(destination, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        print(f"✅ Téléchargement terminé: {destination}")
        return True

    except Exception as e:
        print(f"❌ Erreur de téléchargement: {e}")
        return False

def download_and_extract_data():
    """Télécharge et extrait les données de livres depuis Google Drive"""
    required_dirs = [
        'vallee_sans_hommes_frison', 'racines_ciel_gary', 'policeman_decoin',
        'a_rebours_huysmans', 'chien_blanc_gary', 'peau_bison_frison',
        'tilleul_soir_anglade', 'villa_triste_modiano'
    ]

    existing_dirs = [d for d in required_dirs if os.path.exists(d)]

    if len(existing_dirs) == len(required_dirs):
        print("✅ Toutes les données de livres sont déjà présentes")
        return True

    print(f"📚 Données manquantes: {len(required_dirs) - len(existing_dirs)} dossiers")

    # Obtenir l'ID du fichier Google Drive
    drive_file_id = os.environ.get('BOOK_DATA_DRIVE_ID', '1NTgs97rvlVHYozTfodNo5kKsambOpXr1')

    if not drive_file_id:
        print("❌ Variable BOOK_DATA_DRIVE_ID non trouvée")
        return False

    archive_name = "book_data.zip"

    if download_from_google_drive(drive_file_id, archive_name):
        print("📦 Extraction de l'archive...")

        try:
            with zipfile.ZipFile(archive_name, 'r') as zip_ref:
                zip_ref.extractall('.')

            os.remove(archive_name)
            print("✅ Extraction terminée avec succès")
            return True

        except Exception as e:
            print(f"❌ Erreur d'extraction: {e}")
            return False

    return False

# CORS configuration for Railway deployment
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:3001",
    "https://borges-library-web.vercel.app",
    "https://*.vercel.app",
    "https://reconciliation-api-production.up.railway.app"
],
methods=['GET', 'POST', 'OPTIONS'],
allow_headers=['Content-Type', 'Authorization'],
supports_credentials=True)

def find_books():
    """Find all available books with GraphRAG data"""
    books = []
    for item in os.listdir('.'):
        if os.path.isdir(item) and not item.startswith('.'):
            # Check for GraphRAG data files
            graph_path = f"{item}/graph_chunk_entity_relation.graphml"
            if os.path.exists(graph_path):
                books.append({
                    "id": item,
                    "name": item.replace('_', ' ').title(),
                    "has_data": True,
                    "graph_path": graph_path
                })
    return books

def parse_graphml(graph_path):
    """Parse GraphML file to extract entities and relationships"""
    try:
        tree = ET.parse(graph_path)
        root = tree.getroot()

        # Namespace handling
        ns = {'g': 'http://graphml.graphdrawing.org/xmlns'}

        entities = []
        relationships = []

        # Extract nodes (entities)
        for node in root.findall('.//g:node', ns):
            node_id = node.get('id')
            entity_data = {'id': node_id}

            # Extract node attributes
            for data in node.findall('g:data', ns):
                key = data.get('key')
                value = data.text
                if key and value:
                    entity_data[key] = value

            entities.append(entity_data)

        # Extract edges (relationships)
        for edge in root.findall('.//g:edge', ns):
            source = edge.get('source')
            target = edge.get('target')
            rel_data = {
                'source': source,
                'target': target
            }

            # Extract edge attributes
            for data in edge.findall('g:data', ns):
                key = data.get('key')
                value = data.text
                if key and value:
                    rel_data[key] = value

            relationships.append(rel_data)

        return entities, relationships

    except Exception as e:
        print(f"Error parsing GraphML: {e}")
        return [], []

def simulate_graphrag_response(query, book_id, entities, relationships):
    """Simulate a GraphRAG response using local graph data"""

    # Simple keyword matching for entity relevance
    query_words = query.lower().split()
    relevant_entities = []

    for entity in entities:
        entity_text = str(entity).lower()
        relevance_score = 0
        for word in query_words:
            if word in entity_text:
                relevance_score += 1

        if relevance_score > 0:
            relevant_entities.append({
                **entity,
                'relevance': relevance_score,
                'score': min(1.0, relevance_score / len(query_words))
            })

    # Sort by relevance
    relevant_entities.sort(key=lambda x: x['relevance'], reverse=True)
    relevant_entities = relevant_entities[:20]  # Top 20

    # Find relevant relationships
    relevant_entity_ids = [e['id'] for e in relevant_entities]
    relevant_relationships = []

    for rel in relationships:
        if (rel['source'] in relevant_entity_ids or
            rel['target'] in relevant_entity_ids):
            relevant_relationships.append(rel)

    # Generate a simple answer
    if relevant_entities:
        answer = f"Based on the analysis of '{book_id.replace('_', ' ')}', "
        if 'personnage' in query.lower() or 'character' in query.lower():
            characters = [e for e in relevant_entities if 'name' in str(e).lower()]
            if characters:
                char_names = [str(c.get('id', 'Unknown'))[:50] for c in characters[:3]]
                answer += f"the main characters appear to be: {', '.join(char_names)}."
            else:
                answer += "several characters are mentioned in the text."
        elif 'thème' in query.lower() or 'theme' in query.lower():
            answer += "the main themes include literary exploration, character development, and narrative structure."
        elif 'histoire' in query.lower() or 'story' in query.lower():
            answer += "the story follows a complex narrative with multiple interconnected elements."
        else:
            answer += f"there are {len(relevant_entities)} relevant elements that match your query."
    else:
        answer = f"I found limited information related to your query in '{book_id.replace('_', ' ')}'."

    return {
        "success": True,
        "answer": answer,
        "searchPath": {
            "entities": [
                {
                    **e,
                    "order": i+1,
                    "type": "ENTITY"
                }
                for i, e in enumerate(relevant_entities[:10])
            ],
            "relations": [
                {
                    **r,
                    "traversalOrder": i+1
                }
                for i, r in enumerate(relevant_relationships[:15])
            ],
            "communities": [
                {
                    "id": f"community_{i}",
                    "content": f"Thematic cluster {i+1} in {book_id}",
                    "relevance": 0.8 - (i * 0.1)
                }
                for i in range(3)
            ]
        },
        "book_id": book_id,
        "mode": "local",
        "query": query
    }

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "GraphRAG API Railway"})

@app.route('/books', methods=['GET'])
def list_books():
    """List all available books with GraphRAG data"""
    books = find_books()
    return jsonify({"books": books})

@app.route('/query', methods=['POST'])
def query_graph():
    try:
        data = request.json
        query = data.get('query', '')
        book_id = data.get('book_id', None)
        mode = data.get('mode', 'local')

        if not query:
            return jsonify({"error": "Query is required"}), 400

        # Find books
        books = find_books()

        # Get book_id if not specified
        if not book_id and books:
            book_id = books[0]['id']

        # Find the requested book
        book_data = None
        for book in books:
            if book['id'] == book_id:
                book_data = book
                break

        if not book_data:
            return jsonify({"error": f"Book '{book_id}' not found"}), 404

        # Parse GraphML data
        entities, relationships = parse_graphml(book_data['graph_path'])

        if not entities:
            return jsonify({"error": f"No data found for book '{book_id}'"}), 404

        # Generate response
        response = simulate_graphrag_response(query, book_id, entities, relationships)

        return jsonify(response)

    except Exception as e:
        print(f"Error in query_graph: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Railway deployment configuration
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Starting GraphRAG API Railway on port {port}")

    # Download and extract data from Google Drive first
    print("📥 === TÉLÉCHARGEMENT DES DONNÉES DEPUIS GOOGLE DRIVE ===")
    data_success = download_and_extract_data()

    if data_success:
        print("✅ Données prêtes!")
    else:
        print("⚠️ Échec du téléchargement, API fonctionnera avec les données disponibles")

    # Show available books
    books = find_books()
    print(f"📚 Available books ({len(books)}):")
    for book in books:
        print(f"  ✅ {book['id']} - {book['name']}")

    if not books:
        print("  ❌ No books with GraphRAG data found!")
        print("  📁 Current directory:", os.getcwd())
        print("  📂 Available directories:")
        for item in os.listdir('.'):
            if os.path.isdir(item):
                print(f"     - {item}")

    app.run(host='0.0.0.0', port=port, debug=False)