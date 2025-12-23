'use client'

/**
 * RAG Source Selector Component
 * Feature: 003-rag-observability-comparison
 *
 * Allows users to toggle between different RAG backends:
 * - Borges: Literary GraphRAG (original)
 * - Law GraphRAG: Legal knowledge graph
 *
 * Constitution Principle VII: Functional Legal Interface (minimalist design)
 * Constitution Principle VIII: Mobile-First Responsiveness
 */

import type { RAGSource } from '@/types/law-graphrag'

interface RAGSourceSelectorProps {
  /** Currently selected RAG source */
  value: RAGSource
  /** Callback when source changes */
  onChange: (source: RAGSource) => void
  /** Optional: Disable the selector */
  disabled?: boolean
  /** Optional: Additional CSS classes */
  className?: string
}

/**
 * Toggle selector for choosing between RAG backends
 * Follows Basile minimalism design principles
 */
export default function RAGSourceSelector({
  value,
  onChange,
  disabled = false,
  className = ''
}: RAGSourceSelectorProps) {
  const sources: { id: RAGSource; label: string; icon: string; description: string }[] = [
    {
      id: 'borges',
      label: 'Borges',
      icon: '📚',
      description: 'Literary GraphRAG'
    },
    {
      id: 'law-graphrag',
      label: 'Law',
      icon: '⚖️',
      description: 'Legal Knowledge'
    }
  ]

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {/* Label - hidden on mobile for space */}
      <span className="hidden sm:inline text-xs text-borges-muted mr-1">Source:</span>

      {/* Toggle buttons */}
      <div className="flex rounded-borges-sm border border-borges-border overflow-hidden">
        {sources.map((source) => (
          <button
            key={source.id}
            type="button"
            onClick={() => !disabled && onChange(source.id)}
            disabled={disabled}
            className={`
              px-2 py-1 text-xs transition-all duration-200
              flex items-center space-x-1
              focus:outline-none focus:ring-1 focus:ring-borges-light focus:ring-inset
              disabled:opacity-50 disabled:cursor-not-allowed
              ${value === source.id
                ? 'bg-borges-light text-borges-dark font-medium'
                : 'bg-borges-secondary text-borges-light-muted hover:text-borges-light hover:bg-borges-dark-hover'
              }
              ${source.id === 'borges' ? 'rounded-l-borges-sm' : 'rounded-r-borges-sm border-l border-borges-border'}
            `}
            title={source.description}
            aria-pressed={value === source.id}
            aria-label={`Select ${source.label} (${source.description})`}
          >
            {/* Icon - always visible */}
            <span className="text-sm" aria-hidden="true">{source.icon}</span>
            {/* Label - visible on larger screens */}
            <span className="hidden xs:inline">{source.label}</span>
          </button>
        ))}
      </div>

      {/* Connection status indicator (optional enhancement) */}
      {value === 'law-graphrag' && (
        <span
          className="hidden sm:inline-flex items-center text-xs text-borges-muted"
          title="Connected to Law GraphRAG API"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse" />
        </span>
      )}
    </div>
  )
}

/**
 * Compact version for mobile navigation
 */
export function RAGSourceSelectorCompact({
  value,
  onChange,
  disabled = false
}: Omit<RAGSourceSelectorProps, 'className'>) {
  return (
    <button
      type="button"
      onClick={() => onChange(value === 'borges' ? 'law-graphrag' : 'borges')}
      disabled={disabled}
      className={`
        p-2 rounded-borges-sm transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-borges-dark-hover'}
        text-borges-light-muted hover:text-borges-light
      `}
      title={`Switch to ${value === 'borges' ? 'Law GraphRAG' : 'Borges'}`}
      aria-label={`Currently using ${value === 'borges' ? 'Borges' : 'Law GraphRAG'}. Click to switch.`}
    >
      <span className="text-lg">
        {value === 'borges' ? '📚' : '⚖️'}
      </span>
    </button>
  )
}
