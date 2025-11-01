#!/bin/bash

echo "🚀 Déploiement de Borges Library sur Vercel"
echo "============================================"

# Naviguer vers le répertoire du projet
cd "$(dirname "$0")"

echo "📁 Répertoire actuel: $(pwd)"

# Vérifier les fichiers nécessaires
echo "🔍 Vérification des fichiers..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json manquant"
    exit 1
fi

if [ ! -f "next.config.js" ]; then
    echo "❌ next.config.js manquant"
    exit 1
fi

echo "✅ Fichiers vérifiés"

# Installer les dépendances (optionnel)
echo "📦 Installation des dépendances..."
npm install

# Supprimer l'ancienne configuration Vercel
echo "🧹 Nettoyage..."
rm -rf .vercel

# Déployer sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --name borges-library-new --yes --prod

echo "✅ Déploiement terminé !"
echo ""
echo "🌐 Votre interface est maintenant disponible sur Vercel"
echo "📋 Pour voir l'URL, utilisez: vercel ls"