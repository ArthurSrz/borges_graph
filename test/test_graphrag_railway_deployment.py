#!/usr/bin/env python3
"""
Test de l'API GraphRAG déployée sur Railway
"""

import requests
import json

# URL de l'API déployée sur Railway
GRAPHRAG_API_URL = "https://borgesgraph-production.up.railway.app"

def test_health():
    """Test de santé de l'API"""
    print("🔍 TEST HEALTH API GRAPHRAG RAILWAY")
    print("=" * 60)

    try:
        response = requests.get(f"{GRAPHRAG_API_URL}/health", timeout=10)
        print(f"✅ Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            print(f"❌ Response: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Erreur connexion: {e}")
        return False

def test_books_list():
    """Test de la liste des livres"""
    print("\n🔍 TEST LISTE DES LIVRES")
    print("=" * 60)

    try:
        response = requests.get(f"{GRAPHRAG_API_URL}/books", timeout=10)
        print(f"✅ Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            books = data.get('books', [])
            print(f"✅ Nombre de livres trouvés: {len(books)}")

            for book in books[:3]:  # Afficher les 3 premiers
                print(f"  📚 {book.get('id')} - {book.get('name')}")

            return True, books
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            print(f"❌ Response: {response.text}")
            return False, []

    except Exception as e:
        print(f"❌ Erreur connexion: {e}")
        return False, []

def test_graphrag_query(book_id=None):
    """Test d'une requête GraphRAG"""
    print(f"\n🔍 TEST REQUETE GRAPHRAG")
    print("=" * 60)

    query_data = {
        "query": "Quels sont les personnages principaux ?",
        "mode": "local"
    }

    if book_id:
        query_data["book_id"] = book_id
        print(f"📚 Livre testé: {book_id}")

    print(f"📝 Requête: {query_data['query']}")

    try:
        response = requests.post(
            f"{GRAPHRAG_API_URL}/query",
            json=query_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        print(f"✅ Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()

            print(f"✅ Succès: {data.get('success', False)}")
            print(f"📖 Livre: {data.get('book_id', 'N/A')}")
            print(f"🔍 Mode: {data.get('mode', 'N/A')}")

            answer = data.get('answer', '')
            print(f"📝 Réponse ({len(answer)} chars): {answer[:200]}...")

            search_path = data.get('searchPath', {})
            entities = search_path.get('entities', [])
            relations = search_path.get('relations', [])
            communities = search_path.get('communities', [])

            print(f"🔗 Entités trouvées: {len(entities)}")
            print(f"🔗 Relations trouvées: {len(relations)}")
            print(f"🔗 Communautés trouvées: {len(communities)}")

            # Afficher quelques entités
            if entities:
                print(f"\n📋 Premières entités:")
                for i, entity in enumerate(entities[:3]):
                    print(f"  {i+1}. {entity.get('id', 'N/A')} (score: {entity.get('score', 'N/A')})")

            return True

        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            print(f"❌ Response: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Erreur requête: {e}")
        return False

def main():
    """Test principal"""
    print("TEST COMPLET API GRAPHRAG RAILWAY DEPLOYMENT")
    print("=" * 80)
    print(f"🌐 URL: {GRAPHRAG_API_URL}")

    # Test 1: Health
    health_ok = test_health()
    if not health_ok:
        print("\n❌ ÉCHEC: API non accessible")
        return False

    # Test 2: Liste des livres
    books_ok, books = test_books_list()
    if not books_ok:
        print("\n❌ ÉCHEC: Impossible de récupérer la liste des livres")
        return False

    if not books:
        print("\n❌ ÉCHEC: Aucun livre trouvé")
        return False

    # Test 3: Requête GraphRAG avec premier livre
    first_book = books[0]['id']
    query_ok = test_graphrag_query(first_book)

    if query_ok:
        print("\n" + "=" * 80)
        print("🎉 TOUS LES TESTS RÉUSSIS!")
        print("✅ API GraphRAG Railway fonctionnelle")
        print("✅ Prête pour intégration avec Reconciliation API")
        return True
    else:
        print("\n❌ ÉCHEC: Requête GraphRAG")
        return False

if __name__ == "__main__":
    main()