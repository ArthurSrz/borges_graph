'use client'

import React, { useState } from 'react'
import LoadingWheel3D from './LoadingWheel3D'

type HighlightArea = 'welcome' | 'query' | 'mode-local' | 'mode-global' | 'search-btn' | 'graph' | 'answer' | 'graphrag-explain' | 'provenance'

interface TutorialStep {
  title: string
  description: string
  highlight: HighlightArea
}

interface TutorialOverlayProps {
  onComplete: () => void
  isDataLoading: boolean
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Bienvenue dans l\'explorateur du Grand Débat',
    description: 'Cet outil vous permet d\'interroger les contributions citoyennes des Cahiers de Doléances 2019. 50 communes de Charente-Maritime, des milliers de voix citoyennes à explorer.',
    highlight: 'welcome'
  },
  {
    title: 'Posez votre question',
    description: 'Formulez votre question en langage courant, comme vous le feriez à un collaborateur. Par exemple : "Quelles sont les préoccupations sur les impôts ?" ou "Que disent les citoyens sur les services publics ?"',
    highlight: 'query'
  },
  {
    title: 'Mode Local : une commune',
    description: 'Le mode "Local" analyse une seule commune en profondeur. Utile pour comprendre les spécificités d\'un territoire précis ou préparer une visite de terrain.',
    highlight: 'mode-local'
  },
  {
    title: 'Mode Global : vue d\'ensemble',
    description: 'Le mode "Global" interroge plusieurs communes simultanément. Idéal pour identifier les tendances régionales et les préoccupations transversales du territoire.',
    highlight: 'mode-global'
  },
  {
    title: 'Lancez la recherche',
    description: 'Cliquez sur "Recherche" pour analyser les contributions citoyennes. L\'intelligence artificielle parcourt les textes pour construire une réponse synthétique.',
    highlight: 'search-btn'
  },
  {
    title: 'Comment ça fonctionne ?',
    description: 'Le système a transformé les textes citoyens en un "graphe de connaissances" : les thèmes, préoccupations et propositions sont reliés entre eux. Quand vous posez une question, l\'IA navigue dans ce graphe pour trouver les réponses pertinentes.',
    highlight: 'graphrag-explain'
  },
  {
    title: 'Le graphe visuel',
    description: 'Le graphe 3D affiche les thèmes et concepts identifiés dans les réponses. Chaque nœud représente une préoccupation citoyenne, un thème ou une proposition. Les liens montrent comment ces éléments sont connectés.',
    highlight: 'graph'
  },
  {
    title: 'La réponse citoyenne',
    description: 'La réponse synthétise les contributions pertinentes. Les termes surlignés correspondent aux thèmes identifiés dans le graphe. Cliquez dessus pour explorer les connexions.',
    highlight: 'answer'
  },
  {
    title: 'Traçabilité : d\'où vient l\'information ?',
    description: 'Chaque réponse est traçable jusqu\'aux textes citoyens originaux. Vous pouvez toujours vérifier la source d\'une information et lire le verbatim citoyen complet.',
    highlight: 'provenance'
  }
]

const InterfaceSchematic: React.FC<{ highlightedArea: HighlightArea }> = ({ highlightedArea }) => {
  const getHighlightClass = (area: HighlightArea) =>
    highlightedArea === area ? 'stroke-sky-400 stroke-2 animate-pulse' : 'stroke-borges-light-muted/30 stroke-1'

  const getAreaOpacity = (area: HighlightArea) =>
    highlightedArea === area ? 'opacity-100' : 'opacity-40'

  const getFillHighlight = (area: HighlightArea) =>
    highlightedArea === area ? 'fill-sky-400/20' : 'fill-borges-secondary'

  return (
    <svg viewBox="0 0 510 320" className="w-full max-w-2xl mx-auto">
      {/* Background panel */}
      <rect x="10" y="10" width="490" height="300" rx="8"
        className="fill-borges-dark stroke-borges-border stroke-1" />

      {/* Header area with title */}
      <g className={`transition-opacity duration-300 ${getAreaOpacity('welcome')}`}>
        <text x="250" y="32" textAnchor="middle"
          className="fill-borges-light text-xs font-medium">
          Grand Débat National
        </text>
        <text x="250" y="44" textAnchor="middle"
          className="fill-borges-light-muted text-[8px]">
          50 communes · Charente-Maritime
        </text>
      </g>

      {/* ===== SEARCH BAR ROW ===== */}

      {/* Data source indicator */}
      <g className={`transition-opacity duration-300 opacity-60`}>
        <rect x="20" y="55" width="100" height="24" rx="4"
          className="fill-borges-secondary stroke-borges-border stroke-1" />
        <text x="30" y="71" className="fill-borges-light text-[8px]">🏛️ Grand Débat</text>
      </g>

      {/* Query input */}
      <g className={`transition-opacity duration-300 ${getAreaOpacity('query')}`}>
        <rect x="125" y="55" width="200" height="24" rx="4"
          className={`${getFillHighlight('query')} transition-all duration-300 ${getHighlightClass('query')}`} />
        <text x="135" y="71" className="fill-borges-light-muted text-[8px]">Quelles préoccupations sur les impôts ?</text>
      </g>

      {/* Mode toggle container */}
      <g className={`transition-opacity duration-300 ${highlightedArea === 'mode-local' || highlightedArea === 'mode-global' ? 'opacity-100' : 'opacity-40'}`}>
        <rect x="330" y="55" width="80" height="24" rx="4"
          className="fill-borges-secondary stroke-borges-border stroke-1" />

        {/* Local button */}
        <g className={`${getAreaOpacity('mode-local')}`}>
          <rect x="332" y="57" width="38" height="20" rx="3"
            className={`${highlightedArea === 'mode-local' ? 'fill-borges-light' : 'fill-transparent'} transition-all duration-300 ${getHighlightClass('mode-local')}`} />
          <text x="340" y="70" className={`text-[7px] ${highlightedArea === 'mode-local' ? 'fill-borges-dark' : 'fill-borges-light-muted'}`}>Local</text>
        </g>

        {/* Global button */}
        <g className={`${getAreaOpacity('mode-global')}`}>
          <rect x="370" y="57" width="38" height="20" rx="3"
            className={`${highlightedArea === 'mode-global' ? 'fill-borges-light' : 'fill-transparent'} transition-all duration-300 ${getHighlightClass('mode-global')}`} />
          <text x="376" y="70" className={`text-[7px] ${highlightedArea === 'mode-global' ? 'fill-borges-dark' : 'fill-borges-light-muted'}`}>Global</text>
        </g>
      </g>

      {/* Search button */}
      <g className={`transition-opacity duration-300 ${getAreaOpacity('search-btn')}`}>
        <rect x="415" y="55" width="70" height="24" rx="4"
          className={`${highlightedArea === 'search-btn' ? 'fill-borges-accent' : 'fill-borges-accent/60'} transition-all duration-300 ${getHighlightClass('search-btn')}`} />
        <text x="450" y="71" textAnchor="middle" className="fill-borges-dark text-[7px] font-medium">Recherche</text>
      </g>

      {/* ===== MAIN CONTENT AREA ===== */}

      {/* Graph area */}
      <g className={`transition-opacity duration-300 ${getAreaOpacity('graph')}`}>
        <rect x="20" y="90" width="280" height="170" rx="6"
          className={`fill-borges-dark transition-all duration-300 ${getHighlightClass('graph')}`} />

        {/* Civic-themed nodes */}
        {/* Central commune node */}
        <circle cx="150" cy="175" r="22"
          className="fill-blue-500/20 stroke-blue-400 stroke-2" />
        <text x="150" y="180" textAnchor="middle" className="fill-blue-400 text-[10px]">🏛️</text>

        {/* Theme nodes - Fiscal */}
        <circle cx="80" cy="120" r="16"
          className="fill-amber-500/20 stroke-amber-400 stroke-1" />
        <text x="80" y="117" textAnchor="middle" className="fill-amber-400 text-[6px]">Impôts</text>
        <text x="80" y="127" textAnchor="middle" className="fill-amber-400 text-[6px]">💰</text>

        {/* Theme nodes - Services */}
        <circle cx="220" cy="120" r="16"
          className="fill-emerald-500/20 stroke-emerald-400 stroke-1" />
        <text x="220" y="117" textAnchor="middle" className="fill-emerald-400 text-[6px]">Services</text>
        <text x="220" y="127" textAnchor="middle" className="fill-emerald-400 text-[6px]">🏥</text>

        {/* Theme nodes - Environment */}
        <circle cx="70" cy="200" r="14"
          className="fill-green-500/20 stroke-green-400 stroke-1" />
        <text x="70" y="197" textAnchor="middle" className="fill-green-400 text-[5px]">Écologie</text>
        <text x="70" y="207" textAnchor="middle" className="fill-green-400 text-[8px]">🌱</text>

        {/* Theme nodes - Democracy */}
        <circle cx="230" cy="200" r="14"
          className="fill-violet-500/20 stroke-violet-400 stroke-1" />
        <text x="230" y="197" textAnchor="middle" className="fill-violet-400 text-[5px]">Démocratie</text>
        <text x="230" y="207" textAnchor="middle" className="fill-violet-400 text-[8px]">🗳️</text>

        {/* Citizen voice node */}
        <circle cx="150" cy="240" r="12"
          className="fill-rose-500/20 stroke-rose-400 stroke-1" />
        <text x="150" y="244" textAnchor="middle" className="fill-rose-400 text-[8px]">👤</text>

        {/* Edges */}
        <line x1="96" y1="128" x2="130" y2="160" className="stroke-borges-light-muted/50 stroke-1" />
        <line x1="204" y1="128" x2="170" y2="160" className="stroke-borges-light-muted/50 stroke-1" />
        <line x1="84" y1="194" x2="130" y2="180" className="stroke-borges-light-muted/50 stroke-1" />
        <line x1="216" y1="194" x2="170" y2="180" className="stroke-borges-light-muted/50 stroke-1" />
        <line x1="150" y1="228" x2="150" y2="197" className="stroke-borges-light-muted/50 stroke-1" />
        <line x1="80" y1="136" x2="80" y2="184" className="stroke-borges-light-muted/30 stroke-1" />
        <line x1="220" y1="136" x2="230" y2="186" className="stroke-borges-light-muted/30 stroke-1" />
      </g>

      {/* ===== ANSWER PANEL ===== */}
      <g className={`transition-opacity duration-300 ${getAreaOpacity('answer')}`}>
        <rect x="310" y="90" width="175" height="100" rx="4"
          className={`${getFillHighlight('answer')} transition-all duration-300 ${getHighlightClass('answer')}`} />
        <text x="320" y="108" className="fill-borges-light text-[9px] font-medium">Réponse citoyenne</text>
        <line x1="320" y1="114" x2="475" y2="114" className="stroke-borges-border stroke-1" />

        <text x="320" y="130" className="fill-borges-light-muted text-[7px]">Les citoyens expriment des</text>
        <text x="320" y="142" className="fill-borges-light-muted text-[7px]">préoccupations sur la</text>
        {/* Highlighted term */}
        <rect x="391" y="133" width="50" height="12" rx="2" className="fill-amber-400/30" />
        <text x="393" y="142" className="fill-amber-400 text-[7px] font-medium">fiscalité</text>
        <text x="443" y="142" className="fill-borges-light-muted text-[7px]">,</text>

        <text x="320" y="154" className="fill-borges-light-muted text-[7px]">notamment la</text>
        <rect x="378" y="145" width="30" height="12" rx="2" className="fill-amber-400/30" />
        <text x="380" y="154" className="fill-amber-400 text-[7px] font-medium">CSG</text>
        <text x="410" y="154" className="fill-borges-light-muted text-[7px]">et l'</text>
        <rect x="428" y="145" width="22" height="12" rx="2" className="fill-amber-400/30" />
        <text x="430" y="154" className="fill-amber-400 text-[7px] font-medium">ISF</text>
        <text x="452" y="154" className="fill-borges-light-muted text-[7px]">...</text>

        <text x="320" y="178" className="fill-borges-light-muted/60 text-[6px] italic">Cliquez sur les termes surlignés</text>
      </g>

      {/* ===== PROVENANCE PANEL ===== */}
      <g className={`transition-opacity duration-300 ${getAreaOpacity('provenance')}`}>
        <rect x="310" y="195" width="175" height="65" rx="4"
          className={`${getFillHighlight('provenance')} transition-all duration-300 ${getHighlightClass('provenance')}`} />
        <text x="320" y="212" className="fill-borges-light text-[8px] font-medium">📄 Source citoyenne</text>
        <line x1="320" y1="218" x2="475" y2="218" className="stroke-borges-border stroke-1" />
        <text x="320" y="232" className="fill-borges-light-muted text-[6px]">« Stop aux taxes qui augmentent</text>
        <text x="320" y="242" className="fill-borges-light-muted text-[6px]">sans amélioration des services... »</text>
        <text x="320" y="254" className="fill-sky-400 text-[6px]">— Rochefort, contribution #47</text>
      </g>

      {/* Legend at bottom */}
      <g className="opacity-60">
        <circle cx="30" cy="275" r="5" className="fill-blue-400" />
        <text x="40" y="278" className="fill-borges-light-muted text-[7px]">Commune</text>

        <circle cx="100" cy="275" r="5" className="fill-amber-400" />
        <text x="110" y="278" className="fill-borges-light-muted text-[7px]">Thème fiscal</text>

        <circle cx="180" cy="275" r="5" className="fill-emerald-400" />
        <text x="190" y="278" className="fill-borges-light-muted text-[7px]">Services</text>

        <circle cx="250" cy="275" r="5" className="fill-violet-400" />
        <text x="260" y="278" className="fill-borges-light-muted text-[7px]">Démocratie</text>

        <circle cx="330" cy="275" r="5" className="fill-rose-400" />
        <text x="340" y="278" className="fill-borges-light-muted text-[7px]">Citoyen</text>
      </g>

      {/* ===== GRAPHRAG EXPLANATION OVERLAY ===== */}
      <g className={`transition-opacity duration-300 ${highlightedArea === 'graphrag-explain' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Semi-transparent overlay */}
        <rect x="40" y="95" width="280" height="155" rx="8"
          className="fill-borges-dark/95 stroke-sky-400 stroke-2 animate-pulse" />

        {/* GraphRAG flow diagram */}
        <text x="180" y="118" textAnchor="middle" className="fill-sky-400 text-[10px] font-medium">Comment fonctionne l'analyse ?</text>

        {/* Step 1: Citizen texts */}
        <rect x="55" y="132" width="60" height="35" rx="4" className="fill-borges-secondary stroke-borges-border" />
        <text x="85" y="147" textAnchor="middle" className="fill-borges-light text-[7px]">📝 Cahiers</text>
        <text x="85" y="158" textAnchor="middle" className="fill-borges-light-muted text-[5px]">de Doléances</text>

        {/* Arrow 1 */}
        <path d="M120 150 L135 150" className="stroke-sky-400 stroke-1" />
        <text x="127" y="145" textAnchor="middle" className="fill-sky-400 text-[5px]">analyse</text>

        {/* Step 2: Knowledge Graph */}
        <rect x="140" y="132" width="60" height="35" rx="4" className="fill-borges-secondary stroke-borges-border" />
        <text x="170" y="147" textAnchor="middle" className="fill-borges-light text-[7px]">🔗 Graphe</text>
        <text x="170" y="158" textAnchor="middle" className="fill-borges-light-muted text-[5px]">thèmes reliés</text>

        {/* Arrow 2 */}
        <path d="M205 150 L220 150" className="stroke-sky-400 stroke-1" />
        <text x="212" y="145" textAnchor="middle" className="fill-sky-400 text-[5px]">synthèse</text>

        {/* Step 3: Answer */}
        <rect x="225" y="132" width="60" height="35" rx="4" className="fill-borges-secondary stroke-borges-border" />
        <text x="255" y="147" textAnchor="middle" className="fill-borges-light text-[7px]">💡 Réponse</text>
        <text x="255" y="158" textAnchor="middle" className="fill-borges-light-muted text-[5px]">sourcée</text>

        {/* Question input */}
        <rect x="120" y="178" width="160" height="22" rx="4" className="fill-borges-accent/20 stroke-borges-accent stroke-1" />
        <text x="200" y="192" textAnchor="middle" className="fill-borges-accent text-[7px]">❓ Votre question</text>

        {/* Arrow from question to graph */}
        <path d="M170 178 L170 169" className="stroke-borges-accent stroke-1" />

        {/* Benefits - civic focused */}
        <text x="60" y="218" className="fill-borges-light-muted text-[6px]">✓ Synthèse de milliers de contributions</text>
        <text x="60" y="231" className="fill-borges-light-muted text-[6px]">✓ Chaque réponse traçable à sa source</text>
        <text x="60" y="244" className="fill-borges-light-muted text-[6px]">✓ Vision transversale des préoccupations</text>
      </g>
    </svg>
  )
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete, isDataLoading }) => {
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1)
    } else {
      localStorage.setItem('borges-tutorial-seen', 'true')
      onComplete()
    }
  }

  const handleSkip = () => {
    localStorage.setItem('borges-tutorial-seen', 'true')
    onComplete()
  }

  const currentStep = tutorialSteps[step]
  const isLastStep = step === tutorialSteps.length - 1

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Hexagon animation - smaller */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12">
            <LoadingWheel3D />
          </div>
        </div>

        {/* Schematic Interface Diagram */}
        <div className="mb-6">
          <InterfaceSchematic highlightedArea={currentStep.highlight} />
        </div>

        {/* Tutorial Text */}
        <div className="text-center">
          <h2 className="text-lg font-medium text-borges-light mb-2">
            {currentStep.title}
          </h2>
          <p className="text-borges-light-muted text-sm mb-5 max-w-md mx-auto leading-relaxed">
            {currentStep.description}
          </p>

          {/* Progress dots */}
          <div className="flex gap-1.5 justify-center mb-4">
            {tutorialSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'bg-borges-light scale-125'
                    : i < step
                      ? 'bg-borges-light/60'
                      : 'bg-borges-light/30'
                }`}
                aria-label={`Étape ${i + 1}`}
              />
            ))}
          </div>

          {/* Step counter */}
          <p className="text-borges-light-muted/50 text-xs mb-3">
            Étape {step + 1}/{tutorialSteps.length}
          </p>

          {/* Continue button */}
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-borges-sm font-medium transition-all duration-300 bg-borges-light text-borges-dark hover:bg-borges-light/90"
          >
            {isLastStep ? 'Commencer l\'exploration →' : 'Continuer →'}
          </button>

          {/* Skip link */}
          <div className="mt-3">
            <button
              onClick={handleSkip}
              className="text-borges-light-muted/50 text-xs hover:text-borges-light-muted transition-colors underline"
            >
              Passer le tutoriel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialOverlay
