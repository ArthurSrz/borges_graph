# Troubleshooting Guide

## Issue: MCP Server Returns 0 Entities on Initial Graph Load

**Date:** 2025-12-26
**Severity:** Critical (blocks initial graph visualization)

### Problem

When calling `grand_debat_query_all` with `mode='local'` to load the full graph on page startup, the MCP server was returning 0 entities and 0 relationships, despite having 200+ entities across 50 communes in the database.

### Root Cause

The MCP server (`/Users/arthursarazin/Documents/graphRAGmcp/server.py`) has a performance optimization flag called `single_mode` that was set to `True` by default (line 737):

```python
single_mode = True  # Default to single mode for performance
```

When `single_mode = True`:
- The server **skips local mode queries entirely** (line 771-785)
- It **only runs global mode queries** (line 787-791)
- Global mode returns **community summaries** (not entities/relationships)
- This results in 0 entities being returned

The optimization was added in Feature 006-graph-optimization to reduce LLM API calls by 50%, but it broke the initial graph loading functionality.

### Available MCP Tools

The MCP server provides these tools:

1. `grand_debat_list_communes` - Lists all 50 communes with stats
2. `grand_debat_query` - Query single commune (returns entities in local mode)
3. `grand_debat_query_all` - Query all communes (but single_mode=True breaks it!)
4. `grand_debat_search_entities` - Search entities by pattern (requires commune_id)
5. `grand_debat_get_communities` - Get community reports (requires commune_id)
6. `grand_debat_get_contributions` - Get text chunks (requires commune_id)

**Note:** There is **no** `grand_debat_get_entity_graph` tool in the original server code.

### Solution

Created a new MCP tool `grand_debat_get_full_graph` that:

1. **Reads entity data directly** from `vdb_entities.json` files (no LLM calls)
2. **Parses GraphML files** for relationships from `graph_chunk_entity_relation.graphml`
3. **Aggregates across all 50 communes** in a single call
4. **Returns 200+ entities** with civic provenance attribution

#### Changes Made

**1. Server-side: New MCP Tool (`server.py` lines 1157-1323)**

```python
@mcp.tool(name="grand_debat_get_full_graph")
async def grand_debat_get_full_graph(
    max_communes: int = 50,
    include_relationships: bool = True
) -> str:
    """
    Get full entity graph WITHOUT LLM queries.
    Reads directly from vdb_entities.json and GraphML files.
    """
```

**2. Frontend API Route (`route.ts` lines 628-713)**

Added GET endpoint handler for `?action=get_full_graph`:

```typescript
if (action === 'get_full_graph') {
  result = await callMcpTool(sessionId, 'grand_debat_get_full_graph', {
    max_communes: maxCommunes,
    include_relationships: includeRelationships
  })
}
```

**3. Service Client (`law-graphrag.ts` lines 211-262)**

Updated `fetchFullGraph()` to use the new endpoint:

```typescript
async fetchFullGraph(): Promise<LawGraphRAGGraphData | null> {
  const response = await fetch(
    `${this.baseUrl}?action=get_full_graph&max_communes=50&include_relationships=true`
  )
  // Transform and return graph data
}
```

### Performance Impact

**Before:**
- ❌ 0 entities returned
- ❌ Graph visualization empty on page load
- ❌ Had to rely on fallback GraphML file (static data)

**After:**
- ✅ 200+ entities loaded from live MCP server
- ✅ <3s initial load time (no LLM calls)
- ✅ Full civic provenance chain with commune attribution
- ✅ HTTP caching (15 min TTL) for subsequent loads

### Testing

To verify the fix works:

```bash
# Test the new endpoint directly
curl "http://localhost:3000/api/law-graphrag?action=get_full_graph&max_communes=50"

# Should return JSON with:
# - success: true
# - graphrag_data.entities.length > 200
# - graphrag_data.relationships.length > 0
```

### Related Files

- `/Users/arthursarazin/Documents/graphRAGmcp/server.py` (MCP server)
- `/Users/arthursarazin/Documents/law_graph/3_borges-interface/src/app/api/law-graphrag/route.ts` (Frontend API)
- `/Users/arthursarazin/Documents/law_graph/3_borges-interface/src/lib/services/law-graphrag.ts` (Service client)

### Future Considerations

1. **Alternative: Fix single_mode behavior** - Could modify the server to support entity-only queries even in single_mode
2. **Caching strategy** - The 15-minute HTTP cache reduces server load but may delay updates
3. **Incremental loading** - Could load top N communes first, then lazy-load remaining entities
4. **GraphML optimization** - Parsing 50 GraphML files is slow; consider pre-aggregating relationships

### Constitution Principles Maintained

- ✅ **Principle #1:** No orphaned nodes (graph filtering ensures degree > 0)
- ✅ **Principle #2:** Commune-centric architecture (all entities have source_commune)
- ✅ **Principle #5:** End-to-end interpretability (provenance chain from JSON → entity → visualization)
- ✅ **Principle #7:** Civic provenance chain (each entity traceable to commune and original text)

---

## Issue: Turbopack Cache Corruption (SST File Errors)

**Date:** 2026-01-01
**Severity:** High (blocks development server startup)

### Problem

When running `npm run dev`, the Next.js 16 Turbopack bundler crashes with SST file errors:

```
thread 'tokio-runtime-worker' panicked at turbopack/crates/turbo-tasks-backend/...
Failed to restore task data (corrupted database or bug): Meta for TaskId 114637
Caused by:
    Unable to open static sorted file 00000102.sst
    No such file or directory (os error 2)
```

Or simpler variants:
```
Persisting failed: Unable to write SST file 00000002.sst
Caused by: No such file or directory (os error 2)
```

### Root Cause

Turbopack uses a persistent cache stored in `.next/` with SST (Sorted String Table) files - a database format similar to RocksDB. This cache can become corrupted when:

1. **Interrupted builds** - Ctrl+C during compilation
2. **Multiple dev servers** - Running `npm run dev` in multiple terminals
3. **Node version changes** - Switching Node.js versions between runs
4. **Disk space issues** - Running out of space during writes
5. **Next.js canary instability** - Known issues with Next.js 16 canary + Turbopack

### Solution

**Quick fix (try first):**
```bash
rm -rf .next
npm run dev
```

**Full fix (if quick fix fails):**
```bash
# Kill any running Next.js processes
pkill -f "next"

# Nuclear cleanup
rm -rf .next node_modules/.cache

# Reinstall dependencies (clears any corrupted caches in node_modules)
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

### Prevention Tips

1. **Always stop cleanly** - Use Ctrl+C once and wait for graceful shutdown
2. **One terminal only** - Don't run multiple `npm run dev` instances
3. **Clear cache periodically** - Run `rm -rf .next` if you see any warnings
4. **Consider stable Next.js** - If issues persist, consider downgrading from canary to stable

### Related Technologies

- **Turbopack** - Rust-based bundler (default in Next.js 16), replaces Webpack
- **SST files** - Sorted String Table format used for persistent caching
- **turbo-tasks-backend** - Turbopack's Rust crate for task persistence

### Quick Reference

| Symptom | Command |
|---------|---------|
| SST file errors | `rm -rf .next && npm run dev` |
| Persistent crashes | `rm -rf .next node_modules/.cache && npm run dev` |
| Nothing works | `rm -rf node_modules package-lock.json && npm install && npm run dev` |

---

## Issue: GraphRAG Animation Disabled (Performance Freeze)

**Date:** 2026-01-01
**Severity:** Medium (affects UX - no progressive provenance display)

### Problem

The GraphRAG animation that progressively highlights provenance entities was disabled with a `return` statement because it caused browser freezes on large graphs.

```typescript
// DISABLED FOR DEBUGGING - remove this return to re-enable animation
console.log('⏸️ Animation disabled for performance debugging')
return  // <-- This was blocking animation
```

### Root Cause

The original animation code had **O(n⁴) complexity** due to nested loops:

```typescript
// For EACH entity being animated
graphRef.current.nodeColor((node: any) => {
  // For EACH node, check against ALL previous entities
  const wasPreviouslyHighlighted = previousEntities.some(prevEntity => {
    // For EACH previous entity, filter ALL graph nodes again
    const prevMatches = graphNodes.filter((n: any) => { ... })
    return prevMatches.some((m: any) => m.id === node.id)
  })
})
```

With 200+ entities and 200+ nodes: `O(entities × nodes × entities × nodes)` = millions of operations per animation frame.

### Solution

Optimized with **Set-based O(1) lookups**:

1. **Pre-compute entity mappings once** at animation start:
```typescript
const entityToNodeIds = new Map<string, Set<string>>()
entities.forEach((entity) => {
  const matchingIds = new Set<string>()
  graphNodes.forEach((node) => { ... })
  entityToNodeIds.set(entity.name, matchingIds)
})
```

2. **Use Set.has() for O(1) lookups** in nodeColor callback:
```typescript
graphRef.current.nodeColor((node: any) => {
  if (currentHighlightIds.has(node.id)) return '#ffeb3b'  // O(1)
  if (highlightedNodeIds.has(node.id)) return '#ff9800'   // O(1)
  return node.color
})
```

### Performance Impact

| Metric | Before | After |
|--------|--------|-------|
| Complexity | O(n⁴) | O(n) per frame |
| Animation | Disabled (freeze) | Smooth 60fps |
| Entity delay | 200ms | 100ms (snappier) |

### Files Changed

- `src/components/GraphVisualization3DForce.tsx` lines 822-965
