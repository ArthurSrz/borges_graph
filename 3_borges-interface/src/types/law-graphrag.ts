/**
 * TypeScript types for Law GraphRAG integration
 * Feature: 003-rag-observability-comparison
 *
 * Enables querying legal knowledge graph via the Law GraphRAG API
 * at https://law-graphrag-reconciliation-api.up.railway.app
 */

/**
 * Available RAG sources for the interface
 * - 'borges': Original Borges Library (literary GraphRAG)
 * - 'law-graphrag': Law GraphRAG (legal knowledge graph)
 */
export type RAGSource = 'borges' | 'law-graphrag';

/**
 * Query request to the Law GraphRAG API
 */
export interface LawGraphRAGQuery {
  query: string;
  mode?: 'local' | 'global';
  /** Optional: Filter by specific legal document ID */
  document_id?: string;
}

/**
 * Legal entity extracted from the knowledge graph
 */
export interface LegalEntity {
  id: string;
  name: string;
  type: 'law' | 'article' | 'jurisprudence' | 'doctrine' | 'concept' | 'entity';
  description?: string;
  source_document?: string;
  citation?: string;
}

/**
 * Relationship between legal entities
 */
export interface LegalRelationship {
  id: string;
  source: string;
  target: string;
  type: string;
  description?: string;
  weight?: number;
}

/**
 * Source chunk from a legal document
 */
export interface LegalSourceChunk {
  chunk_id: string;
  content: string;
  document_id: string;
  document_title: string;
  article_number?: string;
  section?: string;
}

/**
 * Graph data structure for visualization
 * Matches the format expected by GraphVisualization3DForce
 */
export interface LawGraphRAGGraphData {
  nodes: Array<{
    id: string;
    labels: string[];
    properties: Record<string, unknown>;
    degree?: number;
    centrality_score?: number;
  }>;
  relationships: Array<{
    id: string;
    type: string;
    source: string;
    target: string;
    properties: Record<string, unknown>;
  }>;
}

/**
 * Response from the Law GraphRAG API /query endpoint
 */
export interface LawGraphRAGResponse {
  success: boolean;
  query: string;
  answer: string;
  /** Graph data for visualization */
  graphrag_data?: {
    entities: LegalEntity[];
    relationships: LegalRelationship[];
    source_chunks?: LegalSourceChunk[];
  };
  /** Processing metadata */
  context?: {
    mode: 'local' | 'global';
    processing_time_ms?: number;
  };
  /** Processing time in seconds (top-level for convenience) */
  processing_time?: number;
  /** Unique query ID for provenance tracking (Constitution Principle I) */
  query_id?: string;
  timestamp?: string;
  /** Error details if success is false */
  error?: string;
}

/**
 * Error response from the Law GraphRAG API
 */
export interface LawGraphRAGError {
  error: string;
  details?: string;
  status?: number;
}

/**
 * Constitutional Principle I: End-to-end interpretability
 * LawGraphRAGResponse enables navigation from answer → entities → chunks → legal documents
 */
