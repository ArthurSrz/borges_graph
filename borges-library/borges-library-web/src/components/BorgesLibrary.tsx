'use client'

import { useState, useEffect } from 'react'
import BookSelector from './BookSelector'
import GraphVisualization from './GraphVisualization'
import QueryInterface from './QueryInterface'

interface Book {
  id: string
  title: string
  author: string
  graphData?: any
}

export default function BorgesLibrary() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [isLoadingBooks, setIsLoadingBooks] = useState(true)

  useEffect(() => {
    // Load available books from the API
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      const response = await fetch('/api/books')
      const booksList = await response.json()
      setBooks(booksList)
    } catch (error) {
      console.error('Error loading books:', error)
      // Fallback with mock data for now
      setBooks([
        { id: 'vallee_sans_hommes_frison', title: 'La Vallée sans hommes', author: 'Frison' },
        { id: 'racines_ciel_gary', title: 'Les Racines du ciel', author: 'Romain Gary' },
        { id: 'policeman_decoin', title: 'Policeman', author: 'Decoin' },
        { id: 'a_rebours_huysmans', title: 'À rebours', author: 'Huysmans' },
        { id: 'chien_blanc_gary', title: 'Chien blanc', author: 'Romain Gary' },
        { id: 'peau_bison_frison', title: 'Peau de bison', author: 'Frison' },
        { id: 'tilleul_soir_anglade', title: 'Le Tilleul du soir', author: 'Anglade' },
        { id: 'villa_triste_modiano', title: 'Villa triste', author: 'Modiano' },
      ])
    } finally {
      setIsLoadingBooks(false)
    }
  }

  const handleBookSelect = async (book: Book) => {
    setSelectedBook(book)

    // Load graph data for the selected book
    try {
      const response = await fetch(`/api/books/${book.id}/graph`)
      const graphData = await response.json()
      setSelectedBook({ ...book, graphData })
    } catch (error) {
      console.error('Error loading graph data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-borges-dark text-borges-light">
      {/* Header */}
      <header className="p-6 border-b border-borges-secondary">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-light tracking-wide">
            🏛️ Bibliothèque de Borges
          </h1>
          <p className="text-gray-400 mt-2">
            Une exploration interactive des connexions infinies entre les livres
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Book Selection */}
          <div className="lg:col-span-1">
            <BookSelector
              books={books}
              selectedBook={selectedBook}
              onBookSelect={handleBookSelect}
              isLoading={isLoadingBooks}
            />
          </div>

          {/* Graph Visualization */}
          <div className="lg:col-span-2">
            <div className="h-full bg-borges-secondary rounded-lg flex flex-col">
              {selectedBook ? (
                <>
                  {/* Query Bar */}
                  <div className="p-4 border-b border-gray-600">
                    <QueryInterface selectedBook={selectedBook} />
                  </div>
                  {/* Graph */}
                  <div className="flex-1">
                    <GraphVisualization
                      book={selectedBook}
                      graphData={selectedBook.graphData}
                    />
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-xl">Sélectionnez un livre pour explorer son univers</p>
                    <p className="text-sm mt-2 opacity-75">
                      Avez-vous déjà vu un big bang littéraire?
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}