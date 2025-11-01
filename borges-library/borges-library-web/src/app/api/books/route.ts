import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Path to the book data (this would be where Google Drive data is downloaded)
    const booksPath = path.join(process.cwd(), '..', '..', '..', 'nano-graphrag', 'borges-library')

    // List of expected book directories
    const expectedBooks = [
      { id: 'vallee_sans_hommes_frison', title: 'La Vallée sans hommes', author: 'Frison' },
      { id: 'racines_ciel_gary', title: 'Les Racines du ciel', author: 'Romain Gary' },
      { id: 'policeman_decoin', title: 'Policeman', author: 'Decoin' },
      { id: 'a_rebours_huysmans', title: 'À rebours', author: 'Huysmans' },
      { id: 'chien_blanc_gary', title: 'Chien blanc', author: 'Romain Gary' },
      { id: 'peau_bison_frison', title: 'Peau de bison', author: 'Frison' },
      { id: 'tilleul_soir_anglade', title: 'Le Tilleul du soir', author: 'Anglade' },
      { id: 'villa_triste_modiano', title: 'Villa triste', author: 'Modiano' },
    ]

    // Check which books actually have data available
    const availableBooks = []

    for (const book of expectedBooks) {
      try {
        const bookPath = path.join(booksPath, book.id)
        const graphmlPath = path.join(bookPath, 'graph_chunk_entity_relation.graphml')

        // Check if the GraphML file exists
        await fs.access(graphmlPath)
        availableBooks.push(book)
      } catch (error) {
        // Book directory or GraphML file doesn't exist, skip it
        console.log(`Book data not found for: ${book.id}`)
      }
    }

    return NextResponse.json(availableBooks)

  } catch (error) {
    console.error('Error listing books:', error)

    // Return expected books as fallback
    const fallbackBooks = [
      { id: 'vallee_sans_hommes_frison', title: 'La Vallée sans hommes', author: 'Frison' },
      { id: 'racines_ciel_gary', title: 'Les Racines du ciel', author: 'Romain Gary' },
      { id: 'policeman_decoin', title: 'Policeman', author: 'Decoin' },
      { id: 'a_rebours_huysmans', title: 'À rebours', author: 'Huysmans' },
      { id: 'chien_blanc_gary', title: 'Chien blanc', author: 'Romain Gary' },
      { id: 'peau_bison_frison', title: 'Peau de bison', author: 'Frison' },
      { id: 'tilleul_soir_anglade', title: 'Le Tilleul du soir', author: 'Anglade' },
      { id: 'villa_triste_modiano', title: 'Villa triste', author: 'Modiano' },
    ]

    return NextResponse.json(fallbackBooks)
  }
}