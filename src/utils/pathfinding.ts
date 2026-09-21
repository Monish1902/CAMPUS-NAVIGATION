import { CAMPUS_EDGES, CAMPUS_NODES } from '../data/campusData';
import { CampusNode, RouteResult, RouteStep } from '../types';

interface AdjacencyEdge {
  targetId: string;
  distance: number;
}

// Build graph adjacency list
const graph: Map<string, AdjacencyEdge[]> = new Map();
const nodeMap: Map<string, CampusNode> = new Map();

for (const node of CAMPUS_NODES) {
  nodeMap.set(node.id, node);
  graph.set(node.id, []);
}

for (const edge of CAMPUS_EDGES) {
  const s = edge.source;
  const t = edge.target;
  if (graph.has(s) && graph.has(t)) {
    graph.get(s)!.push({ targetId: t, distance: edge.distance });
    graph.get(t)!.push({ targetId: s, distance: edge.distance });
  }
}

/**
 * Dijkstra's shortest path algorithm
 */
export function findShortestRoute(fromId: string, toId: string): RouteResult | null {
  if (fromId === toId) {
    const node = nodeMap.get(fromId);
    if (!node) return null;
    return {
      fromNode: node,
      toNode: node,
      pathNodes: [node],
      allCoordinates: [[node.y, node.x]],
      totalDistance: 0,
      estimatedMinutes: 0,
      stepCount: 0,
      directions: [
        {
          instruction: `You are already at ${node.name}`,
          distance: 0,
          type: 'arrive',
          nodeName: node.name,
        },
      ],
    };
  }

  const fromNode = nodeMap.get(fromId);
  const toNode = nodeMap.get(toId);
  if (!fromNode || !toNode) return null;

  const distances: Map<string, number> = new Map();
  const previous: Map<string, string | null> = new Map();
  const unvisited: Set<string> = new Set();

  for (const node of CAMPUS_NODES) {
    distances.set(node.id, Infinity);
    previous.set(node.id, null);
    unvisited.add(node.id);
  }

  distances.set(fromId, 0);

  while (unvisited.size > 0) {
    // Find node with minimum distance in unvisited
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const id of unvisited) {
      const dist = distances.get(id) ?? Infinity;
      if (dist < minDistance) {
        minDistance = dist;
        currentId = id;
      }
    }

    if (!currentId || minDistance === Infinity) {
      break; // Remaining nodes are unreachable
    }

    if (currentId === toId) {
      break; // Reached destination
    }

    unvisited.delete(currentId);

    const neighbors = graph.get(currentId) || [];
    for (const neighbor of neighbors) {
      if (unvisited.has(neighbor.targetId)) {
        const alt = minDistance + neighbor.distance;
        if (alt < (distances.get(neighbor.targetId) ?? Infinity)) {
          distances.set(neighbor.targetId, alt);
          previous.set(neighbor.targetId, currentId);
        }
      }
    }
  }

  // Check if destination was reached
  if ((distances.get(toId) ?? Infinity) === Infinity) {
    return null;
  }

  // Reconstruct path
  const pathNodes: CampusNode[] = [];
  let curr: string | null = toId;
  while (curr) {
    const n = nodeMap.get(curr);
    if (n) pathNodes.unshift(n);
    curr = previous.get(curr) ?? null;
  }

  const totalDistance = Math.round(distances.get(toId) ?? 0);
  // Average human walking speed ~ 1.3 m/s = ~78-80 meters per minute
  const estimatedMinutes = Math.max(1, Math.round(totalDistance / 75));
  // Average stride length ~ 0.75 meters
  const stepCount = Math.round(totalDistance / 0.75);

  // Generate Leaflet coordinates [lat (y), lng (x)]
  const allCoordinates: [number, number][] = pathNodes.map((n) => [n.y, n.x]);

  // Generate human-friendly step-by-step directions
  const directions = generateDirections(pathNodes);

  return {
    fromNode,
    toNode,
    pathNodes,
    allCoordinates,
    totalDistance,
    estimatedMinutes,
    stepCount,
    directions,
  };
}

/**
 * Generate readable turn-by-turn navigation instructions
 */
function generateDirections(path: CampusNode[]): RouteStep[] {
  const steps: RouteStep[] = [];
  if (path.length === 0) return steps;

  steps.push({
    instruction: `Start at ${path[0].name}${path[0].teluguName ? ` (${path[0].teluguName})` : ''}`,
    distance: 0,
    type: 'start',
    nodeName: path[0].name,
  });

  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];

    // Find edge distance
    const neighbors = graph.get(prev.id) || [];
    const edge = neighbors.find((e) => e.targetId === curr.id);
    const legDistance = edge ? edge.distance : Math.round(Math.hypot(curr.x - prev.x, curr.y - prev.y));

    if (i === path.length - 1) {
      steps.push({
        instruction: `Arrive at ${curr.name}`,
        distance: legDistance,
        type: 'arrive',
        nodeName: curr.name,
      });
    } else if (curr.isSelectable) {
      steps.push({
        instruction: `Pass by ${curr.name}`,
        distance: legDistance,
        type: 'landmark',
        nodeName: curr.name,
      });
    } else {
      // Junction navigation tip
      steps.push({
        instruction: `Follow pathway through ${curr.name}`,
        distance: legDistance,
        type: 'straight',
        nodeName: curr.name,
      });
    }
  }

  return steps;
}

/**
 * Get all selectable campus destinations grouped by category
 */
export function getSelectableNodes(): CampusNode[] {
  return CAMPUS_NODES.filter((n) => n.isSelectable);
}

export function getNodeById(id: string): CampusNode | undefined {
  return nodeMap.get(id);
}
