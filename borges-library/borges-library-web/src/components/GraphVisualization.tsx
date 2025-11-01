'use client'

import { useEffect, useRef, useState } from 'react'
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

  useEffect(() => {
    if (graphData) {
      parseGraphData(graphData)
    } else {
      // Create mock data while loading real data
      createMockGraph()
    }
  }, [graphData, book])

  const createMockGraph = () => {
    const mockNodes: Node[] = [
      { id: 'protagonist', label: 'Protagoniste', type: 'Personnes', description: 'Personnage principal' },
      { id: 'lieu_principal', label: 'Lieu Principal', type: 'Lieux', description: 'Lieu central de l\'action' },
      { id: 'theme_central', label: 'Thème Central', type: 'Concepts', description: 'Thème principal de l\'œuvre' },
      { id: 'antagonist', label: 'Antagoniste', type: 'Personnes', description: 'Force d\'opposition' },
      { id: 'symbole', label: 'Symbole', type: 'Concepts', description: 'Élément symbolique important' },
    ]

    const mockLinks: Link[] = [
      { source: 'protagonist', target: 'lieu_principal', relation: 'se trouve dans', weight: 0.8 },
      { source: 'protagonist', target: 'theme_central', relation: 'explore', weight: 0.9 },
      { source: 'protagonist', target: 'antagonist', relation: 'affronte', weight: 0.7 },
      { source: 'theme_central', target: 'symbole', relation: 'symbolisé par', weight: 0.6 },
    ]

    setNodes(mockNodes)
    setLinks(mockLinks)
    setIsLoading(false)
  }

  const parseGraphData = (data: any) => {
    try {
      if (data && data.nodes && data.links) {
        setNodes(data.nodes)
        setLinks(data.links)
      } else {
        createMockGraph()
        return
      }
    } catch (error) {
      console.error('Error parsing graph data:', error)
      createMockGraph()
      return
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!isLoading && nodes.length > 0) {
      drawGraph()
    }
  }, [isLoading, nodes, links])

  const drawGraph = () => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))

    // Color scale for different node types
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['Personnes', 'Lieux', 'Concepts'])
      .range(['#3B82F6', '#10B981', '#F59E0B'])

    // Links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#6B7280')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => Math.sqrt((d.weight || 0.5) * 4))

    // Nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 8)
      .attr('fill', d => colorScale(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }))

    // Labels
    const labels = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text(d => d.label)
      .attr('font-size', 12)
      .attr('font-family', 'Inter, sans-serif')
      .attr('fill', '#F3F4F6')
      .attr('text-anchor', 'middle')
      .attr('dy', -12)
      .style('pointer-events', 'none')

    // Tooltips
    node.append('title')
      .text(d => `${d.label}\n${d.type}\n${d.description || ''}`)

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!)

      labels
        .attr('x', d => d.x!)
        .attr('y', d => d.y!)
    })
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-borges-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du graphe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-lg font-medium text-borges-light mb-2">
          {book.title} - {book.author}
        </h3>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Personnes
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Lieux
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            Concepts
          </div>
        </div>
      </div>

      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </div>
  )
}