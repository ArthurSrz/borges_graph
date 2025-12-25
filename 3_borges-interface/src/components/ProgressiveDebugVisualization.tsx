'use client'

import { useState, useEffect } from 'react'

interface ProcessingPhase {
  name: string
  status: 'pending' | 'processing' | 'completed'
  duration?: number
  data?: any
}

interface ProgressiveDebugVisualizationProps {
  isVisible: boolean
  processingProgress: {
    phases: ProcessingPhase[]
    currentPhase: number
  }
  currentProcessingPhase: string | null
  onClose: () => void
}

export default function ProgressiveDebugVisualization({
  isVisible,
  processingProgress,
  currentProcessingPhase,
  onClose
}: ProgressiveDebugVisualizationProps) {
  const [dots, setDots] = useState('')

  // Animate loading dots for current processing phase
  useEffect(() => {
    if (!currentProcessingPhase) return

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [currentProcessingPhase])

  if (!isVisible) return null

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'processing': return '⚡'
      case 'pending': return '⭕'
      default: return '⭕'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-datack-yellow'
      case 'processing': return 'text-datack-light'
      case 'pending': return 'text-datack-muted'
      default: return 'text-datack-muted'
    }
  }

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-datack-yellow'
      case 'processing': return 'bg-datack-muted'
      case 'pending': return 'bg-datack-panel'
      default: return 'bg-datack-panel'
    }
  }

  const totalPhases = processingProgress.phases.length
  const completedPhases = processingProgress.phases.filter(p => p.status === 'completed').length
  const overallProgress = totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0

  return (
    <div className="datack-modal flex items-center justify-center">
      <div className="bg-datack-black border border-datack-border rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto m-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-h2 text-datack-light">GraphRAG Processing</h2>
            <p className="text-datack-muted">Real-time processing phases</p>
          </div>
          <button
            onClick={onClose}
            className="text-datack-muted hover:text-datack-light text-2xl"
          >
            ×
          </button>
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-datack-light">Overall Progress</span>
            <span className="text-sm text-datack-muted">{completedPhases}/{totalPhases} phases</span>
          </div>
          <div className="w-full bg-datack-panel rounded-full h-3">
            <div
              className="bg-datack-yellow h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="text-right text-sm text-datack-muted mt-1">
            {Math.round(overallProgress)}% complete
          </div>
        </div>

        {/* Current Processing Phase Highlight */}
        {currentProcessingPhase && (
          <div className="mb-6 p-4 bg-datack-panel rounded-lg border border-blue-500/50">
            <div className="flex items-center space-x-3">
              <div className="animate-spinner-glow text-xl">✦</div>
              <div>
                <div className="font-medium text-lg text-datack-light">{currentProcessingPhase}</div>
                <div className="animate-blue-white-glow font-medium">Processing{dots}</div>
              </div>
            </div>
          </div>
        )}

        {/* Phase Timeline */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-datack-light mb-4">Phase Timeline</h3>

          {processingProgress.phases.map((phase, index) => {
            const isActive = index === processingProgress.currentPhase

            return (
              <div key={index} className={`relative flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-datack-panel border border-datack-yellow scale-[1.02]'
                  : phase.status === 'completed'
                  ? 'bg-datack-panel border border-datack-yellow/50'
                  : 'bg-datack-panel border border-datack-border'
              }`}>

                {/* Phase Icon */}
                <div className={`text-xl ${isActive ? 'animate-pulse' : ''}`}>
                  {getPhaseIcon(phase.status)}
                </div>

                {/* Phase Info */}
                <div className="flex-1">
                  <div className={`font-medium ${getStatusColor(phase.status)}`}>
                    {phase.name}
                  </div>

                  {/* Phase Progress Bar */}
                  <div className="mt-2 w-full bg-datack-black rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ease-out ${getProgressBarColor(phase.status)} ${
                        phase.status === 'processing' ? 'animate-pulse' : ''
                      }`}
                      style={{
                        width: phase.status === 'completed' ? '100%'
                             : phase.status === 'processing' ? '60%'
                             : '0%'
                      }}
                    />
                  </div>
                </div>

                {/* Status Text */}
                <div className={`text-sm ${getStatusColor(phase.status)} min-w-[100px] text-right`}>
                  {phase.status === 'completed' && 'Complete'}
                  {phase.status === 'processing' && 'Processing...'}
                  {phase.status === 'pending' && 'Pending'}
                </div>

                {/* Animation for active phase */}
                {isActive && (
                  <div className="absolute inset-0 border border-datack-yellow rounded-lg animate-pulse opacity-50" />
                )}
              </div>
            )
          })}
        </div>

        {/* Processing Details */}
        <div className="mt-8 p-4 bg-datack-panel rounded-lg border border-datack-border">
          <h4 className="font-medium text-datack-light mb-2">Process Details</h4>
          <div className="text-sm text-datack-light-muted space-y-1">
            <div>• <span className="text-datack-light">Query Analysis</span>: Understanding context and intent</div>
            <div>• <span className="text-datack-light">Entity Selection</span>: Identifying relevant graph entities</div>
            <div>• <span className="text-datack-light">Community Analysis</span>: Finding related communities</div>
            <div>• <span className="text-datack-light">Relationship Mapping</span>: Mapping entity connections</div>
            <div>• <span className="text-datack-light">Text Synthesis</span>: Generating final response</div>
            <div>• <span className="text-datack-light">Finalization</span>: Optimizing and formatting</div>
          </div>
        </div>

        {/* Technical Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-datack-panel p-3 rounded-lg border border-datack-border text-center">
            <div className="text-2xl font-bold text-datack-light">{processingProgress.phases.length}</div>
            <div className="text-xs text-datack-muted">Total Phases</div>
          </div>
          <div className="bg-datack-panel p-3 rounded-lg border border-datack-border text-center">
            <div className="text-2xl font-bold text-datack-yellow">{completedPhases}</div>
            <div className="text-xs text-datack-muted">Completed</div>
          </div>
          <div className="bg-datack-panel p-3 rounded-lg border border-datack-border text-center">
            <div className="text-2xl font-bold text-datack-light">{processingProgress.currentPhase + 1}</div>
            <div className="text-xs text-datack-muted">Current Phase</div>
          </div>
        </div>
      </div>
    </div>
  )
}