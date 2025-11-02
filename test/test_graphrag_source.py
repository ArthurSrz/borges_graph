#!/usr/bin/env python3
"""
Test de nano-graphrag depuis les sources locales
"""

import os
import sys

# Add nano-graphrag to Python path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'nano-graphrag'))

def test_import():
    """Test import depuis les sources"""
    print("🔍 TEST IMPORT NANO-GRAPHRAG DEPUIS LES SOURCES")
    print("=" * 60)

    try:
        from nano_graphrag import GraphRAG, QueryParam
        from nano_graphrag._llm import gpt_4o_mini_complete
        print("✅ Import réussi depuis les sources!")
        return True
    except ImportError as e:
        print(f"❌ Erreur import: {e}")
        return False

def test_graphrag_instance():
    """Test création d'une instance GraphRAG"""
    print("\n🔍 TEST CREATION INSTANCE GRAPHRAG")
    print("=" * 60)

    try:
        from nano_graphrag import GraphRAG, QueryParam
        from nano_graphrag._llm import gpt_4o_mini_complete

        # Trouver un livre avec des données
        book_dirs = []
        for item in os.listdir('.'):
            if os.path.isdir(item) and not item.startswith('.'):
                graph_path = f"{item}/graph_chunk_entity_relation.graphml"
                if os.path.exists(graph_path):
                    book_dirs.append(item)
                    print(f"✅ Livre trouvé: {item}")

        if not book_dirs:
            print("❌ Aucun livre avec données GraphRAG trouvé!")
            return False

        # Tester avec le premier livre
        book_id = book_dirs[0]
        working_dir = f"./{book_id}"

        print(f"\n📚 Test avec: {book_id}")
        print(f"📁 Working dir: {working_dir}")

        # Créer l'instance
        graph_instance = GraphRAG(
            working_dir=working_dir,
            best_model_func=gpt_4o_mini_complete,
            cheap_model_func=gpt_4o_mini_complete,
            best_model_max_async=5,
            cheap_model_max_async=5
        )

        print("✅ Instance GraphRAG créée avec succès!")
        return True, book_id, graph_instance

    except Exception as e:
        print(f"❌ Erreur création instance: {e}")
        return False

async def test_graphrag_query(book_id, graph_instance):
    """Test d'une requête GraphRAG"""
    print(f"\n🔍 TEST REQUETE GRAPHRAG")
    print("=" * 60)

    try:
        from nano_graphrag import QueryParam

        test_query = "Quels sont les personnages principaux ?"
        print(f"📝 Requête: {test_query}")

        # Test requête
        param = QueryParam(mode='local', top_k=10)
        answer = await graph_instance.aquery(test_query, param=param)

        print(f"✅ Requête réussie!")
        print(f"📄 Longueur réponse: {len(answer)} caractères")
        print(f"📝 Début de la réponse: {answer[:150]}...")

        return True

    except Exception as e:
        print(f"❌ Erreur requête: {e}")
        return False

async def main():
    """Test principal"""
    print("TEST COMPLET NANO-GRAPHRAG DEPUIS LES SOURCES")
    print("=" * 80)

    # Test 1: Import
    if not test_import():
        return False

    # Test 2: Instance
    instance_result = test_graphrag_instance()
    if not instance_result:
        return False

    is_success, book_id, graph_instance = instance_result

    # Test 3: Requête
    query_success = await test_graphrag_query(book_id, graph_instance)

    if query_success:
        print("\n" + "=" * 80)
        print("🎉 TOUS LES TESTS RÉUSSIS!")
        print("✅ Nano-GraphRAG fonctionne depuis les sources locales")
        print("✅ Prêt pour l'API GraphRAG")
        return True
    else:
        print("\n❌ Échec des tests de requête")
        return False

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())