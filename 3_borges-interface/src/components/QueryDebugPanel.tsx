'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline'
import type {
  DebugInfo,
  DebugEntity,
  DebugCommunity,
  DebugRelationship,
  DebugTextSource
} from '@/lib/services/reconciliation'

interface QueryDebugPanelProps {
  debugInfo: DebugInfo | null
  isVisible: boolean
  onToggleVisibility: () => void
  onTriggerAnimation?: (phase?: string) => void
  isAnimationPlaying?: boolean
}

export default function QueryDebugPanel({
  debugInfo,
  isVisible,
  onToggleVisibility,
  onTriggerAnimation,
  isAnimationPlaying = false
}: QueryDebugPanelProps) {
  const [activeTab, setActiveTab] = useState<'entities' | 'communities' | 'relationships' | 'sources'>('entities')
  const [selectedPhase, setSelectedPhase] = useState<string>('entity_selection')

  if (!debugInfo) return null

  const { processing_phases, context_stats, animation_timeline } = debugInfo

  const handlePhaseSelect = (phase: string) => {
    setSelectedPhase(phase)

    // Set active tab based on phase
    switch (phase) {
      case 'entity_selection':
        setActiveTab('entities')
        break
      case 'community_analysis':
        setActiveTab('communities')
        break
      case 'relationship_mapping':
        setActiveTab('relationships')
        break
      case 'text_synthesis':
        setActiveTab('sources')
        break
    }

    // Trigger animation for this phase
    if (onTriggerAnimation) {
      onTriggerAnimation(processing_phases[phase as keyof typeof processing_phases]?.phase)
    }
  }

  const renderEntityTable = (entities: DebugEntity[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-datack-border">
        <thead className="bg-datack-panel">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-datack-muted uppercase tracking-wider">
              Name
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-datack-muted uppercase tracking-wider">
              Type
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-datack-muted uppercase tracking-wider">
              Rank
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-datack-muted uppercase tracking-wider">
              Score
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-datack-muted uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-datack-black divide-y divide-datack-border">
          {entities.map((entity, idx) => (
            <tr key={entity.id || idx} className="hover:bg-datack-black-hover">
              <td className="px-3 py-4 text-sm font-medium text-datack-light">
                {entity.name || entity.id}
              </td>
              <td className="px-3 py-4 text-sm text-datack-muted">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-datack-panel text-datack-yellow border border-datack-border">
                  {entity.type}
                </span>
              </td>
              <td className="px-3 py-4 text-sm text-datack-muted">
                {entity.rank}
              </td>
              <td className="px-3 py-4 text-sm text-datack-muted">
                <div className="flex items-center">
                  <div className="w-16 bg-datack-panel rounded-full h-2">
                    <div
                      className="bg-datack-yellow h-2 rounded-full"
                      style={{ width: `${Math.min(entity.score * 100, 100)}%` }}
                    />
                  </div>
                  <span className="ml-2 text-xs">{(entity.score * 100).toFixed(0)}%</span>
                </div>
              </td>
              <td className="px-3 py-4 text-sm text-datack-muted max-w-xs truncate">
                {entity.description || 'No description'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderCommunityCards = (communities: DebugCommunity[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {communities.map((community, idx) => (
        <div key={community.id || idx} className="bg-datack-panel rounded-lg p-4 border border-datack-border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-base font-semibold text-datack-light">
              {community.title}
            </h4>
            <div className="flex items-center">
              <span className="text-datack-yellow">{community.impact_rating}/10</span>
            </div>
          </div>
          <p className="text-sm text-datack-muted mb-2 line-clamp-3">
            {community.content}
          </p>
          <div className="flex justify-between items-center text-xs text-datack-muted">
            <span>Relevance: {(community.relevance * 100).toFixed(0)}%</span>
            <span className="px-2 py-1 bg-datack-black text-datack-muted rounded border border-datack-border">
              Community {community.id}
            </span>
          </div>
        </div>
      ))}
    </div>
  )

  const renderRelationshipList = (relationships: DebugRelationship[]) => (
    <div className="space-y-3">
      {relationships.slice(0, 20).map((rel, idx) => (
        <div key={idx} className="bg-datack-panel rounded-lg p-3 border border-datack-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm font-medium text-datack-light">
              <span className="bg-datack-black text-datack-light px-2 py-1 rounded text-xs border border-datack-border">
                {rel.source}
              </span>
              <span className="mx-2 text-datack-yellow">→</span>
              <span className="bg-datack-black text-datack-light px-2 py-1 rounded text-xs border border-datack-border">
                {rel.target}
              </span>
            </div>
            <div className="text-xs text-datack-muted">
              Weight: {rel.weight} | Order: {rel.traversal_order}
            </div>
          </div>
          <p className="text-sm text-datack-muted">
            {rel.description}
          </p>
        </div>
      ))}
      {relationships.length > 20 && (
        <div className="text-center text-sm text-datack-muted">
          ... and {relationships.length - 20} more relationships
        </div>
      )}
    </div>
  )

  const renderSourcesList = (sources: DebugTextSource[]) => (
    <div className="space-y-3">
      {sources.map((source, idx) => (
        <div key={source.id || idx} className="bg-datack-panel rounded-lg p-4 border border-datack-border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-datack-light">
              Source {source.id}
            </h4>
            <div className="flex items-center">
              <div className="w-16 bg-datack-black rounded-full h-2">
                <div
                  className="bg-datack-yellow h-2 rounded-full"
                  style={{ width: `${source.relevance * 100}%` }}
                />
              </div>
              <span className="ml-2 text-xs text-datack-muted">
                {(source.relevance * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <p className="text-sm text-datack-muted">
            {source.content}
          </p>
        </div>
      ))}
    </div>
  )

  return (
    <div className="border-t border-datack-border">
      {/* Debug Panel Header */}
      <div className="flex items-center justify-between p-4 bg-datack-panel">
        <button
          onClick={onToggleVisibility}
          className="flex items-center text-sm font-medium text-datack-muted hover:text-datack-light"
        >
          {isVisible ? (
            <ChevronUpIcon className="w-4 h-4 mr-2" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 mr-2" />
          )}
          GraphRAG Debug Information
        </button>

        {isVisible && (
          <div className="flex items-center space-x-3">
            {/* Animation Controls */}
            <button
              onClick={() => onTriggerAnimation?.()}
              className="datack-btn-primary text-xs"
            >
              {isAnimationPlaying ? (
                <PauseIcon className="w-3 h-3 mr-1" />
              ) : (
                <PlayIcon className="w-3 h-3 mr-1" />
              )}
              {isAnimationPlaying ? 'Pause' : 'Replay'} Animation
            </button>

            {/* Performance Stats */}
            <div className="text-xs text-datack-muted">
              Total: {context_stats.total_time_ms}ms | Mode: {context_stats.mode}
            </div>
          </div>
        )}
      </div>

      {/* Debug Panel Content */}
      {isVisible && (
        <div className="p-4 space-y-6 bg-datack-black">
          {/* Animation Timeline */}
          <div className="bg-datack-panel rounded-lg p-4">
            <h3 className="text-sm font-medium text-datack-light mb-3">
              Processing Timeline
            </h3>
            <div className="flex space-x-1">
              {animation_timeline.map((phase, idx) => (
                <div
                  key={phase.phase}
                  className={`flex-1 h-8 rounded cursor-pointer transition-all ${
                    selectedPhase === Object.keys(processing_phases)[idx]
                      ? 'bg-datack-yellow text-datack-black'
                      : 'bg-datack-black hover:bg-datack-black-hover text-datack-muted'
                  }`}
                  onClick={() => handlePhaseSelect(Object.keys(processing_phases)[idx])}
                  title={phase.description}
                >
                  <div className="flex items-center justify-center h-full text-xs font-medium">
                    {phase.phase}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Phases Tabs */}
          <div className="border-b border-datack-border">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'entities', label: 'Entities', count: processing_phases.entity_selection.entities?.length || 0 },
                { key: 'communities', label: 'Communities', count: processing_phases.community_analysis.communities?.length || 0 },
                { key: 'relationships', label: 'Relationships', count: processing_phases.relationship_mapping.relationships?.length || 0 },
                { key: 'sources', label: 'Text Sources', count: processing_phases.text_synthesis.sources?.length || 0 },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-datack-yellow text-datack-yellow'
                      : 'border-transparent text-datack-muted hover:text-datack-muted hover:border-datack-border'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'entities' && processing_phases.entity_selection.entities && (
              renderEntityTable(processing_phases.entity_selection.entities)
            )}
            {activeTab === 'communities' && processing_phases.community_analysis.communities && (
              renderCommunityCards(processing_phases.community_analysis.communities)
            )}
            {activeTab === 'relationships' && processing_phases.relationship_mapping.relationships && (
              renderRelationshipList(processing_phases.relationship_mapping.relationships)
            )}
            {activeTab === 'sources' && processing_phases.text_synthesis.sources && (
              renderSourcesList(processing_phases.text_synthesis.sources)
            )}
          </div>
        </div>
      )}
    </div>
  )
}