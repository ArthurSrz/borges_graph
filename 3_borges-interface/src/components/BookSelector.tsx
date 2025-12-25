'use client'

interface Book {
  id: string
  title: string
  author: string
  graphData?: any
  has_data?: boolean
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
      <div className="bg-datack-panel rounded-lg p-6 h-full border border-datack-border">
        <h2 className="text-h2 text-datack-light mb-4">Library</h2>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-datack-black rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-datack-panel rounded-lg p-6 h-full overflow-y-auto border border-datack-border">
      <h2 className="text-h2 text-datack-light mb-4">Library</h2>
      <div className="space-y-3">
        {books.map((book) => (
          <button
            key={book.id}
            onClick={() => onBookSelect(book)}
            className={`w-full text-left p-4 rounded transition-all duration-200 border ${
              selectedBook?.id === book.id
                ? 'bg-datack-yellow text-datack-black font-medium border-datack-yellow'
                : 'bg-datack-black hover:bg-datack-black-hover border-datack-border hover:border-datack-light-muted'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium text-sm">{book.title}</div>
              <div className="flex items-center space-x-1">
                {book.has_data !== undefined && (
                  <div className={`w-2 h-2 rounded-full ${
                    book.has_data ? 'bg-datack-yellow' : 'bg-datack-muted'
                  }`} title={book.has_data ? 'GraphRAG data available' : 'No GraphRAG data'} />
                )}
              </div>
            </div>
            <div className={`text-xs ${selectedBook?.id === book.id ? 'opacity-75' : 'text-datack-muted'}`}>{book.author}</div>
            {book.has_data !== undefined && (
              <div className={`text-xs mt-1 ${selectedBook?.id === book.id ? 'opacity-60' : 'text-datack-muted'}`}>
                {book.has_data ? 'GraphRAG available' : 'No data'}
              </div>
            )}
          </button>
        ))}
      </div>

      {books.length === 0 && !isLoading && (
        <div className="text-center text-datack-muted mt-8">
          <p>No books available</p>
        </div>
      )}
    </div>
  )
}