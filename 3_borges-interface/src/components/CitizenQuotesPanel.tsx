'use client'

import ExpandableQuoteCard from './ExpandableQuoteCard'

interface CitizenQuotesPanelProps {
  quotes: string[]
  currentIndex: number
  isVisible: boolean
}

export default function CitizenQuotesPanel({ quotes, currentIndex, isVisible }: CitizenQuotesPanelProps) {
  if (!isVisible || quotes.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="relative min-h-[100px]">
        {quotes.map((quote, index) => (
          <ExpandableQuoteCard
            key={index}
            quote={quote}
            index={index}
            isActive={index === currentIndex}
          />
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-4">
        {quotes.map((_, index) => (
          <div
            key={index}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === currentIndex ? 'bg-datack-yellow w-6' : 'bg-datack-border'}
            `}
          />
        ))}
      </div>
    </div>
  )
}
