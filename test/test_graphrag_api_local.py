#!/usr/bin/env python3
"""
Test de l'API GraphRAG en local pour diagnostiquer les problèmes
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
import time
import subprocess
import signal
from threading import Thread

def test_local_api():
    """Test de l'API GraphRAG en local"""
    print("🔍 TEST API GRAPHRAG EN LOCAL")
    print("=" * 50)

    # Démarrer l'API en arrière-plan
    api_process = None
    try:
        # Changer vers le répertoire parent
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        print(f"📁 Lancement depuis: {parent_dir}")

        # Lancer l'API
        api_process = subprocess.Popen(
            [sys.executable, 'graphrag_api.py'],
            cwd=parent_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env={**os.environ, 'PORT': '5555'}  # Port de test
        )

        # Attendre que l'API démarre
        print("⏳ Attente démarrage API (10 secondes)...")
        time.sleep(10)

        # Test de santé
        print("\n🔍 Test endpoint /health")
        try:
            response = requests.get("http://localhost:5555/health", timeout=5)
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.json()}")
        except Exception as e:
            print(f"   ❌ Erreur health: {e}")

        # Test de requête simple
        print("\n🔍 Test endpoint /query")
        try:
            response = requests.post(
                "http://localhost:5555/query",
                json={"query": "test", "mode": "local"},
                timeout=30
            )
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Succès: {data.get('success', False)}")
                print(f"   📚 Livre: {data.get('book_id', 'N/A')}")
                answer = data.get('answer', '')
                print(f"   📝 Début réponse: {answer[:100]}...")
            else:
                print(f"   ❌ Erreur: {response.text}")
        except Exception as e:
            print(f"   ❌ Erreur query: {e}")

        # Test liste des livres
        print("\n🔍 Test endpoint /books")
        try:
            response = requests.get("http://localhost:5555/books", timeout=5)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                books = response.json().get('books', [])
                print(f"   📚 {len(books)} livres trouvés:")
                for book in books[:3]:
                    print(f"      - {book['id']}")
            else:
                print(f"   ❌ Erreur: {response.text}")
        except Exception as e:
            print(f"   ❌ Erreur books: {e}")

    finally:
        # Arrêter l'API
        if api_process:
            print("\n🛑 Arrêt de l'API")
            api_process.terminate()
            try:
                api_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                api_process.kill()

            # Afficher les logs
            stdout, stderr = api_process.communicate()
            if stdout:
                print(f"\n📋 STDOUT:")
                print(stdout.decode()[:500])
            if stderr:
                print(f"\n❌ STDERR:")
                print(stderr.decode()[:500])

def test_api_manually():
    """Instructions pour test manuel"""
    print("\n" + "=" * 50)
    print("🔧 TEST MANUEL ALTERNATIF")
    print("=" * 50)
    print("Si le test automatique échoue, essayez manuellement:")
    print()
    print("1. Ouvrez un terminal et naviguez vers:")
    print("   cd /Users/arthursarazin/Documents/nano-graphrag")
    print()
    print("2. Installez les dépendances nécessaires:")
    print("   pip install flask flask-cors")
    print()
    print("3. Lancez l'API:")
    print("   python graphrag_api.py")
    print()
    print("4. Dans un autre terminal, testez:")
    print("   curl http://localhost:5001/health")
    print("   curl -X POST http://localhost:5001/query -H 'Content-Type: application/json' -d '{\"query\":\"test\"}'")

if __name__ == "__main__":
    test_local_api()
    test_api_manually()