import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { DOMParser } from 'xmldom'

interface Node {
  id: string
  label: string
  type: string
  description?: string
}

interface Link {
  source: string
  target: string
  relation: string
  weight?: number
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const { bookId } = params

    // Path to the specific book's GraphML file
    const booksPath = path.join(process.cwd(), '..', '..', '..', 'nano-graphrag', 'borges-library')
    const bookPath = path.join(booksPath, bookId)
    const graphmlPath = path.join(bookPath, 'graph_chunk_entity_relation.graphml')

    // Read the GraphML file
    const graphmlContent = await fs.readFile(graphmlPath, 'utf-8')

    // Parse the GraphML
    const graphData = parseGraphML(graphmlContent)

    return NextResponse.json(graphData)

  } catch (error) {
    console.error(`Error reading graph for book ${params.bookId}:`, error)

    // Return mock data as fallback
    const mockData: GraphData = {
      nodes: [
        { id: 'protagonist', label: 'Protagoniste', type: 'Personnes', description: 'Personnage principal du livre' },
        { id: 'lieu_principal', label: 'Lieu Principal', type: 'Lieux', description: 'Lieu central de l\'action' },
        { id: 'theme_central', label: 'Thème Central', type: 'Concepts', description: 'Thème principal de l\'œuvre' },
        { id: 'antagonist', label: 'Antagoniste', type: 'Personnes', description: 'Force d\'opposition' },
        { id: 'symbole', label: 'Symbole', type: 'Concepts', description: 'Élément symbolique important' },
      ],
      links: [
        { source: 'protagonist', target: 'lieu_principal', relation: 'se trouve dans', weight: 0.8 },
        { source: 'protagonist', target: 'theme_central', relation: 'explore', weight: 0.9 },
        { source: 'protagonist', target: 'antagonist', relation: 'affronte', weight: 0.7 },
        { source: 'theme_central', target: 'symbole', relation: 'symbolisé par', weight: 0.6 },
      ]
    }

    return NextResponse.json(mockData)
  }
}

function parseGraphML(graphmlContent: string): GraphData {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(graphmlContent, 'text/xml')

    const nodes: Node[] = []
    const links: Link[] = []

    // Parse nodes
    const nodeElements = doc.getElementsByTagName('node')
    for (let i = 0; i < nodeElements.length; i++) {
      const nodeElement = nodeElements[i]
      const id = nodeElement.getAttribute('id') || ''

      // Extract data elements
      const dataElements = nodeElement.getElementsByTagName('data')
      let type = 'Unknown'
      let description = ''

      for (let j = 0; j < dataElements.length; j++) {
        const dataElement = dataElements[j]
        const key = dataElement.getAttribute('key')
        const value = dataElement.textContent || ''

        if (key === 'd0') { // entity_type
          type = value
        } else if (key === 'd1') { // description
          description = value
        }
      }

      nodes.push({
        id,
        label: id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type,
        description
      })
    }

    // Parse edges
    const edgeElements = doc.getElementsByTagName('edge')
    for (let i = 0; i < edgeElements.length; i++) {
      const edgeElement = edgeElements[i]
      const source = edgeElement.getAttribute('source') || ''
      const target = edgeElement.getAttribute('target') || ''

      // Extract data elements
      const dataElements = edgeElement.getElementsByTagName('data')
      let relation = 'connected to'
      let weight = 0.5

      for (let j = 0; j < dataElements.length; j++) {
        const dataElement = dataElements[j]
        const key = dataElement.getAttribute('key')
        const value = dataElement.textContent || ''

        if (key === 'd2') { // description/relation
          relation = value
        } else if (key === 'd3') { // weight
          weight = parseFloat(value) || 0.5
        }
      }

      links.push({
        source,
        target,
        relation,
        weight
      })
    }

    return { nodes, links }

  } catch (error) {
    console.error('Error parsing GraphML:', error)
    throw error
  }
}