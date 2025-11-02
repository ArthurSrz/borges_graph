interface SearchPath {
  entities: Array<{
    id: string;
    score: number;
    order: number;
    type?: string;
    description?: string;
  }>;
  relations: Array<{
    source: string;
    target: string;
    traversalOrder: number;
    weight?: number;
    description?: string;
  }>;
  communities: Array<{
    id: string;
    relevance: number;
  }>;
}

interface D3Node {
  id: string;
  label: string;
  type: string;
  color: string;
  size: number;
  visible: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  degree: number;
  centrality_score: number;
  // Highlighting states
  highlighted?: boolean;
  dimmed?: boolean;
  searchOrder?: number;
  searchScore?: number;
}

interface D3Link {
  id: string;
  source: string | number | D3Node;
  target: string | number | D3Node;
  relation: string;
  weight: number;
  // Highlighting states
  highlighted?: boolean;
  dimmed?: boolean;
  traversalOrder?: number;
}

export class GraphHighlighter {
  private originalNodeStates: Map<string, Partial<D3Node>> = new Map();
  private originalLinkStates: Map<string, Partial<D3Link>> = new Map();
  private highlightedNodes: Set<string> = new Set();
  private highlightedLinks: Set<string> = new Set();

  /**
   * Store original states before highlighting
   */
  private storeOriginalStates(nodes: D3Node[], links: D3Link[]) {
    // Store node states
    nodes.forEach(node => {
      this.originalNodeStates.set(node.id, {
        color: node.color,
        size: node.size,
        highlighted: node.highlighted || false,
        dimmed: node.dimmed || false
      });
    });

    // Store link states
    links.forEach(link => {
      this.originalLinkStates.set(link.id, {
        highlighted: link.highlighted || false,
        dimmed: link.dimmed || false
      });
    });
  }

  /**
   * Highlight nodes and relationships based on search path
   */
  highlightSearchPath(nodes: D3Node[], links: D3Link[], searchPath: SearchPath): {
    nodes: D3Node[];
    links: D3Link[];
  } {
    console.log('🎯 Highlighting search path:', searchPath);

    // Store original states
    this.storeOriginalStates(nodes, links);

    // Create lookup sets for fast checking
    const searchEntityIds = new Set(searchPath.entities.map(e => e.id));
    const searchEntityMap = new Map(searchPath.entities.map(e => [e.id, e]));

    // Create relation lookup
    const searchRelations = new Set();
    const searchRelationMap = new Map();
    searchPath.relations.forEach(rel => {
      const relKey = `${rel.source}-${rel.target}`;
      const reverseKey = `${rel.target}-${rel.source}`;
      searchRelations.add(relKey);
      searchRelations.add(reverseKey);
      searchRelationMap.set(relKey, rel);
      searchRelationMap.set(reverseKey, rel);
    });

    console.log(`🔍 Search entities: ${searchEntityIds.size}, relations: ${searchRelations.size}`);

    // Process nodes
    const highlightedNodes = nodes.map(node => {
      const isInSearchPath = searchEntityIds.has(node.id);
      const searchEntity = searchEntityMap.get(node.id);

      if (isInSearchPath && searchEntity) {
        // Node is part of search path - highlight it
        this.highlightedNodes.add(node.id);

        return {
          ...node,
          highlighted: true,
          dimmed: false,
          searchOrder: searchEntity.order,
          searchScore: searchEntity.score,
          // Enhanced visual properties
          color: this.getHighlightColor(node.type, searchEntity.score),
          size: Math.max(node.size * 1.5, 12) // Make highlighted nodes bigger
        };
      } else {
        // Node is not in search path - dim it
        return {
          ...node,
          highlighted: false,
          dimmed: true,
          // Reduce visual prominence
          color: this.getDimmedColor(node.color),
          size: Math.max(node.size * 0.7, 4) // Make non-highlighted nodes smaller
        };
      }
    });

    // Process links
    const highlightedLinks = links.map(link => {
      const sourceId = typeof link.source === 'string' ? link.source :
                       typeof link.source === 'number' ? link.source.toString() : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target :
                       typeof link.target === 'number' ? link.target.toString() : link.target.id;
      const relKey = `${sourceId}-${targetId}`;
      const reverseKey = `${targetId}-${sourceId}`;

      const isInSearchPath = searchRelations.has(relKey) || searchRelations.has(reverseKey);
      const searchRelation = searchRelationMap.get(relKey) || searchRelationMap.get(reverseKey);

      if (isInSearchPath && searchRelation) {
        // Link is part of search path
        this.highlightedLinks.add(link.id);

        return {
          ...link,
          highlighted: true,
          dimmed: false,
          traversalOrder: searchRelation.traversalOrder
        };
      } else {
        // Check if both endpoints are highlighted (connection between search entities)
        const sourceHighlighted = this.highlightedNodes.has(sourceId);
        const targetHighlighted = this.highlightedNodes.has(targetId);

        if (sourceHighlighted && targetHighlighted) {
          // Connection between highlighted nodes
          return {
            ...link,
            highlighted: true,
            dimmed: false
          };
        } else {
          // Dim non-relevant links
          return {
            ...link,
            highlighted: false,
            dimmed: true
          };
        }
      }
    });

    console.log(`✨ Highlighted ${this.highlightedNodes.size} nodes and ${this.highlightedLinks.size} links`);

    return {
      nodes: highlightedNodes,
      links: highlightedLinks
    };
  }

  /**
   * Get highlight color based on node type and relevance score
   */
  private getHighlightColor(nodeType: string, score: number): string {
    const intensity = Math.min(score * 0.8 + 0.2, 1); // Ensure minimum visibility

    const baseColors = {
      'Personnes': '#ff6b6b',
      'Lieux': '#4ecdc4',
      'Événements': '#45b7d1',
      'Concepts': '#96ceb4',
      'Organisations': '#feca57',
      'Livres': '#ff9ff3',
      'default': '#a8a8a8'
    };

    const baseColor = baseColors[nodeType as keyof typeof baseColors] || baseColors.default;

    // Make the color more vibrant for highlighted nodes
    return this.brightenColor(baseColor, intensity);
  }

  /**
   * Get dimmed version of a color
   */
  private getDimmedColor(originalColor: string): string {
    // Convert to a muted version
    return originalColor.replace(/rgb?\(([^)]+)\)/, (match, values) => {
      const [r, g, b] = values.split(',').map((v: string) => parseInt(v.trim()));
      return `rgb(${Math.floor(r * 0.3)}, ${Math.floor(g * 0.3)}, ${Math.floor(b * 0.3)})`;
    });
  }

  /**
   * Brighten a hex color
   */
  private brightenColor(hex: string, factor: number): string {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Brighten
    const newR = Math.min(255, Math.floor(r + (255 - r) * factor * 0.3));
    const newG = Math.min(255, Math.floor(g + (255 - g) * factor * 0.3));
    const newB = Math.min(255, Math.floor(b + (255 - b) * factor * 0.3));

    return `rgb(${newR}, ${newG}, ${newB})`;
  }

  /**
   * Clear all highlighting and restore original states
   */
  clearHighlight(nodes: D3Node[], links: D3Link[]): {
    nodes: D3Node[];
    links: D3Link[];
  } {
    console.log('🧹 Clearing graph highlighting');

    // Restore nodes
    const restoredNodes = nodes.map(node => {
      const original = this.originalNodeStates.get(node.id);
      if (original) {
        return {
          ...node,
          ...original,
          highlighted: false,
          dimmed: false,
          searchOrder: undefined,
          searchScore: undefined
        };
      }
      return {
        ...node,
        highlighted: false,
        dimmed: false,
        searchOrder: undefined,
        searchScore: undefined
      };
    });

    // Restore links
    const restoredLinks = links.map(link => {
      const original = this.originalLinkStates.get(link.id);
      if (original) {
        return {
          ...link,
          ...original,
          highlighted: false,
          dimmed: false,
          traversalOrder: undefined
        };
      }
      return {
        ...link,
        highlighted: false,
        dimmed: false,
        traversalOrder: undefined
      };
    });

    // Clear internal state
    this.highlightedNodes.clear();
    this.highlightedLinks.clear();
    this.originalNodeStates.clear();
    this.originalLinkStates.clear();

    return {
      nodes: restoredNodes,
      links: restoredLinks
    };
  }

  /**
   * Get highlighting statistics
   */
  getHighlightStats(): {
    highlightedNodes: number;
    highlightedLinks: number;
    totalNodes: number;
    totalLinks: number;
  } {
    return {
      highlightedNodes: this.highlightedNodes.size,
      highlightedLinks: this.highlightedLinks.size,
      totalNodes: this.originalNodeStates.size,
      totalLinks: this.originalLinkStates.size
    };
  }
}

export const graphHighlighter = new GraphHighlighter();