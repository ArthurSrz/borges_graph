'use client'

interface Book {
  id: string
  title: string
  author: string
  graphData?: any
}

interface BookSelectorProps {
  books: Book[]
  selectedBook: Book | null
  onBookSelect: (book: Book) => void
  isLoading: boolean
}

export default function BookSelector({
  books,
  selectedBook,
  onBookSelect,
  isLoading
}: BookSelectorProps) {
  if (isLoading) {
    return (
      <div className="bg-borges-secondary rounded-lg p-6 h-full">
        <h2 className="text-xl font-medium mb-4">Bibliothèque</h2>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-borges-secondary rounded-lg p-6 h-full overflow-y-auto">
      <h2 className="text-xl font-medium mb-4">Bibliothèque</h2>
      <div className="space-y-3">
        {books.map((book) => (
          <button
            key={book.id}
            onClick={() => onBookSelect(book)}
            className={`w-full text-left p-4 rounded-lg transition-all duration-200 hover:bg-gray-700 ${
              selectedBook?.id === book.id
                ? 'bg-borges-accent text-black font-medium'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="font-medium text-sm mb-1">{book.title}</div>
            <div className="text-xs opacity-75">{book.author}</div>
          </button>
        ))}
      </div>

      {books.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 mt-8">
          <div className="text-4xl mb-2">📚</div>
          <p>Aucun livre disponible</p>
        </div>
      )}
    </div>
  )
}