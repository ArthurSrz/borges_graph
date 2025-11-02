#!/usr/bin/env python3
"""
Test local du GraphRAG pour diagnostiquer le problème
"""

import os
import sys
from pathlib import Path

def test_graphrag_setup():
    """Test de la configuration GraphRAG locale"""
    print("🔍 DIAGNOSTIC GRAPHRAG LOCAL")
    print("=" * 50)

    # Stay in nano-graphrag directory where the books are
    current_dir = os.getcwd()
    print(f"📁 Répertoire courant: {current_dir}")

    # List all directories
    print("\n📚 Dossiers disponibles:")
    book_dirs = []
    for item in os.listdir('.'):
        if os.path.isdir(item) and not item.startswith('.'):
            is_book = False
            # Check for GraphRAG data files
            graph_path = f"{item}/graph_chunk_entity_relation.graphml"
            index_path = f"{item}/nano_index"

            if os.path.exists(graph_path):
                print(f"   ✅ {item} (GraphML trouvé)")
                is_book = True
                book_dirs.append(item)
            elif os.path.exists(index_path):
                print(f"   ⚠️  {item} (index trouvé mais pas de GraphML)")
            else:
                print(f"   ❌ {item} (pas de données GraphRAG)")

    if not book_dirs:
        print("\n❌ Aucun livre avec données GraphRAG trouvé!")
        return False

    # Test import nano_graphrag
    print(f"\n🔧 Test import nano_graphrag:")
    try:
        from nano_graphrag import GraphRAG, QueryParam
        from nano_graphrag._llm import gpt_4o_mini_complete
        print("   ✅ Import réussi")
    except ImportError as e:
        print(f"   ❌ Erreur import: {e}")
        return False

    # Test création instance GraphRAG
    print(f"\n⚙️  Test création instance GraphRAG:")
    book_id = book_dirs[0]  # Premier livre disponible
    print(f"   Livre de test: {book_id}")

    try:
        working_dir = f"./{book_id}"
        print(f"   Working dir: {working_dir}")

        # Check files in working directory
        print(f"   Fichiers dans {working_dir}:")
        for file in os.listdir(working_dir):
            file_path = os.path.join(working_dir, file)
            size = os.path.getsize(file_path) if os.path.isfile(file_path) else 0
            print(f"     - {file} ({size} bytes)")

        graph_instance = GraphRAG(
            working_dir=working_dir,
            best_model_func=gpt_4o_mini_complete,
            cheap_model_func=gpt_4o_mini_complete,
            best_model_max_async=5,
            cheap_model_max_async=5
        )
        print("   ✅ Instance GraphRAG créée")
        return book_id, graph_instance

    except Exception as e:
        print(f"   ❌ Erreur création instance: {e}")
        return False

async def test_graphrag_query(book_id, graph_instance):
    """Test d'une requête GraphRAG"""
    print(f"\n🔍 Test requête GraphRAG sur {book_id}:")

    try:
        test_query = "Quels sont les personnages principaux ?"
        print(f"   Requête: {test_query}")

        # Test context seulement
        context_param = QueryParam(mode='local', only_need_context=True, top_k=10)
        context = await graph_instance.aquery(test_query, param=context_param)
        print(f"   ✅ Context récupéré ({len(context)} caractères)")

        # Test réponse complète
        answer_param = QueryParam(mode='local', top_k=10)
        answer = await graph_instance.aquery(test_query, param=answer_param)
        print(f"   ✅ Réponse récupérée ({len(answer)} caractères)")

        print(f"   📝 Début de la réponse: {answer[:100]}...")
        return True

    except Exception as e:
        print(f"   ❌ Erreur requête: {e}")
        return False

async def main():
    """Test principal"""
    print("DIAGNOSTIC COMPLET GRAPHRAG")
    print("=" * 50)

    # Test setup
    setup_result = test_graphrag_setup()
    if not setup_result:
        print("\n❌ Échec du setup GraphRAG")
        return False

    if isinstance(setup_result, tuple):
        book_id, graph_instance = setup_result

        # Test query
        query_success = await test_graphrag_query(book_id, graph_instance)

        if query_success:
            print("\n✅ GraphRAG fonctionne localement!")
            print("   Le problème vient probablement de:")
            print("   - Configuration Flask async")
            print("   - Variables d'environnement Railway")
            print("   - Port/networking Railway")
        else:
            print("\n❌ Problème avec les requêtes GraphRAG")
    else:
        print("\n❌ Problème avec la configuration GraphRAG")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())