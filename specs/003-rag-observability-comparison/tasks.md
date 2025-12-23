# Tasks: Legal Graph Interface for RAG Observability

**Feature**: 003-rag-observability-comparison
**Input**: Design documents from `/specs/003-rag-observability-comparison/`
**Scope**: Interface only (User Story 0) - RAG comparison developed elsewhere

**Organization**: Tasks focused on extending 3_borges-interface to support Law GraphRAG API.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US0]**: All tasks belong to User Story 0 (Interface)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, this is a **frontend extension**:

```
3_borges-interface/
├── src/
│   ├── app/api/
│   │   └── law-graphrag/route.ts     # NEW: API proxy
│   ├── components/
│   │   ├── BorgesLibrary.tsx         # MODIFY: Add source state
│   │   ├── QueryInterface.tsx        # MODIFY: Add source toggle
│   │   └── RAGSourceSelector.tsx     # NEW: Selector component
│   ├── lib/services/
│   │   └── law-graphrag.ts           # NEW: API client
│   └── types/
│       └── law-graphrag.ts           # NEW: Type definitions
└── .env.local                        # Add LAW_GRAPHRAG_API_URL
```

---

## Phase 1: Setup

**Purpose**: Environment configuration and type definitions

- [X] T001 Add LAW_GRAPHRAG_API_URL to 3_borges-interface/.env.local with value https://law-graphrag-reconciliation-api.up.railway.app
- [X] T002 [P] Create type definitions in 3_borges-interface/src/types/law-graphrag.ts with LawGraphRAGQuery, LawGraphRAGResponse, and RAGSource type
- [X] T003 [P] Add LAW_GRAPHRAG_API_URL to 3_borges-interface/.env.example for documentation

---

## Phase 2: API Layer

**Purpose**: Backend proxy and service client for Law GraphRAG API

- [X] T004 [P] [US0] Create Law GraphRAG API proxy route in 3_borges-interface/src/app/api/law-graphrag/route.ts following existing reconciliation/query/route.ts pattern
- [X] T005 [P] [US0] Create Law GraphRAG service client in 3_borges-interface/src/lib/services/law-graphrag.ts with query() method returning typed response

---

## Phase 3: User Story 0 - Explore Legal Graph Data via Interface (Priority: P0)

**Goal**: Enable users to query legal documents via the Law GraphRAG API and explore results in the 3D graph

**Independent Test**: Load the interface, select "Law GraphRAG" as source, query "Article 1382 Code Civil", verify graph displays legal entities and relationships

### 3.1 UI Components

- [X] T006 [US0] Create RAGSourceSelector component in 3_borges-interface/src/components/RAGSourceSelector.tsx with toggle between "Borges" and "Law GraphRAG" sources
- [X] T007 [US0] Style RAGSourceSelector with Tailwind CSS matching existing minimalist design (Constitution Principle VII)
- [X] T008 [US0] Add mobile-responsive styling to RAGSourceSelector per Constitution Principle VIII

### 3.2 State Integration

- [X] T009 [US0] Add ragSource state (type RAGSource) to BorgesLibrary.tsx with default "borges"
- [X] T010 [US0] Add setRagSource prop threading from BorgesLibrary.tsx to QueryInterface.tsx
- [X] T011 [US0] Render RAGSourceSelector in BorgesLibrary.tsx header area near existing controls

### 3.3 Query Integration

- [X] T012 [US0] Modify handleSubmit() in QueryInterface.tsx to route queries based on ragSource state
- [X] T013 [US0] Import and call lawGraphRAGService.query() when ragSource === "law-graphrag" in QueryInterface.tsx
- [X] T014 [US0] Transform Law GraphRAG response to match existing QueryResult interface in QueryInterface.tsx
- [X] T015 [US0] Ensure graph visualization displays Law GraphRAG entities and relationships using existing GraphVisualization3DForce component

### 3.4 Error Handling

- [X] T016 [US0] Add error handling for Law GraphRAG API failures in QueryInterface.tsx with user-friendly message
- [X] T017 [US0] Add loading state indicator when Law GraphRAG query is in progress

**Checkpoint**: User Story 0 complete - users can toggle between Borges and Law GraphRAG backends

---

## Phase 4: Polish & Validation

**Purpose**: Final improvements and validation

- [ ] T018 Verify graph rendering performance (30fps target) with Law GraphRAG data
- [ ] T019 Test mobile responsiveness of RAGSourceSelector on iOS/Android
- [ ] T020 Verify no orphan nodes displayed per Constitution Principle III
- [ ] T021 Update 3_borges-interface/README.md with Law GraphRAG configuration instructions

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (API Layer)
    ↓
Phase 3 (User Story 0)
    ↓
Phase 4 (Polish)
```

### Parallel Opportunities

**Phase 1**:
```
T002, T003 can run in parallel (after T001)
```

**Phase 2**:
```
T004, T005 can run in parallel
```

**Phase 3**:
```
T006, T007, T008 (UI) can run in parallel
Then T009 → T010 → T011 (state)
Then T012 → T013 → T014 → T015 (query integration)
Then T016, T017 (error handling) can run in parallel
```

---

## Implementation Strategy

### Single User Story Delivery

This plan focuses **only on User Story 0** (Interface). All tasks deliver:
1. RAG source selection capability
2. Law GraphRAG API integration
3. Existing graph visualization reuse

### Task Count Summary

| Phase | Task Count |
|-------|------------|
| Phase 1 (Setup) | 3 |
| Phase 2 (API Layer) | 2 |
| Phase 3 (User Story 0) | 12 |
| Phase 4 (Polish) | 4 |
| **Total** | **21** |

### MVP Definition

Complete Phases 1-3 for functional MVP:
- User can toggle RAG source
- Queries route to Law GraphRAG API
- Results display in existing 3D graph

### Verification Checklist

After implementation, verify:
- [ ] Law GraphRAG source selectable in UI
- [ ] Queries to Law GraphRAG return graph data
- [ ] 3D visualization renders legal entities
- [ ] Mobile-responsive design maintained
- [ ] No orphan nodes displayed
- [ ] Error states handled gracefully

---

## Notes

- All tasks belong to User Story 0 (Interface) - marked [US0]
- RAG comparison/evaluation (US1-US4) developed in law-graphRAG-reconciliation-api repo
- Reuses existing 3_borges-interface architecture and components
- Tests not explicitly included (not requested) - add if needed
- Commit after each task or logical group
