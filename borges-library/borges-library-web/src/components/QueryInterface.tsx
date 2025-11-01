'use client'

import { useState } from 'react'

interface Book {
  id: string
  title: string
  author: string
  graphData?: any
}

interface QueryInterfaceProps {
  selectedBook: Book
}

interface QueryResult {
  query: string
  answer: string
  timestamp: Date
}

export default function QueryInterface({ selectedBook }: QueryInterfaceProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<QueryResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    const currentQuery = query.trim()
    setQuery('')
    setShowResult(false)

    try {
      const response = await fetch('/api/graphrag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_id: selectedBook.id,
          query: currentQuery,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const newResult: QueryResult = {
          query: currentQuery,
          answer: data.answer,
          timestamp: new Date(),
        }
        setLastResult(newResult)
        setShowResult(true)
      } else {
        throw new Error(data.error || 'Erreur lors de la requête')
      }
    } catch (error) {
      console.error('Error querying GraphRAG:', error)
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
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Explorez "${selectedBook.title}" avec une question...`}
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
      </form>

      {/* Result Overlay */}
      {showResult && lastResult && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-borges-secondary border border-gray-600 rounded-lg p-4 shadow-lg z-10">
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

          <div>
            <div className="text-sm text-gray-400 mb-2">Réponse GraphRAG:</div>
            <div className="text-gray-300 text-sm leading-relaxed max-h-32 overflow-y-auto">
              {lastResult.answer}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}