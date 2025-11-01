# 🏛️ Bibliothèque de Borges

Une exploration interactive des connexions infinies entre les livres, inspirée par Jorge Luis Borges.

## Architecture

- **Frontend**: Next.js 14 avec TypeScript et Tailwind CSS
- **Visualisation**: D3.js pour les graphes de connaissances
- **Backend**: API routes Next.js
- **Données**: GraphML depuis Google Drive
- **GraphRAG**: API Railway pour les requêtes intelligentes

## Fonctionnalités

- **Exploration interactive** des graphes de connaissances littéraires
- **Visualisation dynamique** des relations entre entités
- **Requêtes GraphRAG** pour analyser les livres
- **Interface moderne** avec thème sombre inspiré de Borges

## Développement

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build production
npm run build

# Type checking
npm run type-check
```

## Données

Les données des livres sont téléchargées depuis Google Drive et contiennent :
- Fichiers GraphML avec entités et relations
- Cache des réponses LLM
- Données de chunks textuels
- Embeddings vectoriels

## Design Science Research Methodology

Ce projet respecte les principes de Design Science Research :
1. **Données structurées** dans GraphML
2. **Visualisation claire** des relations
3. **Interface intuitive** pour l'exploration
4. **Requêtes intelligentes** via GraphRAG

---

*Développé par Arthur Sarazin*