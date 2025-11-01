#!/usr/bin/env python3
"""
Téléchargement automatique des données de livres depuis Google Drive
Stratégie : Code sur GitHub + Données volumineuses sur Google Drive
"""
import os
import requests
import zipfile
import tempfile
from pathlib import Path

def download_from_google_drive(file_id, destination):
    """Télécharge un fichier depuis Google Drive en gérant les gros fichiers"""

    # URL de téléchargement direct Google Drive
    download_url = f"https://drive.google.com/uc?export=download&id={file_id}"

    try:
        print(f"📥 Téléchargement depuis Google Drive: {destination}")

        # Session pour gérer les cookies et redirections
        session = requests.Session()
        response = session.get(download_url, stream=True)

        # Gérer l'avertissement antivirus pour les gros fichiers
        if 'virus scan warning' in response.text.lower() or response.status_code == 200 and 'confirm=' in response.text:
            print("⚠️  Gros fichier détecté, gestion de l'avertissement antivirus...")

            # Extraire le token de confirmation
            import re
            confirm_match = re.search(r'confirm=([^&"]*)', response.text)
            if confirm_match:
                confirm_token = confirm_match.group(1)
                confirm_url = f"https://drive.google.com/uc?export=download&confirm={confirm_token}&id={file_id}"
                response = session.get(confirm_url, stream=True)

        response.raise_for_status()

        # Télécharger le fichier
        total_size = int(response.headers.get('content-length', 0))
        downloaded = 0

        with open(destination, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)

                    # Afficher le progrès tous les 10MB
                    if downloaded % (10 * 1024 * 1024) == 0:
                        if total_size > 0:
                            percent = (downloaded / total_size) * 100
                            print(f"📊 Progrès: {percent:.1f}% ({downloaded // (1024*1024)}MB/{total_size // (1024*1024)}MB)")
                        else:
                            print(f"📊 Téléchargé: {downloaded // (1024*1024)}MB")

        print(f"✅ Téléchargement terminé: {destination}")
        return True

    except Exception as e:
        print(f"❌ Erreur de téléchargement: {e}")
        return False

def download_and_extract_data():
    """Fonction principale de téléchargement et extraction"""

    # Vérifier si les données existent déjà
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

    # Obtenir l'URL de téléchargement depuis les variables d'environnement
    drive_file_id = os.environ.get('BOOK_DATA_DRIVE_ID')

    if not drive_file_id:
        print("⚠️  Variable BOOK_DATA_DRIVE_ID non trouvée")
        print("🔧 Création de données de test pour validation...")
        create_test_data()
        return True

    # Télécharger l'archive
    archive_name = "book_data.zip"

    if download_from_google_drive(drive_file_id, archive_name):
        print("📦 Extraction de l'archive...")

        try:
            with zipfile.ZipFile(archive_name, 'r') as zip_ref:
                zip_ref.extractall('.')

            # Nettoyer l'archive
            os.remove(archive_name)
            print("✅ Extraction terminée avec succès")

            # Vérifier que les dossiers attendus existent
            missing = [d for d in required_dirs if not os.path.exists(d)]
            if missing:
                print(f"⚠️  Dossiers manquants après extraction: {missing}")
                create_test_data_for_missing(missing)

            return True

        except Exception as e:
            print(f"❌ Erreur d'extraction: {e}")
            print("🔧 Création de données de test...")
            create_test_data()
            return False

    else:
        print("🔧 Échec du téléchargement, création de données de test...")
        create_test_data()
        return False

def create_test_data():
    """Crée des données de test minimalistes pour tous les livres"""
    test_dirs = [
        'vallee_sans_hommes_frison', 'racines_ciel_gary', 'policeman_decoin',
        'a_rebours_huysmans', 'chien_blanc_gary', 'peau_bison_frison',
        'tilleul_soir_anglade', 'villa_triste_modiano'
    ]
    create_test_data_for_missing(test_dirs)

def create_test_data_for_missing(missing_dirs):
    """Crée des données de test pour les dossiers manquants"""

    for book_dir in missing_dirs:
        print(f"🔧 Création de données de test pour: {book_dir}")

        # Créer le dossier
        Path(book_dir).mkdir(exist_ok=True)

        # Créer un fichier GraphML minimal mais valide
        graphml_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
         http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">

  <key id="d0" for="node" attr.name="entity_type" attr.type="string"/>
  <key id="d1" for="node" attr.name="description" attr.type="string"/>
  <key id="d2" for="edge" attr.name="description" attr.type="string"/>
  <key id="d3" for="edge" attr.name="weight" attr.type="double"/>

  <graph id="test_graph" edgedefault="undirected">
    <!-- Entités de test pour {book_dir} -->
    <node id="protagoniste">
      <data key="d0">Personnes</data>
      <data key="d1">Personnage principal du livre {book_dir}</data>
    </node>
    <node id="lieu_principal">
      <data key="d0">Lieux</data>
      <data key="d1">Lieu central de l'action</data>
    </node>
    <node id="theme_central">
      <data key="d0">Concepts</data>
      <data key="d1">Thème principal de l'œuvre</data>
    </node>

    <!-- Relations de test -->
    <edge source="protagoniste" target="lieu_principal">
      <data key="d2">se trouve dans</data>
      <data key="d3">0.8</data>
    </edge>
    <edge source="protagoniste" target="theme_central">
      <data key="d2">explore</data>
      <data key="d3">0.9</data>
    </edge>
  </graph>
</graphml>'''

        # Écrire le fichier GraphML
        graphml_path = Path(book_dir) / "graph_chunk_entity_relation.graphml"
        with open(graphml_path, 'w', encoding='utf-8') as f:
            f.write(graphml_content)

        print(f"✅ Données de test créées pour {book_dir}")

def main():
    """Point d'entrée principal"""
    print("🚀 === TÉLÉCHARGEMENT DES DONNÉES DE LIVRES ===")
    success = download_and_extract_data()

    if success:
        print("✅ Configuration des données terminée")
    else:
        print("⚠️  Configuration avec données de test")

    # Lister les livres disponibles
    available_books = []
    for item in os.listdir('.'):
        if os.path.isdir(item) and not item.startswith('.'):
            graphml_file = os.path.join(item, 'graph_chunk_entity_relation.graphml')
            if os.path.exists(graphml_file):
                available_books.append(item)

    print(f"📚 Livres disponibles: {available_books}")
    return success

if __name__ == "__main__":
    main()