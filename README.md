<p align="center">
  <img src="assets/header.webp" alt="Borges Library - Infinite Library of Knowledge" width="100%">
</p>

<h1 align="center">Borges Library</h1>

<p align="center">
  <strong>Interactive 3D knowledge graph explorer for literary analysis</strong>
</p>

<p align="center">
  <a href="https://borges-library-web.vercel.app">
    <img src="https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge" alt="Live Demo">
  </a>
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
  Named after Jorge Luis Borges' <em>"The Library of Babel"</em> — a universe in the form of a vast library containing all possible books.
</p>

---

## What is Borges Library?

Borges Library lets you explore literary works through their knowledge graphs. Ask questions in natural language, and see how entities (people, places, concepts) connect across different books.

**Key capabilities:**
- Query multiple books simultaneously using natural language
- Visualize extracted entities as interactive 3D nodes
- Trace answers back to source text passages (end-to-end interpretability)

## Features

| Feature | Description |
|---------|-------------|
| Multi-book querying | Ask questions across your entire library at once |
| 3D force-directed graph | Interactive visualization with color-coded entity types |
| End-to-end interpretability | Click any entity to see the source text that generated it |
| Mobile responsive | Works on desktop, tablet, and mobile devices |

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | Next.js 16, React 19, TypeScript 5.2 |
| Visualization | 3d-force-graph, Three.js, D3.js |
| Styling | Tailwind CSS, Heroicons |

## Live Demo

<p align="center">
  <a href="https://borges-library-web.vercel.app">
    <img src="https://img.shields.io/badge/Try%20it%20now-borges--library--web.vercel.app-blue?style=for-the-badge" alt="Try Demo">
  </a>
</p>

## Architecture

```
3_borges-interface/
├── src/
│   ├── app/           # Next.js App Router (pages + API routes)
│   ├── components/    # React components (graph, modals, query interface)
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Services and utilities
│   └── types/         # TypeScript definitions
```

### Key Components

| Component | Description |
|-----------|-------------|
| `BorgesLibrary.tsx` | Main application shell |
| `GraphVisualization3DForce.tsx` | 3D graph rendering |
| `QueryInterface.tsx` | Natural language search |
| `ProvenancePanel.tsx` | Answer source tracing |
| `EntityDetailModal.tsx` | Entity details and connections |
| `TextChunkModal.tsx` | Source text viewer |

## Related Repositories

| Repository | Description |
|------------|-------------|
| [reconciliation-api](https://github.com/ArthurSrz/reconciliation-api) | Backend API for graph queries, chunk retrieval, and GraphRAG search |

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
NEXT_PUBLIC_RECONCILIATION_API_URL=https://reconciliation-api-production.up.railway.app
```

For local development with the reconciliation API:

```env
NEXT_PUBLIC_RECONCILIATION_API_URL=http://localhost:5002
```

## Deployment

Deployed on **Vercel** with root directory set to `3_borges-interface/`.

The frontend connects to the reconciliation API deployed on Railway.

## Design Principles

1. **No orphaned nodes** - All displayed entities must have relationships
2. **Books at center** - Books are core entities, always central to queries
3. **Inter-book exploration** - Connections between books are prioritized
4. **Visual clarity** - Space between nodes to see relationships clearly
5. **Full interpretability** - Navigate from text chunks to RAG answers through the graph

## License

MIT

---

<p align="center">
  <sub>Built with GraphRAG | Inspired by Borges</sub>
</p>
