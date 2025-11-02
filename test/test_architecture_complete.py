#!/usr/bin/env python3
"""
Test complet de l'architecture Borges Library

Architecture testée:
Frontend Vercel → Reconciliation API → { Neo4j API, GraphRAG API }
                                      { Neo4j Aura, Google Drive GraphML }
"""

import requests
import json
import time

# URLs des APIs
FRONTEND_URL = "https://borges-library-web.vercel.app"
RECONCILIATION_API_URL = "https://reconciliation-api-production.up.railway.app"
GRAPHRAG_API_URL = "https://borgesgraph-production.up.railway.app"

def test_component(name, url, endpoint="", expected_status=200):
    """Test générique d'un composant"""
    print(f"\n🔍 TEST {name}")
    print("=" * 60)

    try:
        full_url = f"{url}{endpoint}"
        print(f"🌐 URL: {full_url}")

        response = requests.get(full_url, timeout=10)
        print(f"✅ Status: {response.status_code}")

        if response.status_code == expected_status:
            try:
                data = response.json()
                print(f"📄 Response: {json.dumps(data, indent=2)[:200]}...")
                return True, data
            except:
                print(f"📄 Response: {response.text[:100]}...")
                return True, response.text
        else:
            print(f"❌ Expected {expected_status}, got {response.status_code}")
            print(f"❌ Response: {response.text}")
            return False, None

    except Exception as e:
        print(f"❌ Error: {e}")
        return False, None

def test_neo4j_via_reconciliation():
    """Test de Neo4j via la Reconciliation API"""
    print(f"\n🔍 TEST NEO4J VIA RECONCILIATION API")
    print("=" * 60)

    try:
        # Test des noeuds Neo4j
        response = requests.get(f"{RECONCILIATION_API_URL}/graph/nodes?limit=10", timeout=15)
        print(f"✅ Status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            nodes = data.get('nodes', [])
            print(f"📊 Noeuds Neo4j trouvés: {len(nodes)}")

            if nodes:
                print(f"📋 Premier noeud: {nodes[0].get('id', 'N/A')}")
                print(f"📋 Type: {nodes[0].get('labels', ['N/A'])[0] if nodes[0].get('labels') else 'N/A'}")
                return True, data
            else:
                print("⚠️ Aucun noeud trouvé")
                return False, None
        else:
            print(f"❌ Error: {response.text}")
            return False, None

    except Exception as e:
        print(f"❌ Error: {e}")
        return False, None

def test_graphrag_via_reconciliation():
    """Test de GraphRAG via la Reconciliation API"""
    print(f"\n🔍 TEST GRAPHRAG VIA RECONCILIATION API")
    print("=" * 60)

    try:
        # Test d'une requête GraphRAG via Reconciliation
        query_data = {
            "query": "Quels sont les personnages principaux ?",
            "visible_node_ids": ["test_node_1", "test_node_2"],  # IDs de test
            "book_id": "villa_triste_modiano"
        }

        response = requests.post(
            f"{RECONCILIATION_API_URL}/query/reconciled",
            json=query_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        print(f"✅ Status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"✅ Succès: {data.get('success', False)}")

            neo4j_data = data.get('neo4j_context', {})
            graphrag_data = data.get('graphrag_response', {})

            print(f"📊 Noeuds Neo4j: {len(neo4j_data.get('nodes', []))}")
            print(f"📊 Relations Neo4j: {len(neo4j_data.get('relationships', []))}")
            print(f"🔍 Entités GraphRAG: {len(graphrag_data.get('searchPath', {}).get('entities', []))}")

            graphrag_answer = graphrag_data.get('answer', '')
            print(f"📝 Réponse GraphRAG: {graphrag_answer[:100]}...")

            return True, data
        else:
            print(f"❌ Error: {response.text}")
            return False, None

    except Exception as e:
        print(f"❌ Error: {e}")
        return False, None

def test_direct_apis():
    """Test direct des APIs individuelles"""
    print(f"\n🔍 TEST APIS INDIVIDUELLES")
    print("=" * 60)

    results = {}

    # Test GraphRAG API direct
    print(f"\n📚 GraphRAG API Direct:")
    try:
        response = requests.post(
            f"{GRAPHRAG_API_URL}/query",
            json={"query": "Test", "book_id": "villa_triste_modiano"},
            timeout=20
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ GraphRAG: {data.get('success', False)}")
            results['graphrag'] = True
        else:
            print(f"❌ GraphRAG Error: {response.status_code}")
            results['graphrag'] = False
    except Exception as e:
        print(f"❌ GraphRAG Error: {e}")
        results['graphrag'] = False

    return results

def test_data_sources():
    """Test des sources de données"""
    print(f"\n🔍 TEST SOURCES DE DONNÉES")
    print("=" * 60)

    # Test liste des livres GraphRAG
    print(f"\n📚 Livres GraphRAG (Google Drive):")
    try:
        response = requests.get(f"{GRAPHRAG_API_URL}/books", timeout=10)
        if response.status_code == 200:
            data = response.json()
            books = data.get('books', [])
            print(f"✅ Livres GraphML trouvés: {len(books)}")
            for book in books[:3]:
                print(f"  📖 {book.get('id')} - {book.get('name')}")
        else:
            print(f"❌ Erreur livres: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur livres: {e}")

    # Test statistiques Neo4j
    print(f"\n🗄️ Statistiques Neo4j:")
    try:
        response = requests.get(f"{RECONCILIATION_API_URL}/stats", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Neo4j Stats: {json.dumps(data, indent=2)}")
        else:
            print(f"❌ Erreur stats: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur stats: {e}")

def main():
    """Test principal de l'architecture complète"""
    print("🏛️ TEST ARCHITECTURE COMPLÈTE BORGES LIBRARY")
    print("=" * 80)
    print("Architecture: Frontend → Reconciliation API → {Neo4j, GraphRAG}")
    print("Sources: Neo4j Aura ← Neo4j API, Google Drive ← GraphRAG API")

    results = {
        'frontend': False,
        'reconciliation': False,
        'neo4j_via_reconciliation': False,
        'graphrag_via_reconciliation': False,
        'graphrag_direct': False
    }

    # Test 1: Frontend Vercel
    success, _ = test_component("FRONTEND VERCEL", FRONTEND_URL, "/", 200)
    results['frontend'] = success

    # Test 2: Reconciliation API
    success, _ = test_component("RECONCILIATION API", RECONCILIATION_API_URL, "/health", 200)
    results['reconciliation'] = success

    # Test 3: GraphRAG API
    success, _ = test_component("GRAPHRAG API", GRAPHRAG_API_URL, "/health", 200)
    results['graphrag_direct'] = success

    # Test 4: Neo4j via Reconciliation
    if results['reconciliation']:
        success, _ = test_neo4j_via_reconciliation()
        results['neo4j_via_reconciliation'] = success

    # Test 5: GraphRAG via Reconciliation
    if results['reconciliation']:
        success, _ = test_graphrag_via_reconciliation()
        results['graphrag_via_reconciliation'] = success

    # Test 6: Sources de données
    test_data_sources()

    # Test 7: APIs directes
    direct_results = test_direct_apis()

    # Résumé final
    print(f"\n" + "=" * 80)
    print("📊 RÉSUMÉ ARCHITECTURE")
    print("=" * 80)

    print(f"🌐 Frontend Vercel: {'✅' if results['frontend'] else '❌'}")
    print(f"🔄 Reconciliation API: {'✅' if results['reconciliation'] else '❌'}")
    print(f"🗄️ Neo4j via Reconciliation: {'✅' if results['neo4j_via_reconciliation'] else '❌'}")
    print(f"📚 GraphRAG via Reconciliation: {'✅' if results['graphrag_via_reconciliation'] else '❌'}")
    print(f"🔍 GraphRAG Direct: {'✅' if results['graphrag_direct'] else '❌'}")

    total_success = sum([1 for v in results.values() if v])
    total_tests = len(results)

    print(f"\n🎯 Score: {total_success}/{total_tests} composants fonctionnels")

    if total_success == total_tests:
        print("🎉 ARCHITECTURE COMPLÈTEMENT FONCTIONNELLE!")
        print("✅ Prêt pour connexion frontend → Reconciliation API")
    elif total_success >= 3:
        print("⚠️ Architecture partiellement fonctionnelle")
        print("🔧 Quelques ajustements nécessaires")
    else:
        print("❌ Architecture nécessite des corrections majeures")

    return results

if __name__ == "__main__":
    main()