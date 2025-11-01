import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API_URL = 'https://comfortable-gentleness-production-8603.up.railway.app'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { book_id, query } = body

    if (!book_id || !query) {
      return NextResponse.json(
        { error: 'book_id and query are required' },
        { status: 400 }
      )
    }

    // Forward the request to the Railway API
    const response = await fetch(`${RAILWAY_API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book_id,
        query,
        mode: 'global'  // Using global search mode by default
      }),
    })

    if (!response.ok) {
      throw new Error(`Railway API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      answer: data.answer || data.result || 'Pas de réponse disponible',
      book_id,
      query,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error querying GraphRAG:', error)

    // Return a fallback response
    return NextResponse.json(
      {
        error: 'Erreur lors de la requête GraphRAG',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}