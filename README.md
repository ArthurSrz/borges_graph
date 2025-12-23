<p align="center">
  <img src="assets/header.webp?v=2" alt="Grand Débat National - Civic Knowledge Graph Explorer" width="100%">
</p>

<h1 align="center">Grand Débat National GraphRAG</h1>

<p align="center">
  <strong>Explore citizen voices through an interactive 3D knowledge graph</strong>
</p>

<p align="center">
  <em>« La voix des citoyens, visualisée »</em>
</p>

<p align="center">
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16">
  </a>
  <a href="https://react.dev">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19">
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  </a>
</p>

<p align="center">
  Explore the <em>Cahiers de Doléances</em> from the 2019 Grand Débat National — citizen contributions from 50 communes in Charente-Maritime.
</p>

---

## What is this?

In early 2019, France launched the **Grand Débat National** — an unprecedented national consultation where citizens could voice their concerns, hopes, and proposals for the future of the Republic. This interface brings those voices back to life.

Explore the *Cahiers de Doléances* through an interactive 3D knowledge graph. Ask questions in natural language, and watch as civic themes, concerns, and proposals emerge — connected across communes, revealing patterns in what citizens truly care about.

**Single-purpose interface**: Connects exclusively to the Grand Débat National GraphRAG MCP server. No other data sources.

**Data source**:
- **MCP Server**: `https://graphragmcp-production.up.railway.app/mcp`
- **Dataset**: Cahiers de Doléances 2019
- **Coverage**: 50 communes in Charente-Maritime
- **Entities**: ~8,000+ extracted from citizen contributions

## Features

| Feature | Description |
|---------|-------------|
| Civic query | Ask questions about citizen concerns, proposals, and themes |
| 3D force-directed graph | Interactive visualization of civic entities and relationships |
| Commune attribution | Every answer traceable to source commune and citizen text |
| Cross-commune analysis | Compare themes and concerns across all 50 communes |
| Mobile responsive | Works on desktop, tablet, and mobile devices |

## Example Queries

- "Quelles sont les préoccupations des citoyens sur les impôts ?"
- "What do citizens say about public services?"
- "Quels thèmes reviennent le plus souvent ?"

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | Next.js 16, React 19, TypeScript 5.2 |
| Visualization | 3d-force-graph, Three.js, D3.js |
| Styling | Tailwind CSS |
| Backend | MCP (Model Context Protocol) over HTTP |

## Architecture

```
3_borges-interface/
├── src/
│   ├── app/api/law-graphrag/   # MCP proxy route
│   ├── components/             # React components (graph, modals, query)
│   ├── lib/services/           # MCP client service
│   └── types/                  # TypeScript definitions
```

### Key Components

| Component | Description |
|-----------|-------------|
| `BorgesLibrary.tsx` | Main application shell |
| `GraphVisualization3DForce.tsx` | 3D graph rendering |
| `QueryInterface.tsx` | Natural language search |
| `EntityDetailModal.tsx` | Entity details and connections |

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
cd 3_borges-interface
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create `3_borges-interface/.env.local`:

```env
# Grand Débat National MCP Server (required)
LAW_GRAPHRAG_API_URL=https://graphragmcp-production.up.railway.app
```

## Deployment

Deployed on **Vercel** with:
- Root directory: `3_borges-interface/`
- Framework preset: Next.js

The interface connects to the MCP server deployed on Railway.

## Constitution (Design Principles)

This project follows **Constitution v3.0.0** - a single-purpose civic knowledge graph interface:

| Principle | Description |
|-----------|-------------|
| I. End-to-End Interpretability | Navigate from text chunks to RAG answers through entities |
| II. Civic Provenance Chain | All data traceable to source commune and citizen text |
| III. No Orphan Nodes | All displayed entities must have relationships |
| IV. Commune-Centric | Communes are the primary organizational units |
| V. Cross-Commune Analysis | Enable discovering patterns across multiple communes |
| VI. Single-Source | NO source selection - connects ONLY to Grand Débat MCP |
| VII. Functional Interface | Minimalist design focused on civic content |
| VIII. Mobile-First | Fully functional on mobile devices |

## MCP Tools Available

The MCP server provides these tools:

| Tool | Description |
|------|-------------|
| `grand_debat_list_communes` | List all 50 communes with statistics |
| `grand_debat_query` | Query a single commune |
| `grand_debat_query_all` | Query across all communes |
| `grand_debat_search_entities` | Search entities by pattern |
| `grand_debat_get_communities` | Get thematic community reports |
| `grand_debat_get_contributions` | Get original citizen texts |

## License

MIT

---

<p align="center">
  <sub>Built with GraphRAG | Grand Débat National 2019 | 50 communes de Charente-Maritime</sub>
  <br>
  <sub>Header image generated with <a href="https://huggingface.co/spaces/mcp-tools/Z-Image-Turbo">Z-Image Turbo</a> on Hugging Face</sub>
</p>
