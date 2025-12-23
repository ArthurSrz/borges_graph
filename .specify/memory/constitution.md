<!--
SYNC IMPACT REPORT
==================
Version Change: 1.5.0 → 2.0.0 (MAJOR - Domain pivot from literature to law)

Modified Principles:
- Principle I: End-to-end interpretability → End-to-end Interpretability (unchanged core, legal context added)
- Principle II: Babel library mimetism → Removed (literature-specific, not applicable to legal domain)
- Principle III: No orphan nodes → No Orphan Nodes (unchanged)
- Principle IV: Book-centric architecture → Legal Document-Centric Architecture (redefined for legal corpus)
- Principle V: Inter-book knowledge exploration → Cross-Document Legal Analysis (redefined for legal domain)
- Principle VI: Extensible literature foundation → Extensible Legal Corpus Foundation (redefined)
- Principle VII: Basile minimalism → Functional Legal Interface (adapted for legal workflows)
- Principle VIII: Mobile-first responsiveness → Mobile-First Responsiveness (unchanged)

Added Principles:
- Principle II: Legal Provenance Chain (NEW - legal citation and authority tracking)
- Principle IX: RAG Observability and Comparison (NEW - aligns with 003-rag-observability-comparison feature)

Removed Principles:
- Original Principle II: Babel library mimetism (literature-specific metaphor not applicable)

Clarifications Added:
- Legal-specific terminology throughout
- API endpoint references updated for law-graphRAG-reconciliation-api
- Legal entity types (laws, articles, jurisprudence, doctrine)

Templates Requiring Updates:
- .specify/templates/plan-template.md: Constitution Check section generic ✅ compatible
- .specify/templates/spec-template.md: Responsive design section generic ✅ compatible
- .specify/templates/tasks-template.md: Mobile testing phase generic ✅ compatible

Follow-up TODOs:
- Update CLAUDE.md to reflect new legal domain focus
- Update README.md references to Borges Library → Law GraphRAG

Change Rationale:
- MAJOR version (2.0.0) because:
  1. Core domain pivot from literature (Borges Library) to law (Law GraphRAG)
  2. Principle II completely replaced (literature metaphor removed)
  3. Entity types redefined (books → legal documents)
  4. API endpoints target law-graphRAG-reconciliation-api
  5. New principle added for RAG observability (aligns with current feature branch)
-->

# Law GraphRAG Constitution

## Core Principles

### I. End-to-End Interpretability

**The system MUST enable navigation from text chunks to RAG answers through the legal knowledge graph.**

Users MUST be able to trace the complete reasoning path of the GraphRAG system:
- From original text chunks in source legal documents
- Through extracted legal entities and relationships
- Across graph traversal paths
- To final RAG-generated answers with legal citations

Every step of the legal knowledge extraction, storage, retrieval, and generation pipeline
MUST be inspectable and navigable.

**Rationale**: Legal analysis demands interpretability. Legal professionals, researchers, and
citizens need to understand how answers were derived, validate the legal reasoning, verify
citations, and explore alternative interpretive paths through the knowledge graph. Transparency
in legal RAG systems is essential for trust and professional accountability.

**Implementation Requirements**:
- Text chunk storage MUST preserve source attribution (document, article, section, paragraph)
- Entity extraction MUST maintain bidirectional links to source chunks
- Graph queries MUST return traversal paths, not just final results
- RAG responses MUST include provenance chains (answer → nodes → relationships → chunks)
- UI MUST provide click-through navigation across the entire pipeline
- All intermediate representations MUST be accessible via API and interface
- Legal citations MUST link directly to source text passages

---

### II. Legal Provenance Chain

**The system MUST maintain authoritative citation chains for all legal knowledge.**

Every piece of legal information surfaced by the system MUST be traceable to its
authoritative source with proper legal citation formatting:

- **Primary sources**: Laws, statutes, regulations, constitutional texts
- **Secondary sources**: Jurisprudence, case law, court decisions
- **Tertiary sources**: Doctrine, legal commentary, academic analysis

**Rationale**: Legal validity depends on proper authority chains. A legal RAG system
that cannot cite its sources is professionally useless. Legal professionals require
citation accuracy to verify claims, build arguments, and ensure compliance.

**Implementation Requirements**:
- Every entity MUST store its source document type (law, jurisprudence, doctrine)
- Relationships MUST capture the nature of legal references (cites, amends, repeals, interprets)
- API responses MUST include citation metadata (document ID, article number, date, jurisdiction)
- The UI MUST display authority hierarchy (constitutional → legislative → regulatory → judicial)
- Conflicting interpretations MUST be surfaced with their respective authorities
- Citation format MUST follow legal conventions for the target jurisdiction

---

### III. No Orphan Nodes

**All nodes displayed in the interface MUST have at least one relationship.**

Orphan nodes (isolated entities without connections) are prohibited in the visualization
layer. This principle ensures that:
- Every entity shown provides relational context
- Graph visualizations maintain semantic coherence
- Users always see how legal entities connect to the broader knowledge graph
- Query results filter out disconnected nodes before rendering

**Rationale**: The Law GraphRAG system is fundamentally about exploring relationships and
connections between legal entities. Orphan nodes provide no navigational value and
clutter the interface with isolated facts that cannot be explored.

**Implementation Requirements**:
- API endpoints MUST filter query results to exclude nodes with zero relationships
- Graph visualizations MUST validate node connectivity before rendering
- Backend queries MUST include relationship count validation
- Frontend components MUST display relationship counts for transparency

---

### IV. Legal Document-Centric Architecture

**Legal documents MUST be the core entities in all graph queries and visualizations.**

The knowledge graph is organized around legal documents as primary entities. All queries,
visualizations, and explorations MUST treat legal documents as the central organizing principle:
- Search queries prioritize document-entity relationships
- Graph traversals anchor on document nodes
- Entity relationships are contextualized through their connections to source documents
- Visualization layouts position legal documents as structural hubs

**Legal Document Hierarchy**:
1. **Laws & Statutes**: Primary legislative texts
2. **Articles & Sections**: Structural subdivisions within laws
3. **Jurisprudence**: Court decisions interpreting laws
4. **Doctrine**: Academic and professional commentary

**Rationale**: Legal documents are the fundamental units of legal knowledge. By making them
the architectural center, we ensure that all legal exploration remains grounded in authoritative
sources, enabling users to trace insights back to their legal origins.

**Implementation Requirements**:
- GraphRAG queries MUST start from or include legal document nodes
- Database indexes MUST optimize for document-centered queries
- API responses MUST include document context for all entities
- Visualization algorithms MUST calculate layouts with documents as anchor points
- Document metadata MUST include: jurisdiction, enactment date, status (in force, repealed, amended)

---

### V. Cross-Document Legal Analysis

**Graph exploration MUST prioritize relationships that span multiple legal documents.**

The most valuable legal insights emerge from connections across different legal texts.
The system MUST favor discovering, surfacing, and visualizing cross-document relationships:
- GraphRAG search prioritizes multi-document relationship paths
- Query ranking weights cross-document connections higher
- Visualizations highlight bridges between different legal sources
- Relationship types that connect documents are given higher importance

**Key Cross-Document Relationships**:
- Law A **amends** Law B
- Jurisprudence X **interprets** Article Y
- Doctrine Z **analyzes** Decision W
- Regulation R **implements** Statute S

**Rationale**: While intra-document relationships are important, the unique value of a
legal knowledge graph lies in revealing how laws, interpretations, and doctrines connect
across different texts. These cross-references generate novel insights impossible to
discover through single-document analysis.

**Implementation Requirements**:
- GraphRAG algorithms MUST include cross-document relationship scoring
- Query expansion MUST traverse document boundaries
- Relationship weights MUST account for cross-document connections
- Analytics MUST track and report cross-document coverage metrics
- Timeline analysis MUST show how interpretations evolve across documents

---

### VI. Extensible Legal Corpus Foundation

**The system MUST be built upon the nano-graphRAG library and designed for easy addition of new legal documents.**

The Law GraphRAG originates from and builds upon the nano-graphRAG library as its
foundational knowledge extraction and retrieval layer. The architecture MUST prioritize
the seamless integration of new legal content:

- **nano-graphRAG foundation**: The system leverages nano-graphRAG for entity extraction, relationship building, and graph-based retrieval
- **Modular document ingestion**: Adding new legal documents MUST be a straightforward, standardized process
- **Scalable corpus expansion**: The system MUST handle growing legal collections without architectural changes
- **Jurisdiction-agnostic processing**: The ingestion pipeline MUST work with diverse legal systems and formats

**Rationale**: Legal knowledge is constantly evolving—new laws are enacted, jurisprudence
accumulates, doctrine develops. By building on nano-graphRAG and prioritizing extensibility,
we ensure that:
1. The system inherits a proven, well-tested GraphRAG implementation
2. Legal corpus can expand with minimal friction
3. New legal sources integrate seamlessly with existing knowledge
4. The architecture adapts to different legal traditions and jurisdictions

**Implementation Requirements**:
- Document ingestion MUST follow a documented, repeatable pipeline based on nano-graphRAG
- New document addition MUST NOT require code changes to core system components
- Configuration-driven document registration MUST specify metadata, source files, and processing parameters
- Ingestion pipelines MUST support batch processing for adding multiple documents
- Progress tracking MUST provide visibility into document processing status
- Rollback mechanisms MUST allow removal of incorrectly processed documents
- The system MUST validate new document integration against existing graph consistency rules
- Documentation MUST include step-by-step guides for adding new legal content
- API endpoints MUST support programmatic document addition for automation workflows

---

### VII. Functional Legal Interface

**The interface MUST prioritize clarity, efficiency, and professional legal workflows.**

The Law GraphRAG interface is designed for legal professionals, researchers, and citizens
seeking legal knowledge. The design philosophy emphasizes:

- **Functional clarity**: Every UI element MUST serve a clear legal research purpose
- **Content-centric layout**: Legal text and citations are the primary visual content
- **Professional typography**: Readable text optimized for legal document display
- **Restrained color palette**: A limited, muted color scheme that does not compete with content
- **Efficient navigation**: Quick access to search, browse, and contextual legal actions

**SCOPE LIMITATION**: This principle applies to VISUAL STYLING ONLY (fonts, colors, buttons, panels).
Functionality MUST remain 100% unchanged. Graph animations MUST be fully preserved.

**Rationale**: Legal professionals require efficient, distraction-free interfaces. Users come
to explore legal knowledge, not to admire interface design. Minimalism serves the professional
mission.

**Implementation Requirements**:
- UI components MUST pass a "purpose test": if an element cannot justify its existence, remove it
- Color palette MUST be limited to 4-5 primary colors maximum
- Typography MUST use a maximum of 2 font families (one for body, one for accent/headings)
- White space MUST be used deliberately to separate content areas and reduce cognitive load
- Navigation MUST be streamlined: Browse, Search, and contextual legal actions only
- Loading states MUST be minimal and non-distracting (subtle spinners, not elaborate animations)
- Error states MUST be informative but visually understated
- The graph visualization is the ONE exception where visual complexity is permitted—all physics
  simulations, node expansion, zoom, pan, and interactive animations MUST be preserved unchanged
- Legal citation formatting MUST follow professional conventions

---

### VIII. Mobile-First Responsiveness

**The interface MUST be fully functional and usable on mobile devices.**

Given that legal professionals and citizens may access the Law GraphRAG from various devices,
the interface MUST provide a seamless experience across all screen sizes:

- **Touch-optimized interactions**: All graph interactions (tap to select, pinch to zoom, drag to pan)
  MUST work naturally with touch gestures
- **Responsive layout**: UI components MUST adapt fluidly to screen sizes from 320px to desktop
- **Mobile-first design**: Design decisions MUST prioritize mobile usability, then enhance for larger screens
- **Performance on mobile**: The system MUST remain performant on mobile devices with limited resources
- **Readable typography**: Legal text MUST be legible without zooming on mobile screens

**Rationale**: Legal research is not confined to desktop computers. Users may need to access
legal information during meetings, in courtrooms, or while consulting clients. A mobile-responsive
interface ensures the system is accessible wherever legal questions arise.

**Implementation Requirements**:
- CSS MUST use responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- Touch targets MUST be at least 44x44 pixels for comfortable tapping
- Graph visualization MUST support touch gestures: tap (select), pinch (zoom), drag (pan), double-tap (focus)
- Navigation menus MUST collapse to mobile-friendly formats (hamburger menu, bottom navigation)
- Modals and panels MUST be scrollable and dismissible on small screens
- Font sizes MUST use relative units (rem/em) with a minimum body text of 16px on mobile
- Images and SVGs MUST scale appropriately without overflow or cropping
- Testing MUST include real device testing on iOS and Android, not just browser emulation
- Performance budgets MUST target < 3s First Contentful Paint on 3G connections
- The 3D graph MUST gracefully degrade or adapt for devices with limited GPU capabilities

---

### IX. RAG Observability and Comparison

**The system MUST provide comprehensive observability into RAG operations and enable comparison between implementations.**

Legal RAG systems require transparency about their retrieval and generation processes.
Users and developers MUST be able to observe, measure, and compare RAG performance:

- **Query tracing**: Every query MUST be traceable through retrieval, ranking, and generation stages
- **Metrics capture**: Latency, token usage, retrieval quality, and generation confidence MUST be measured
- **A/B comparison**: Different RAG configurations MUST be comparable side-by-side
- **Performance dashboards**: Aggregated metrics MUST be visualizable for system monitoring

**Rationale**: Legal applications demand reliability and consistency. Observability enables:
1. Debugging of unexpected or incorrect answers
2. Optimization of retrieval and generation parameters
3. Comparison between different RAG implementations or configurations
4. Demonstration of system reliability for professional use

**Implementation Requirements**:
- Every query MUST generate an observability trace with timing data
- Retrieval stage MUST log: documents retrieved, relevance scores, chunk selections
- Generation stage MUST log: context window usage, model parameters, confidence scores
- API MUST expose endpoints for retrieving query traces and aggregated metrics
- Comparison mode MUST support running identical queries across different configurations
- Dashboard MUST visualize: query latency distribution, retrieval accuracy, answer quality metrics
- Alerts MUST trigger on anomalous performance degradation
- Historical data MUST be retained for trend analysis

---

## Data Integrity & Quality

### Graph Consistency

- Relationship directionality MUST be semantically meaningful and consistent
- Relationship types MUST follow a controlled vocabulary for legal concepts
- Entity deduplication MUST occur before visualization
- Dangling references MUST be prevented through referential integrity checks

### Source Fidelity

- Text chunks MUST maintain exact provenance to source legal documents
- Entity extractions MUST link back to originating chunks
- Modifications to the graph MUST preserve audit trails
- Source texts MUST remain immutable; annotations are separate layers

### Defensive Type Conversion

**All type conversions MUST handle `None` values explicitly.**

Python's `dict.get('key', default)` only returns the default when the key is **missing**,
NOT when the value is `None`. This subtle behavior causes silent failures:

```python
# UNSAFE: Crashes when weight key exists with None value
float(data.get('weight', 1.0))  # TypeError: float() argument must be... not 'NoneType'

# SAFE: Handles both missing keys AND None values
float(data.get('weight') or 1.0)
```

**Implementation Requirements**:
- Type conversions (`float()`, `int()`, `str()`) MUST use `value or default` pattern
- Code review MUST check for unsafe `.get('key', default)` before type conversion
- Dictionary values from external sources (Neo4j, GraphML, APIs) MUST be treated as potentially `None`
- Silent failures MUST be prevented - prefer explicit errors over corrupted data

**Rationale**: A single `float(None)` crash in the GraphRAG pipeline can silently break
entire features (like dynamic node visualization) while appearing to work. The
`value or default` pattern provides defense in depth against nullable data.

---

## User Experience Standards

### Performance

- Graph queries MUST complete within 2 seconds for typical exploration tasks
- Visualizations MUST render smoothly (≥30 fps) for graphs up to 500 nodes
- API response times MUST stay under 200ms for single-hop relationship queries
- Progressive loading MUST be implemented for large result sets

### Accessibility

- Graph visualizations MUST provide alternative text-based navigation modes
- Color schemes MUST maintain WCAG AA contrast ratios
- Keyboard navigation MUST be fully supported
- Screen reader compatibility MUST be maintained for all interactive elements

### Error Handling

- Empty query results MUST provide actionable suggestions
- Graph rendering failures MUST gracefully degrade to list views
- API errors MUST include context and recovery guidance
- System state MUST be recoverable after errors without data loss

---

## Governance

**This constitution supersedes all other development practices and design decisions.**

### Amendment Procedure

1. Proposed amendments MUST be documented with:
   - Rationale for the change
   - Impact analysis on existing principles
   - Migration plan for affected components
   - Approval from project maintainers

2. Amendments follow semantic versioning:
   - **MAJOR**: Principle removals, redefinitions, or backwards-incompatible changes
   - **MINOR**: New principles added or material expansions to existing guidance
   - **PATCH**: Clarifications, wording improvements, non-semantic refinements

### Compliance Review

- All feature specifications MUST include a Constitution Check section
- Pull requests MUST verify compliance with applicable principles
- Design deviations MUST be explicitly justified in plan.md Complexity Tracking
- Automated tests SHOULD validate constitutional requirements where feasible

### Living Document

This constitution is maintained in version control at `.specify/memory/constitution.md`.
For development workflow guidance, consult the runtime documentation in `README.md`
and project-specific instructions in `CLAUDE.md`.

**Version**: 2.0.0 | **Ratified**: 2025-11-18 | **Last Amended**: 2025-12-23
