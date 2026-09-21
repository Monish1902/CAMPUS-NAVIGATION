export type NodeType = 'department' | 'canteen' | 'washroom' | 'gate' | 'landmark' | 'junction';

export interface NodeInfoDetails {
  fullName: string;
  primaryFunction: string;
  headOrInCharge?: string;
  operatingHours?: string;
  contactEmail?: string;
  contactPhone?: string;
  facilities?: string[];
  locationWing?: string;
  accessibility?: string;
  notes?: string;
  isInfoPending?: boolean; // When certain data is officially marked as to be added
}

export interface CampusNode {
  id: string;
  name: string;
  teluguName?: string;
  type: NodeType;
  x: number; // Map coordinate X (0-1000)
  y: number; // Map coordinate Y (0-1000, 0 is South/Bottom, 1000 is North/Top)
  description?: string;
  isSelectable: boolean; // Junctions and curve waypoints are false, destinations are true
  isEstimated?: boolean; // For nodes like canteen/washrooms estimated from campus layout
  buildingId?: string;
  iconName?: string;
  details?: NodeInfoDetails;
}

export interface CampusEdge {
  id: string;
  source: string;
  target: string;
  distance: number; // approximate real-world meters
  pathPoints?: { x: number; y: number }[]; // intermediate curved points if any
  walkwayType?: 'main-road' | 'paved-promenade' | 'corridor' | 'courtyard-path';
}

export interface RouteResult {
  fromNode: CampusNode;
  toNode: CampusNode;
  pathNodes: CampusNode[];
  allCoordinates: [number, number][]; // [lat (y), lng (x)] for Leaflet
  totalDistance: number; // meters
  estimatedMinutes: number; // walking time
  stepCount: number; // ~0.75m per step
  directions: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number; // meters
  type: 'start' | 'straight' | 'turn-left' | 'turn-right' | 'arrive' | 'landmark';
  nodeName: string;
}

export interface BuildingFootprint {
  id: string;
  name: string;
  teluguName?: string;
  type: NodeType;
  color: string;
  polygon: [number, number][]; // Array of [x, y] points
  labelPos: [number, number]; // [x, y]
  roofDetails?: {
    solarPanels?: [number, number, number, number][]; // [x, y, w, h]
    courtyard?: [number, number, number, number]; // [x, y, w, h]
    wingLabels?: { text: string; x: number; y: number }[];
  };
}
