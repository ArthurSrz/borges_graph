# Grand Débat National Interface - Development Guidelines

## Single-Purpose Interface (Constitution v3.0.0)

This interface connects **EXCLUSIVELY** to the Grand Débat National MCP server.
- **MCP Server**: `https://graphragmcp-production.up.railway.app/mcp`
- **Dataset**: Cahiers de Doléances 2019
- **Coverage**: 50 communes in Charente-Maritime
- **NO** source selection or toggle functionality

## Design Principles

### Principe #1 - No Orphaned Nodes
Les noeuds qui s'affichent doivent toujours avoir des relations. Les noeuds orphelins ne sont pas admis dans l'interface.

### Principe #2 - Commune-Centric Architecture
Les communes sont les entités organisationnelles du graphe. Toutes les requêtes et visualisations sont centrées sur les communes.

### Principe #3 - Cross-Commune Analysis
Les connexions inter-communes et les patterns régionaux doivent être explorés en priorité.

### Principe #4 - Visual Spacing
Toujours laisser de l'espace entre les noeuds pour voir les relations.

### Principe #5 - End-to-End Interpretability
L'interface doit permettre une interprétabilité de bout-en-bout du graphRAG. On doit pouvoir naviguer du chunk de texte citoyen jusqu'à la réponse du RAG.

### Principe #6 - Single-Source
L'interface se connecte UNIQUEMENT au serveur MCP Grand Débat National. Pas de sélection de source.

### Principe #7 - Civic Provenance Chain
Chaque entité doit être traçable jusqu'à sa commune source et au texte citoyen original.

## Tech Stack

**Frontend:**
- TypeScript 5.2.2, React 19.2.0, Next.js 16
- Tailwind CSS 3.3.5
- 3d-force-graph 1.79.0, Three.js 0.181.0, D3 7.8.5

**Backend:**
- MCP Server: `graphragmcp-production.up.railway.app`
- Protocol: MCP (Model Context Protocol) over HTTP with JSON-RPC

## Key Files

- `3_borges-interface/src/components/BorgesLibrary.tsx` - Main app component
- `3_borges-interface/src/components/GraphVisualization3DForce.tsx` - 3D graph
- `3_borges-interface/src/app/api/law-graphrag/route.ts` - MCP proxy route
- `3_borges-interface/src/lib/services/law-graphrag.ts` - MCP client service

## MCP Tools Available

| Tool | Description |
|------|-------------|
| `grand_debat_list_communes` | List all 50 communes |
| `grand_debat_query` | Query single commune |
| `grand_debat_query_all` | Query across all communes |
| `grand_debat_search_entities` | Search entities by pattern |
| `grand_debat_get_communities` | Get thematic community reports |

## Environment Variables

```env
LAW_GRAPHRAG_API_URL=https://graphragmcp-production.up.railway.app
```

## Testing

1. MCP server must be accessible before testing
2. Test with civic queries: "Quelles sont les préoccupations sur les impôts ?"
3. Verify commune attribution appears in results
