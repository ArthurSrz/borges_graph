/**
 * CitizenExtractsPanel Component
 *
 * Displays citizen extracts (source_quotes) related to a clicked entity.
 * Feature: Civic Provenance Chain (Constitution Principle #7)
 *
 * Shows:
 * - Entity name and type
 * - Commune attribution
 * - All citizen extracts mentioning this entity
 * - Highlighted entity occurrences in text
 */

'use client';

import { useState, useMemo } from 'react';
import type { CitizenExtract, GrandDebatEntity } from '@/types/law-graphrag';

interface CitizenExtractsPanelProps {
  entity: GrandDebatEntity | null;
  sourceQuotes: CitizenExtract[];
  onClose: () => void;
  colorMapping?: Record<string, string>;
}

/**
 * Find citizen extracts related to an entity
 *
 * Links based on:
 * 1. Same commune (source_commune = commune)
 * 2. Entity name appears in the content (case-insensitive)
 */
function findRelatedExtracts(
  entity: GrandDebatEntity,
  sourceQuotes: CitizenExtract[]
): CitizenExtract[] {
  const entityName = entity.name.toLowerCase();
  const entityCommune = entity.source_commune;

  // First, find exact commune matches with entity name in content
  const exactMatches = sourceQuotes.filter(quote => {
    if (quote.commune !== entityCommune) {
      return false;
    }
    const content = quote.content.toLowerCase();
    return content.includes(entityName);
  });

  // If we have exact matches, return them
  if (exactMatches.length > 0) {
    return exactMatches;
  }

  // Fallback: find any quote from the same commune (for entities without text matches)
  const communeMatches = sourceQuotes.filter(quote => quote.commune === entityCommune);

  // Return up to 3 commune matches as context
  return communeMatches.slice(0, 3);
}

/**
 * Highlight entity name in text with a colored span
 */
function highlightEntity(text: string, entityName: string, color: string): JSX.Element[] {
  const regex = new RegExp(`(${entityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase() === entityName.toLowerCase()) {
      return (
        <span
          key={index}
          className="px-1 py-0.5 rounded font-medium"
          style={{ backgroundColor: `${color}33`, color: color }}
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

// Entity type colors matching the Grand Débat ontology
const TYPE_COLORS: Record<string, string> = {
  TYPE_IMPOT: '#f59e0b',      // Amber
  DOLEANCE: '#ef4444',         // Red
  PROPOSITION: '#22c55e',      // Green
  OPINION: '#3b82f6',          // Blue
  THEMATIQUE: '#8b5cf6',       // Purple
  COMMUNE: '#06b6d4',          // Cyan
  CONCEPT: '#ec4899',          // Pink
  CIVIC_ENTITY: '#10b981',     // Emerald
  UNKNOWN: '#6b7280',          // Gray
};

export default function CitizenExtractsPanel({
  entity,
  sourceQuotes,
  onClose,
  colorMapping = {},
}: CitizenExtractsPanelProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Find related extracts
  const relatedExtracts = useMemo(() => {
    if (!entity) return [];
    return findRelatedExtracts(entity, sourceQuotes);
  }, [entity, sourceQuotes]);

  // Get entity color
  const entityColor = colorMapping[entity?.type || ''] || TYPE_COLORS[entity?.type || 'UNKNOWN'] || TYPE_COLORS.UNKNOWN;

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (!entity) {
    return null;
  }

  return (
    <div className="fixed inset-0 md:inset-y-0 md:left-auto md:right-0 z-50 w-full md:max-w-lg bg-datack-panel md:border-l border-datack-border shadow-lg overflow-hidden flex flex-col safe-area-top safe-area-bottom">
      {/* Mobile drag handle */}
      <div className="md:hidden flex justify-center py-2 bg-datack-panel">
        <div className="w-12 h-1 bg-datack-border rounded-full"></div>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-datack-border">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl text-datack-light font-medium mb-2">
              Extraits Citoyens
            </h2>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span
                className="text-sm px-2 py-1 rounded font-medium"
                style={{ backgroundColor: `${entityColor}22`, color: entityColor }}
              >
                {entity.type}
              </span>
              <span className="text-sm font-medium text-datack-light">
                {entity.name}
              </span>
            </div>
            <div className="text-xs text-datack-muted">
              Commune: <span className="text-datack-muted">{entity.source_commune}</span>
              {' - '}
              {relatedExtracts.length} extrait{relatedExtracts.length !== 1 ? 's' : ''} trouvé{relatedExtracts.length !== 1 ? 's' : ''}
            </div>
          </div>
          <button
            onClick={onClose}
            className="datack-btn-ghost ml-2 p-2 touch-target flex items-center justify-center"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {relatedExtracts.length === 0 ? (
          <div className="text-center py-8 text-datack-muted">
            <div className="text-3xl mb-3">&#128221;</div>
            <p>Aucun extrait citoyen trouv&eacute; pour cette entit&eacute;.</p>
            <p className="text-sm mt-2">
              Cette entit&eacute; peut avoir &eacute;t&eacute; extraite d&apos;un contexte plus large.
            </p>
          </div>
        ) : (
          relatedExtracts.map((extract, index) => {
            const extractId = `${extract.chunk_id}`;
            const isExpanded = expandedIds.has(extractId);
            const isLong = extract.content.length > 300;

            return (
              <div
                key={extractId || index}
                className="bg-datack-black rounded border border-datack-border overflow-hidden"
              >
                {/* Extract header */}
                <div className="px-3 py-2 border-b border-datack-border bg-datack-black flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-datack-panel rounded text-datack-muted">
                      #{index + 1}
                    </span>
                    <span className="text-xs text-datack-muted">
                      {extract.commune}
                    </span>
                  </div>
                  {isLong && (
                    <button
                      onClick={() => toggleExpand(extractId)}
                      className="text-xs text-datack-yellow hover:underline"
                    >
                      {isExpanded ? 'R&eacute;duire' : 'Voir tout'}
                    </button>
                  )}
                </div>

                {/* Extract content */}
                <div className="p-3">
                  <div
                    className={`text-sm text-datack-light leading-relaxed ${
                      !isExpanded && isLong ? 'line-clamp-4' : ''
                    }`}
                  >
                    {highlightEntity(
                      isExpanded || !isLong
                        ? extract.content
                        : extract.content.substring(0, 300) + '...',
                      entity.name,
                      entityColor
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-datack-border bg-datack-panel">
        <div className="text-xs text-datack-muted text-center">
          Principe #7: Tra&ccedil;abilit&eacute; civique de bout en bout
        </div>
      </div>
    </div>
  );
}
