# Feature Specification: RAG Observability and Comparison for Legal Knowledge Systems

**Feature Branch**: `003-rag-observability-comparison`
**Created**: 2025-12-23
**Updated**: 2025-12-23
**Status**: Draft
**Constitution Version**: 2.0.0
**Input**: User description: "LLM observability solution to compare Dust RAG agent vs Law GraphRAG API, evaluating precision and latency using OPIK heuristic metrics for legal question-answering"

## Constitution Check

*This feature implements **Constitution Principle IX: RAG Observability and Comparison** and supports **Principle I: End-to-End Interpretability** and **Principle II: Legal Provenance Chain**.*

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. End-to-End Interpretability | Supports | Observability enables tracing from query → retrieval → generation |
| II. Legal Provenance Chain | Supports | Metrics validate citation accuracy in RAG responses |
| III. No Orphan Nodes | Applies | Interface graph visualization must filter orphan nodes |
| IV. Legal Document-Centric | Supports | Evaluation dataset contains legal document queries |
| V. Cross-Document Analysis | N/A | Feature focuses on RAG comparison, not graph traversal |
| VI. Extensible Legal Corpus | N/A | Feature does not modify document ingestion |
| VII. Functional Legal Interface | Applies | Interface must follow minimalist design principles |
| VIII. Mobile-First | Applies | Interface must be responsive on mobile devices |
| IX. RAG Observability | **Primary** | This feature directly implements Principle IX |

---

## User Scenarios & Testing *(mandatory)*

### User Story 0 - Explore Legal Graph Data via Interface (Priority: P0)

A legal researcher wants to explore the raw legal knowledge graph data through an interactive interface, similar to the Borges Library graph interface, allowing them to query legal documents, view entities and relationships, and understand the underlying data before running RAG comparisons.

**Why this priority**: This is the foundational interface that enables all other features. Without the ability to query and explore the raw legal data, users cannot verify RAG results against source documents or understand the knowledge graph structure. This directly implements Constitution Principle I (End-to-End Interpretability).

**Independent Test**: Can be fully tested by loading the interface, querying for a legal document, and navigating through the graph to view entities and relationships.

**Acceptance Scenarios**:

1. **Given** the interface is loaded, **When** the user enters a legal query (e.g., "Article 1382 Code Civil"), **Then** the system displays relevant legal entities and their relationships in the 3D graph
2. **Given** the legal graph is displayed, **When** the user clicks on a legal document node, **Then** they see the document details including source text, articles, and related entities
3. **Given** the user is exploring the graph, **When** they navigate to connected entities, **Then** they can trace the provenance chain from RAG answers back to source legal documents (per Constitution Principle I)
4. **Given** the interface supports both Dust and Law GraphRAG backends, **When** the user queries through the interface, **Then** they can choose which RAG system to use for answering

---

### User Story 1 - Run Comparative Legal RAG Evaluation (Priority: P1)

A legal technology researcher wants to objectively compare two RAG approaches (Dust agent and Law GraphRAG) on the same legal questions to determine which system provides more accurate and faster responses for legal knowledge retrieval.

**Why this priority**: This is the core value proposition - without the ability to run comparison experiments, the entire observability solution has no purpose. Per Constitution Principle IX, "different RAG configurations MUST be comparable side-by-side."

**Independent Test**: Can be fully tested by running an experiment against the "civic-law-eval" dataset and viewing results in the OPIK dashboard. Delivers immediate value by showing which RAG system performs better on legal queries.

**Acceptance Scenarios**:

1. **Given** the "civic-law-eval" dataset exists in OPIK project "law_graphRAG", **When** the user triggers a comparison experiment, **Then** both Dust and Law GraphRAG are queried with each legal question from the dataset
2. **Given** an experiment is running, **When** both systems respond to a legal question, **Then** response time (latency) is recorded for each system per Principle IX requirement
3. **Given** responses are collected, **When** the experiment completes, **Then** heuristic metrics (Contains, Equals, RegexMatch for legal citations) are computed against expected answers
4. **Given** a RAG response contains legal citations, **When** metrics are computed, **Then** citation accuracy is verified against the source legal documents (supporting Principle II)

---

### User Story 2 - View Legal RAG Experiment Results in Dashboard (Priority: P2)

After running experiments, the user wants to analyze results visually in the OPIK dashboard to understand performance differences between the two legal RAG systems.

**Why this priority**: Visualization is essential for interpreting results, but requires experiments to run first (P1). Per Constitution Principle IX, "dashboard MUST visualize: query latency distribution, retrieval accuracy, answer quality metrics."

**Independent Test**: Can be tested by viewing the OPIK dashboard after an experiment completes, verifying that metrics, latency data, and comparison charts are displayed.

**Acceptance Scenarios**:

1. **Given** an experiment has completed, **When** the user opens the OPIK dashboard, **Then** they see experiment results organized by system (Dust vs Law GraphRAG)
2. **Given** experiment results are displayed, **When** the user inspects a specific legal question, **Then** they see both responses side-by-side with their respective metrics
3. **Given** multiple experiments exist, **When** the user compares experiments, **Then** they can track performance trends over time (supporting Principle IX: "Historical data MUST be retained for trend analysis")
4. **Given** a legal question about statute interpretation, **When** the user views results, **Then** they can verify which system provided correct legal citations

---

### User Story 3 - Configure Legal Evaluation Metrics (Priority: P3)

A user wants to customize which heuristic metrics are used for evaluation to focus on aspects most relevant to legal question-answering, including citation accuracy and legal terminology precision.

**Why this priority**: Metric customization enhances flexibility but the default metrics (Contains) already provide baseline evaluation.

**Independent Test**: Can be tested by modifying metric configuration and verifying that subsequent experiments use the new metrics.

**Acceptance Scenarios**:

1. **Given** the system supports multiple heuristic metrics, **When** the user configures a custom metric set, **Then** experiments use only the configured metrics
2. **Given** "Contains" is the default metric, **When** the user adds "RegexMatch" for legal citation detection (e.g., "Article [0-9]+"), **Then** both metrics appear in experiment results
3. **Given** legal responses require citation verification, **When** the user enables citation accuracy metrics, **Then** the system validates that cited articles exist in the legal corpus

---

### User Story 4 - Enable LLM-as-Judge for Semantic Precision (Priority: P2.5)

A legal researcher wants to go beyond keyword matching and have an external language model evaluate whether the RAG response actually answers the legal question correctly, considering legal reasoning quality.

**Why this priority**: Heuristic metrics catch surface-level matches, but legal precision requires semantic understanding. An LLM judge can evaluate if the legal reasoning is sound even when phrasing differs from the expected answer.

**Independent Test**: Can be tested by enabling the LLM-as-judge metric and verifying that it provides a precision score (0-1) with reasoning for each response.

**Acceptance Scenarios**:

1. **Given** LLM-as-judge is enabled in the experiment configuration, **When** a RAG response is evaluated, **Then** the judge model scores the answer's precision on a 0-1 scale with written reasoning
2. **Given** a response is semantically correct but uses different wording than expected, **When** the LLM judge evaluates it, **Then** it should score highly for precision despite heuristic metrics failing
3. **Given** a response contains factually incorrect legal information, **When** the LLM judge evaluates it, **Then** it should score low and explain the legal inaccuracy in its reasoning
4. **Given** the LLM judge API is unavailable, **When** an experiment runs, **Then** the system logs the failure and continues with heuristic metrics only

---

### Edge Cases

- What happens when Dust API is unavailable or rate-limited? → System records the failure, continues with Law GraphRAG, marks Dust responses as "unavailable"
- What happens when Law GraphRAG API times out? → System records timeout with latency value, marks response as "timeout" (per Principle IX: observability trace still generated)
- What happens when a legal question in the dataset has no expected answer? → System logs a warning and skips metric computation for that question
- What happens when OPIK API quota is exceeded? → System queues results locally and retries when quota resets
- What happens when a RAG response cites a non-existent legal article? → System flags citation as "unverified" in metrics (supporting Principle II compliance)
- What happens when the LLM judge API fails mid-experiment? → System logs the error, marks LLM precision score as "unavailable" for affected questions, and continues with heuristic metrics
- What happens when the LLM judge returns an ambiguous score? → System accepts scores between 0-1, logs the reasoning, and flags edge cases (scores near 0.5) for human review

## Requirements *(mandatory)*

### Functional Requirements

**Interface Requirements (User Story 0)**:
- **FR-000a**: System MUST provide a web-based interface for exploring the legal knowledge graph, reusing the existing 3_borges-interface architecture
- **FR-000b**: Interface MUST support querying legal documents and displaying results in a 3D graph visualization
- **FR-000c**: Interface MUST allow users to click on nodes to view legal document details and source text
- **FR-000d**: Interface MUST enable navigation through the graph to trace provenance chains
- **FR-000e**: Interface MUST support selecting between Dust and Law GraphRAG backends for queries

**Experiment Requirements (User Stories 1-4)**:
- **FR-001**: System MUST connect to the OPIK project "law_graphRAG" using the provided API key
- **FR-002**: System MUST load evaluation questions from the "civic-law-eval" dataset in OPIK
- **FR-003**: System MUST call the Dust agent (ID: beTfWHdTC6) via Dust Conversations API for each legal evaluation question
- **FR-004**: System MUST call the Law GraphRAG API endpoint `/query` at `https://law-graphrag-reconciliation-api.up.railway.app` for each legal evaluation question
- **FR-005**: System MUST measure response latency (time from request to response) for both systems per Constitution Principle IX
- **FR-006**: System MUST compute heuristic metrics (at minimum: Contains, RegexMatch for legal citations) comparing responses to expected answers
- **FR-006b**: System MUST support an LLM-as-judge metric using an external language model to evaluate answer precision semantically, scoring how well the response addresses the legal question beyond keyword matching
- **FR-007**: System MUST log all experiment results to OPIK with system identifier (Dust vs Law GraphRAG)
- **FR-008**: System MUST handle API failures gracefully without crashing the entire experiment
- **FR-009**: System MUST support parallel execution of Dust and Law GraphRAG queries for the same question to ensure fair latency comparison
- **FR-010**: System MUST provide a mechanism to trigger experiments programmatically
- **FR-011**: System MUST generate observability traces for every query including retrieval and generation timing (per Constitution Principle IX)
- **FR-012**: System MUST retain historical experiment data for trend analysis (per Constitution Principle IX)

### Key Entities

- **Experiment**: A complete evaluation run comparing both legal RAG systems across the entire dataset. Contains metadata (timestamp, configuration) and aggregated metrics.
- **LegalEvaluationQuestion**: A question from the "civic-law-eval" dataset, containing the query text about legal matters (statutes, jurisprudence, doctrine) and expected answer(s).
- **SystemResponse**: The response from either Dust or Law GraphRAG, including the answer text, latency, legal citations mentioned, and any error information.
- **MetricResult**: The computed heuristic metric for a response, including metric name, score, and reasoning.
- **LLMJudgeResult**: The semantic precision evaluation from the LLM judge, including a 0-1 precision score, written reasoning explaining the score, and any flagged issues with the response.
- **ObservabilityTrace**: Per-query trace capturing retrieval stage timing, generation stage timing, documents retrieved, and confidence scores (per Constitution Principle IX).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can run a complete comparison experiment in under 10 minutes for a 50-question legal dataset
- **SC-002**: System achieves 95% or higher success rate in obtaining responses from both legal RAG systems
- **SC-003**: Latency measurements are accurate to within 50 milliseconds
- **SC-004**: All experiment results are visible in OPIK dashboard within 1 minute of experiment completion
- **SC-005**: Users can determine which RAG system has better precision for legal questions based on heuristic scores
- **SC-006**: Users can trace any legal question through the complete RAG pipeline (query → retrieval → generation) per Constitution Principle I
- **SC-007**: Historical experiment data is retained and queryable for at least 90 days per Constitution Principle IX
- **SC-008**: When LLM-as-judge is enabled, 90% or more of responses receive a precision score with reasoning within the experiment timeframe

## Assumptions

- The Dust workspace ID can be derived from the API key or is a known constant for this project
- The "civic-law-eval" dataset is already populated in OPIK with legal questions and expected answers covering statutes, jurisprudence, and doctrine
- The Law GraphRAG API at `https://law-graphrag-reconciliation-api.up.railway.app/query` is accessible and operational
- OPIK SDK (opik Python package) is available for experiment logging
- Network latency to external APIs is consistent enough for fair comparison (both APIs called in parallel)
- Legal questions in the evaluation dataset follow the legal document hierarchy (laws, articles, jurisprudence, doctrine) per Constitution Principle IV
- An external LLM API is available for the judge metric (configured via environment variable)
- The LLM judge evaluation adds approximately 2-5 seconds per response to the experiment time
