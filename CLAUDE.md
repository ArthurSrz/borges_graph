# Principe et contraintes de conception #1 
Les noeuds qui s'affichent doivent toujours avoir des relations. Les noeuds orphelins ne sont pas admis dans l'interface.

# Principe et contraintes de conception #2
Les livres sont les entités "coeur" du graphe. Ils doivent toujours être le coeur de toutes les requêtes et visualisations de graphe 

# Principe et contraintes de conception #3
Les zones inter-livres doivent être investiguées en priorité par le graphRAG.

# "Principe de conception #4
Toujours laisser de l'espace entre les noeuds pour voir les relations"

# Principe de conception #5
La bibliothèque borges doit permettre une interprétatbilité de bout-en-bout du graphRAG, c'est à dire qu'on doit pouvoir naviguer du chunk de texte jusqu'à la réponse du RAG en passant par les noeuds et relations qui ont permis de les modéliser.

## Active Technologies
- Neo4j 5.14+ (relationship edits, provenance chains, edit history), Railway data volume (book_data mounted from local) (001-interactive-graphrag-refinement)
- Python 3.11 (backend), TypeScript 5.2.2 (frontend) + Flask 3.0.0, neo4j 5.14.0, nano-graphrag >=0.0.4, Next.js 14.2.0, 3d-force-graph (001-interactive-graphrag-refinement)
- Neo4j 5.14+ (graph), JSON KV stores (caches, embeddings), GraphML (book data) (001-interactive-graphrag-refinement)
- TypeScript 5.2.2, React 19.2.0, Next.js 16.0.4 + Tailwind CSS 3.3.5, 3d-force-graph 1.79.0, Three.js 0.181.0, D3 7.8.5 (002-basile-ui-redesign)
- N/A (visual-only changes, no data layer modifications) (002-basile-ui-redesign)

## Recent Changes
- 001-interactive-graphrag-refinement: Added Neo4j 5.14+ (relationship edits, provenance chains, edit history), Railway data volume (book_data mounted from local)
# IMPORTANT TESTING CONSIDERATIONS :
1. always launch the reconciliation API before the interface
2. as the long as there are error in the browser console, no further testing can be done.
3. Webpack issues is not to be addressed with clearing the cache, the issue is elsewhere

## Data Architecture: Neo4j + Filesystem Duality

**Strategy**: Neo4j is the single source of truth for the book LIST, but filesystem is still needed for chunk retrieval.

### Why Both?
- **Neo4j BOOK nodes**: Define which books exist, store entity counts, community counts, and graph relationships
- **Filesystem directories**: Store text chunks (`kv_store_text_chunks.json`) needed for GraphRAG retrieval

### The ID Mapping Problem

BOOK nodes in Neo4j have IDs like `LIVRE_Chien blanc` but GraphRAG needs filesystem directory names like `chien_blanc_gary`.

**Solution**: Each BOOK node has two identifiers:
- `id`: Neo4j node identifier (e.g., `LIVRE_Chien blanc`)
- `filesystem_id`: Maps to filesystem directory (e.g., `chien_blanc_gary`)

The `/books` endpoint returns `filesystem_id` as the `id` field for GraphRAG compatibility, plus `neo4j_id` for graph queries.

## Known Issues & Solutions

### Issue #1: Duplicate BOOK Nodes (Case Sensitivity)

**Symptom**: More than 10 yellow nodes appearing in graph visualization.

**Root Cause**: Case-sensitive duplicates in Neo4j, e.g.:
- `LIVRE_Villa triste` (lowercase 't')
- `LIVRE_Villa Triste` (uppercase 'T')

Data was split: one had RELATED_TO relationships, the other had HAS_CHUNK/HAS_COMMUNITY.

**Solution**:
1. Identify duplicates: `MATCH (b:BOOK) RETURN b.id, b.name ORDER BY b.id`
2. Merge relationships from duplicate to canonical node
3. Delete duplicate nodes with `DETACH DELETE`

### Issue #2: Entity Nodes with entity_type BOOK (Not Labeled)

**Symptom**: Extra yellow nodes despite correct BOOK node count.

**Root Cause**: Some Entity nodes have `entity_type: "BOOK"` property but lack the `:BOOK` label. Frontend colors nodes based on `entity_type` first, so these appear yellow.

**Detection**:
```cypher
MATCH (n:Entity)
WHERE n.entity_type = 'BOOK' AND NOT n:BOOK
RETURN n.id, n.name
```

**Solution**:
1. Merge RELATED_TO relationships to canonical BOOK nodes
2. Delete orphaned Entity nodes: `MATCH (n:Entity) WHERE n.entity_type = 'BOOK' AND NOT n:BOOK DETACH DELETE n`

### Issue #3: GraphRAG Broken After Switching to Neo4j Book List

**Symptom**: GraphRAG queries fail after `/books` endpoint switched to Neo4j source.

**Root Cause**: Neo4j returns book IDs like `LIVRE_La promesse de l'aube`, but GraphRAG needs filesystem directory names like `la_promesse_de_l_aube_romain_gary` to find chunk files.

**Solution**:
1. Add `filesystem_id` property to all BOOK nodes:
```cypher
MATCH (b:BOOK)
SET b.filesystem_id = CASE b.id
  WHEN 'LIVRE_Chien blanc' THEN 'chien_blanc_gary'
  WHEN 'LIVRE_La promesse de l''aube' THEN 'la_promesse_de_l_aube_romain_gary'
  // ... etc
END
```
2. Update `/books` endpoint to return `filesystem_id` as the `id` field
