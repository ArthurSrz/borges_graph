'use client'

import { useState, useEffect } from 'react'
import BorgesLibrary from '@/components/BorgesLibrary'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time like the original interface
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-borges-dark text-borges-light flex flex-col items-center justify-center relative">
        <div className="text-center space-y-8 borges-fade-in">
          <h1 className="text-4xl md:text-6xl font-light tracking-wide">
            🏛️ Bibliothèque de Borges
          </h1>

          <p className="text-xl md:text-2xl font-light text-gray-400 max-w-2xl mx-auto px-4">
            Avez-vous déjà vu un big bang littéraire?
          </p>

          <div className="flex items-center justify-center space-x-3">
            <div className="w-2 h-2 bg-borges-accent rounded-full borges-pulse"></div>
            <div className="w-2 h-2 bg-borges-accent rounded-full borges-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-borges-accent rounded-full borges-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>

          <p className="text-lg text-gray-500 borges-pulse">
            Préparation de l&apos;univers littéraire...
          </p>
        </div>
      </div>
    )
  }

  return <BorgesLibrary />
}