# Borges Library Interface - Development Guidelines

## Design Principles

### Principe #1 - No Orphaned Nodes
Les noeuds qui s'affichent doivent toujours avoir des relations. Les noeuds orphelins ne sont pas admis dans l'interface.

### Principe #2 - Books at Center
Les livres sont les entités "coeur" du graphe. Ils doivent toujours être le coeur de toutes les requêtes et visualisations de graphe.

### Principe #3 - Inter-book Priority
Les zones inter-livres doivent être investiguées en priorité par le graphRAG.

### Principe #4 - Visual Spacing
Toujours laisser de l'espace entre les noeuds pour voir les relations.

### Principe #5 - End-to-End Interpretability
La bibliothèque Borges doit permettre une interprétabilité de bout-en-bout du graphRAG. On doit pouvoir naviguer du chunk de texte jusqu'à la réponse du RAG en passant par les noeuds et relations qui ont permis de les modéliser.

## Tech Stack

**Frontend:**
- TypeScript 5.2.2, React 19.2.0, Next.js 16
- Tailwind CSS 3.3.5
- 3d-force-graph 1.79.0, Three.js 0.181.0, D3 7.8.5

**Backend (separate repo):**
- [reconciliation-api](https://github.com/ArthurSrz/reconciliation-api) on Railway

## Testing Considerations

1. The reconciliation API must be running (Railway or localhost:5002) before testing the interface
2. Browser console errors must be resolved before further testing
3. Webpack issues should not be addressed by clearing cache - investigate root cause

## Key Files

- `3_borges-interface/src/components/BorgesLibrary.tsx` - Main app component
- `3_borges-interface/src/components/GraphVisualization3DForce.tsx` - 3D graph
- `3_borges-interface/src/components/QueryInterface.tsx` - Search interface
- `3_borges-interface/src/app/api/` - Next.js API routes (proxies to backend)
