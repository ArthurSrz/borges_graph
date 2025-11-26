'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import HighlightedText from './HighlightedText'

interface EntityMatch {
  id: string
  type: string
  color: string
  score: number
  description?: string
}

interface TextChunkModalProps {
  isOpen: boolean
  onClose: () => void
  chunkText: string
  bookId?: string
  chunkId?: string
  entities?: EntityMatch[]
  relationshipInfo?: {
    sourceNode: string
    targetNode: string
    relationType: string
  }
}

/**
 * Modal full-screen pour afficher les chunks de texte avec highlighting des entités
 * Principe d'interprétabilité bout-en-bout : navigation du chunk source vers la visualisation 3D
 * Design Borges dark theme pour l'immersion
 */
export default function TextChunkModal({
  isOpen,
  onClose,
  chunkText,
  bookId,
  chunkId,
  entities = [],
  relationshipInfo
}: TextChunkModalProps) {
  const [mounted, setMounted] = useState(false)

  // Handle portal mounting
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  // Don't render if not mounted (SSR safety) or not open
  if (!mounted || !isOpen) {
    return null
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleEntityClick = (entity: EntityMatch) => {
    console.log('🎯 Entity clicked in TextChunkModal:', entity)
    // TODO: Implement navigation to entity in 3D graph
  }

  const modal = (
    <div
      className="borges-modal-overlay flex items-center justify-center p-0 md:p-4"
      onClick={handleBackdropClick}
    >
      {/* Modal Container - Full screen on mobile, centered on desktop */}
      <div className="relative w-full h-full md:max-w-6xl md:max-h-[95vh] bg-borges-dark md:border border-borges-border shadow-borges-lg overflow-hidden flex flex-col safe-area-top safe-area-bottom">

        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center py-2 bg-borges-secondary">
          <div className="w-12 h-1 bg-borges-border rounded-full"></div>
        </div>

        {/* Header - Responsive Basile Minimalism */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-borges-border bg-borges-secondary">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1 min-w-0">
            <h2 className="text-h2-mobile md:text-h2 text-borges-light truncate">
              Source Text
            </h2>

            {bookId && (
              <div className="text-xs md:text-sm text-borges-light-muted truncate">
                <span className="text-borges-accent">{bookId}</span>
                {chunkId && <span className="text-borges-muted ml-2 hidden sm:inline">• {chunkId}</span>}
              </div>
            )}
          </div>

          {/* Relationship info - desktop only */}
          {relationshipInfo && (
            <div className="hidden lg:flex items-center gap-2 text-sm text-borges-light-muted">
              <span className="text-borges-light">{relationshipInfo.sourceNode}</span>
              <span className="text-borges-muted">→</span>
              <span className="text-borges-light">{relationshipInfo.targetNode}</span>
              <span className="text-borges-muted ml-2">({relationshipInfo.relationType})</span>
            </div>
          )}

          {/* Close Button - Touch-friendly */}
          <button
            onClick={onClose}
            className="borges-btn-ghost p-2 touch-target flex items-center justify-center hover:bg-borges-dark-hover rounded-borges-sm transition-all ml-2"
            title="Close (Esc)"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">

            {/* Pipeline Traceability - Responsive */}
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-borges-secondary rounded-borges-md border-l-4 border-borges-accent">
              <h3 className="text-xs md:text-sm font-medium text-borges-light-muted mb-2">Traceability Pipeline</h3>
              <div className="flex flex-wrap gap-1 md:gap-2 text-xs">
                <span className="bg-borges-dark text-borges-light px-2 py-1 rounded-borges-sm">Source</span>
                <span className="text-borges-muted">→</span>
                <span className="bg-borges-dark text-borges-light px-2 py-1 rounded-borges-sm">GraphRAG</span>
                <span className="text-borges-muted">→</span>
                <span className="bg-borges-dark text-borges-light px-2 py-1 rounded-borges-sm">Neo4j</span>
                <span className="text-borges-muted">→</span>
                <span className="bg-borges-dark text-borges-accent px-2 py-1 rounded-borges-sm">3D</span>
              </div>
            </div>

            {/* Main Text Content with Entity Highlighting */}
            <div className="bg-borges-dark rounded-borges-md p-4 md:p-6 border border-borges-border">
              <div className="text-base md:text-lg leading-relaxed text-borges-light">
                {entities.length > 0 ? (
                  <HighlightedText
                    text={chunkText}
                    entities={entities}
                    onEntityClick={handleEntityClick}
                    showTooltip={true}
                    className="leading-loose text-base md:text-lg"
                  />
                ) : (
                  <div className="whitespace-pre-wrap">{chunkText}</div>
                )}
              </div>
            </div>

            {/* Metadata - Responsive grid */}
            <div className="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
              <div className="bg-borges-secondary p-2 md:p-4 rounded-borges-sm border border-borges-border">
                <h4 className="text-borges-muted mb-1 text-xs">Length</h4>
                <p className="text-borges-light truncate">{chunkText.length}</p>
              </div>

              <div className="bg-borges-secondary p-2 md:p-4 rounded-borges-sm border border-borges-border">
                <h4 className="text-borges-muted mb-1 text-xs">Entities</h4>
                <p className="text-borges-light">{entities.length}</p>
              </div>

              <div className="bg-borges-secondary p-2 md:p-4 rounded-borges-sm border border-borges-border">
                <h4 className="text-borges-muted mb-1 text-xs">Source</h4>
                <p className="text-borges-light truncate">{bookId || 'Unknown'}</p>
              </div>
            </div>

            {/* Instructions - Responsive */}
            <div className="mt-4 md:mt-6 text-xs text-borges-muted text-center">
              <p className="hidden md:block">Click highlighted entities to explore their connections in the 3D graph</p>
              <p className="md:hidden">Tap entities to explore connections</p>
              <p className="hidden md:block">Press Escape or click outside to close</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Render through portal
  return createPortal(modal, document.body)
}