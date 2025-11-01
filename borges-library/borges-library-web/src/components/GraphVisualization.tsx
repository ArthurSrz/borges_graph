'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'

interface Book {
  id: string
  title: string
  author: string
  graphData?: any
}

interface GraphVisualizationProps {
  book: Book
  graphData?: any
}

interface Node {
  id: string
  label: string
  type: string
  description?: string
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface Link {
  source: string | Node
  target: string | Node
  relation: string
  weight?: number
}

export default function GraphVisualization({ book, graphData }: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [nodes, setNodes] = useState<Node[]>([])
  const [links, setLinks] = useState<Link[]>([])

  const createMockGraph = useCallback(() => {
    const mockNodes: Node[] = [
      { id: 'protagonist', label: 'Protagoniste', type: 'Personnes', description: 'Personnage principal' },
      { id: 'lieu_principal', label: 'Lieu Principal', type: 'Lieux', description: 'Lieu central de l\'action' },
      { id: 'theme_principal', label: 'Thème Principal', type: 'Concepts', description: 'Thème central' }
    ]

    const mockLinks: Link[] = [
      { source: 'protagonist', target: 'lieu_principal', relation: 'se trouve dans' },
      { source: 'protagonist', target: 'theme_principal', relation: 'incarne' }
    ]

    setNodes(mockNodes)
    setLinks(mockLinks)
    setIsLoading(false)
  }, [])

  const parseGraphData = useCallback((data: any) => {
    try {
      if (data && data.nodes && data.links) {
        setNodes(data.nodes)
        setLinks(data.links)
      } else {
        createMockGraph()
      }
    } catch (error) {
      console.error('Error parsing graph data:', error)
      createMockGraph()
    }
    setIsLoading(false)
  }, [createMockGraph])

  useEffect(() => {
    if (graphData) {
      parseGraphData(graphData)
    } else {
      createMockGraph()
    }
  }, [graphData, book, parseGraphData, createMockGraph])

  const drawGraph = useCallback(() => {
    if (!svgRef.current || isLoading || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Simple visualization with nodes positioned in a grid
    const nodeGroups = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d, i) => `translate(${100 + (i % 3) * 200}, ${100 + Math.floor(i / 3) * 150})`)

    nodeGroups.append('circle')
      .attr('r', 30)
      .attr('fill', '#4F46E5')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .text(d => d.label)

    // Simple links
    if (links.length > 0) {
      svg.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('x1', (d, i) => 100 + (i % 3) * 200)
        .attr('y1', (d, i) => 100 + Math.floor(i / 3) * 150)
        .attr('x2', (d, i) => 100 + ((i + 1) % 3) * 200)
        .attr('y2', (d, i) => 100 + Math.floor((i + 1) / 3) * 150)
        .attr('stroke', '#6B7280')
        .attr('stroke-width', 2)
    }
  }, [isLoading, nodes, links])

  useEffect(() => {
    if (!isLoading && nodes.length > 0) {
      drawGraph()
    }
  }, [isLoading, nodes, links, drawGraph])

  return (
    <div className="h-full w-full bg-borges-secondary rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-borges-accent mx-auto mb-4"></div>
            <p className="text-borges-light">Chargement du graphe...</p>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-600">
            <h3 className="text-lg font-medium text-borges-light">
              Graphe de {book.title}
            </h3>
            <p className="text-sm text-gray-400">
              {nodes.length} entités • {links.length} relations
            </p>
          </div>
          <div className="flex-1">
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              className="bg-gray-900"
            />
          </div>
        </div>
      )}
    </div>
  )
}