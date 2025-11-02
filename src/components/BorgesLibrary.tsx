'use client'

import { useState, useEffect } from 'react'
import GraphVisualization3D from './GraphVisualization3D'
import QueryInterface from './QueryInterface'
import { reconciliationService } from '@/lib/services/reconciliation'


interface Neo4jGraphData {
  nodes: Array<{
    id: string;
    labels: string[];
    properties: Record<string, any>;
    degree: number;
    centrality_score: number;
  }>;
  relationships: Array<{
    id: string;
    type: string;
    source: string;
    target: string;
    properties: Record<string, any>;
  }>;
}

export default function BorgesLibrary() {
  const [neo4jGraphData, setNeo4jGraphData] = useState<Neo4jGraphData | null>(null)
  const [isLoadingGraph, setIsLoadingGraph] = useState(false)
  const [visibleNodeIds, setVisibleNodeIds] = useState<string[]>([])
  const [searchPath, setSearchPath] = useState<any>(null)

  useEffect(() => {
    loadNeo4jGraph()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  const loadNeo4jGraph = async () => {
    setIsLoadingGraph(true)
    try {
      const nodesData = await reconciliationService.getNodes({ limit: 300 })
      if (nodesData.success && nodesData.nodes.length > 0) {
        const nodeIds = nodesData.nodes.map(node => node.id)
        console.log(`📊 Loading optimized graph with ${nodeIds.length} nodes...`)

        // Use a reasonable limit for relationships to avoid performance issues
        const relationshipsData = await reconciliationService.getRelationships(nodeIds, 800)

        const relationships = relationshipsData.success ? relationshipsData.relationships : []

        console.log(`📈 Graph loaded successfully:`)
        console.log(`  • Nodes: ${nodesData.nodes.length}`)
        console.log(`  • Relationships: ${relationships.length}`)
        console.log(`  • Ratio: ${(relationships.length / nodesData.nodes.length).toFixed(2)} relationships per node`)

        if (relationshipsData.filtered) {
          console.warn(`⚠️ Relationship count was limited to ${relationshipsData.limit_applied}`)
        }

        setNeo4jGraphData({
          nodes: nodesData.nodes,
          relationships
        })

        // Set initial visible nodes (all nodes for galaxy view)
        setVisibleNodeIds(nodesData.nodes.map(node => node.id))
      }
    } catch (error) {
      console.error('Error loading Neo4j graph:', error)
    } finally {
      setIsLoadingGraph(false)
    }
  }


  const handleHighlightPath = (searchPathData: any) => {
    console.log('🎯 Received search path in BorgesLibrary:', searchPathData)
    setSearchPath(searchPathData)
  }

  const handleClearHighlight = () => {
    console.log('🧹 Clearing highlights in BorgesLibrary')
    setSearchPath(null)
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
      <main className="h-[calc(100vh-120px)]">
        <div className="h-full flex flex-col">
          {/* Query Bar */}
          <div className="p-4 bg-borges-secondary border-b border-gray-600">
            <QueryInterface
              selectedBook={null}
              visibleNodeIds={visibleNodeIds}
              onHighlightPath={handleHighlightPath}
              onClearHighlight={handleClearHighlight}
            />
          </div>

          {/* 3D Galaxy Visualization */}
          <div className="flex-1 bg-black">
            <GraphVisualization3D
              neo4jGraphData={neo4jGraphData}
              searchPath={searchPath}
              onNodeVisibilityChange={setVisibleNodeIds}
            />
          </div>
        </div>
      </main>
    </div>
  )
}