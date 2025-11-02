'use client'

import { useState } from 'react'
import { reconciliationService } from '@/lib/services/reconciliation'

interface Book {
  id: string
  title: string
  author: string
  graphData?: any
}

interface QueryInterfaceProps {
  selectedBook: Book | null
  visibleNodeIds: string[]
}

interface QueryResult {
  query: string
  answer: string
  timestamp: Date
  context?: {
    visible_nodes_count: number
    node_context: string[]
    mode: 'local' | 'global'
  }
  search_path?: {
    entities: Array<{ id: string; score: number; order: number }>
    relations: Array<{ source: string; target: string; traversalOrder: number }>
    communities: Array<{ id: string; relevance: number }>
  }
}

export default function QueryInterface({ selectedBook, visibleNodeIds }: QueryInterfaceProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<QueryResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [mode, setMode] = useState<'local' | 'global'>('local')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    const currentQuery = query.trim()
    setQuery('')
    setShowResult(false)

    try {
      const result = await reconciliationService.reconciledQuery({
        query: currentQuery,
        visible_node_ids: visibleNodeIds,
        mode: mode
      })

      if (result.success) {
        const newResult: QueryResult = {
          query: currentQuery,
          answer: result.answer,
          timestamp: new Date(),
          context: result.context,
          search_path: result.search_path
        }
        setLastResult(newResult)
        setShowResult(true)
      } else {
        throw new Error('Erreur lors de la requête')
      }
    } catch (error) {
      console.error('Error querying reconciled API:', error)
      const errorResult: QueryResult = {
        query: currentQuery,
        answer: 'Désolé, une erreur s\'est produite lors du traitement de votre question. Veuillez réessayer.',
        timestamp: new Date(),
      }
      setLastResult(errorResult)
      setShowResult(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="relative">
      {/* Search Bar */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedBook ? `Explorez "${selectedBook.title}" avec une question...` : "Explorez le graphe de connaissances..."}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 pr-12 text-borges-light placeholder-gray-400 focus:outline-none focus:border-borges-accent"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-borges-accent border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="px-4 py-2 bg-borges-accent text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? 'Analyse...' : 'Explorer'}
            </button>
          </div>

          {/* Mode Selection and Stats */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setMode('local')}
                className={`px-2 py-1 rounded ${
                  mode === 'local'
                    ? 'bg-borges-accent text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Local
              </button>
              <button
                type="button"
                onClick={() => setMode('global')}
                className={`px-2 py-1 rounded ${
                  mode === 'global'
                    ? 'bg-borges-accent text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Global
              </button>
            </div>
            <div className="text-gray-400">
              {visibleNodeIds.length} nœuds visibles
            </div>
          </div>
        </div>
      </form>

      {/* Result Overlay */}
      {showResult && lastResult && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-borges-secondary border border-gray-600 rounded-lg p-4 shadow-lg z-10 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="text-sm text-gray-400 mb-1">Question:</div>
              <div className="text-borges-light font-medium text-sm">{lastResult.query}</div>
            </div>
            <button
              onClick={() => setShowResult(false)}
              className="text-gray-400 hover:text-borges-light ml-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Context Info */}
          {lastResult.context && (
            <div className="mb-3 p-2 bg-gray-800 rounded text-xs">
              <div className="text-gray-400">
                Mode: <span className="text-borges-accent">{lastResult.context.mode}</span> •
                Nœuds visibles: <span className="text-borges-accent">{lastResult.context.visible_nodes_count}</span>
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Réponse Réconciliée:</div>
            <div className="text-gray-300 text-sm leading-relaxed">
              {lastResult.answer}
            </div>
          </div>

          {/* Search Path */}
          {lastResult.search_path && (
            <div className="space-y-3">
              {lastResult.search_path.entities.length > 0 && (
                <div>
                  <div className="text-sm text-gray-400 mb-2">Entités Explorées:</div>
                  <div className="space-y-1">
                    {lastResult.search_path.entities.slice(0, 3).map((entity, idx) => (
                      <div key={idx} className="text-xs bg-gray-800 p-2 rounded flex justify-between">
                        <span className="text-borges-accent">{entity.id}</span>
                        <span className="text-gray-400">Score: {(entity.score * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lastResult.search_path.relations.length > 0 && (
                <div>
                  <div className="text-sm text-gray-400 mb-2">Relations Parcourues:</div>
                  <div className="space-y-1">
                    {lastResult.search_path.relations.slice(0, 3).map((relation, idx) => (
                      <div key={idx} className="text-xs bg-gray-800 p-2 rounded">
                        <span className="text-borges-accent">{relation.source}</span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span className="text-borges-accent">{relation.target}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}