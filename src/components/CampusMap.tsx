import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CAMPUS_EDGES, CAMPUS_NODES } from '../data/campusData';
import { getCampusSvgString } from '../data/campusSvgGenerator';
import { CampusNode, RouteResult } from '../types';
import { getTypeBadgeColor } from '../utils/iconHelper';

interface CampusMapProps {
  fromNodeId: string;
  toNodeId: string;
  routeResult: RouteResult | null;
  onSelectFrom: (id: string) => void;
  onSelectTo: (id: string) => void;
  onOpenNodeInfo?: (node: CampusNode) => void;
  onNodeClick?: (node: CampusNode) => void;
  focusedNode?: CampusNode | null;
  highContrast: boolean;
  mapStyle?: 'satellite' | 'vector';
  isSimulating: boolean;
  simulationProgress: number; // 0 to 1
  showNetworkGrid: boolean;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  fromNodeId,
  toNodeId,
  routeResult,
  onSelectFrom,
  onSelectTo,
  onOpenNodeInfo,
  onNodeClick,
  focusedNode,
  highContrast,
  mapStyle = 'satellite',
  isSimulating,
  simulationProgress,
  showNetworkGrid,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseOverlayRef = useRef<L.ImageOverlay | null>(null);
  const currentSvgUrlRef = useRef<string | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const networkGridLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const simulationMarkerRef = useRef<L.Marker | null>(null);

  // Helper to generate a reliable Object URL from the SVG generator
  const createSvgBlobUrl = (contrast: boolean, style: 'satellite' | 'vector'): string => {
    const svgStr = getCampusSvgString({ highContrast: contrast, mapStyle: style }).trim();
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    return URL.createObjectURL(blob);
  };

  // Map Bounds in CRS.Simple: [0, 0] to [1000, 1000]
  const bounds = new L.LatLngBounds([0, 0], [1000, 1000]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -0.8,
      maxZoom: 3.5,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      attributionControl: false,
      maxBounds: bounds.pad(0.15),
      maxBoundsViscosity: 0.9,
    });

    mapInstanceRef.current = map;

    // SVG Base Overlay with robust Blob URL
    const initialUrl = createSvgBlobUrl(highContrast, mapStyle);
    currentSvgUrlRef.current = initialUrl;
    const baseOverlay = L.imageOverlay(initialUrl, bounds, {
      interactive: true,
    }).addTo(map);
    baseOverlayRef.current = baseOverlay;

    // Layer groups for markers, network grid, and routes
    const networkGrid = L.layerGroup().addTo(map);
    networkGridLayerRef.current = networkGrid;

    const routeGroup = L.layerGroup().addTo(map);
    routeLayerRef.current = routeGroup;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    map.fitBounds(bounds);

    // Clean up
    return () => {
      if (currentSvgUrlRef.current) {
        URL.revokeObjectURL(currentSvgUrlRef.current);
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base SVG Overlay if highContrast or mapStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current || !baseOverlayRef.current) return;
    const newUrl = createSvgBlobUrl(highContrast, mapStyle);
    baseOverlayRef.current.setUrl(newUrl);
    if (currentSvgUrlRef.current) {
      URL.revokeObjectURL(currentSvgUrlRef.current);
    }
    currentSvgUrlRef.current = newUrl;
  }, [highContrast, mapStyle]);

  // Center on focusedNode when it changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !focusedNode) return;
    map.setView([focusedNode.y, focusedNode.x], 1.2, {
      animate: true,
      duration: 0.6,
    });
  }, [focusedNode]);

  // Render Network Grid (if toggled)
  useEffect(() => {
    const group = networkGridLayerRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showNetworkGrid) return;

    // Draw all walkable edges
    for (const edge of CAMPUS_EDGES) {
      const sourceNode = CAMPUS_NODES.find((n) => n.id === edge.source);
      const targetNode = CAMPUS_NODES.find((n) => n.id === edge.target);
      if (sourceNode && targetNode) {
        L.polyline(
          [
            [sourceNode.y, sourceNode.x],
            [targetNode.y, targetNode.x],
          ],
          {
            color: '#38bdf8',
            weight: 2.5,
            opacity: 0.7,
            dashArray: '5, 5',
          }
        ).addTo(group);
      }
    }

    // Draw all node dots
    for (const node of CAMPUS_NODES) {
      if (!node.isSelectable) {
        L.circleMarker([node.y, node.x], {
          radius: 3.5,
          color: '#0284c7',
          fillColor: '#ffffff',
          fillOpacity: 0.9,
          weight: 1.5,
        })
          .bindTooltip(`Junction: ${node.name}`, { direction: 'top', className: 'text-xs font-medium' })
          .addTo(group);
      }
    }
  }, [showNetworkGrid]);

  // Render Markers
  useEffect(() => {
    const group = markersLayerRef.current;
    if (!group) return;
    group.clearLayers();

    const selectableNodes = CAMPUS_NODES.filter((n) => n.isSelectable);

    for (const node of selectableNodes) {
      const isFrom = node.id === fromNodeId;
      const isTo = node.id === toNodeId;
      const badge = getTypeBadgeColor(node.type);

      // Icon HTML
      let pulseClass = '';
      let markerBorder = 'border-white';
      let statusTag = '';

      if (isFrom) {
        pulseClass = 'marker-pulse-start';
        markerBorder = 'border-emerald-300 ring-4 ring-emerald-400';
        statusTag = `<div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap">START</div>`;
      } else if (isTo) {
        pulseClass = 'marker-pulse-dest';
        markerBorder = 'border-rose-300 ring-4 ring-rose-400';
        statusTag = `<div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap">DEST</div>`;
      }

      const iconHtml = `
        <div class="relative group cursor-pointer">
          ${statusTag}
          <div class="w-8 h-8 rounded-full ${badge.bg} ${markerBorder} ${pulseClass} text-white flex items-center justify-center shadow-lg transition-transform hover:scale-115">
            <span class="text-xs font-bold">${node.name.charAt(0)}</span>
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 ${badge.bg} rotate-45 transform"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-campus-marker',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([node.y, node.x], { icon: customIcon });

      // Interactive Popup Content
      const popupHtml = `
        <div class="p-3 max-w-[260px] font-sans">
          <div class="flex items-center justify-between gap-1.5 mb-1.5">
            <div class="flex items-center gap-1.5">
              <span class="inline-block w-2.5 h-2.5 rounded-full ${badge.bg}"></span>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${node.type}</span>
            </div>
            ${node.isEstimated ? '<span class="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-medium">Estimated</span>' : ''}
          </div>
          <h4 class="text-sm font-bold text-slate-900 leading-snug">${node.name}</h4>
          ${node.teluguName ? `<p class="text-xs text-slate-500 mb-1 font-medium">${node.teluguName}</p>` : ''}
          ${node.description ? `<p class="text-[11px] text-slate-600 mb-2.5 line-clamp-2">${node.description}</p>` : ''}
          
          <div class="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 mb-2">
            <button id="popup-from-${node.id}" class="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-[11px] rounded-lg transition-colors text-center shadow-xs">
              From Here
            </button>
            <button id="popup-to-${node.id}" class="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-[11px] rounded-lg transition-colors text-center shadow-xs">
              Directions To
            </button>
          </div>

          <button id="popup-info-${node.id}" class="w-full py-1.5 text-center text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-colors border border-blue-200 flex items-center justify-center gap-1">
            <svg class="w-3.5 h-3.5 text-blue-600 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>View Info &amp; Hours</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      // On click also notify parent for floating quick-action drawer
      marker.on('click', () => {
        if (onNodeClick) {
          onNodeClick(node);
        }
      });

      // Bind buttons inside popup on open
      marker.on('popupopen', () => {
        const fromBtn = document.getElementById(`popup-from-${node.id}`);
        const toBtn = document.getElementById(`popup-to-${node.id}`);
        const infoBtn = document.getElementById(`popup-info-${node.id}`);

        if (fromBtn) {
          fromBtn.onclick = () => {
            onSelectFrom(node.id);
            marker.closePopup();
          };
        }
        if (toBtn) {
          toBtn.onclick = () => {
            onSelectTo(node.id);
            marker.closePopup();
          };
        }
        if (infoBtn && onOpenNodeInfo) {
          infoBtn.onclick = () => {
            onOpenNodeInfo(node);
            marker.closePopup();
          };
        }
      });

      // Quick hover tooltip
      marker.bindTooltip(
        `<div class="font-bold text-xs">${node.name}</div>${
          node.teluguName ? `<div class="text-[10px] text-slate-500">${node.teluguName}</div>` : ''
        }`,
        {
          direction: 'top',
          offset: [0, -28],
          className: 'shadow-md rounded-lg',
        }
      );

      marker.addTo(group);
    }
  }, [fromNodeId, toNodeId, onSelectFrom, onSelectTo, onOpenNodeInfo, onNodeClick]);

  // Render Active Route Polyline
  useEffect(() => {
    const group = routeLayerRef.current;
    const map = mapInstanceRef.current;
    if (!group || !map) return;

    group.clearLayers();

    if (!routeResult || routeResult.allCoordinates.length < 2) return;

    const coords = routeResult.allCoordinates; // array of [lat (y), lng (x)]

    // Outer Halo line for contrast over satellite imagery
    L.polyline(coords, {
      color: '#ffffff',
      weight: 12,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(group);

    // Deep blue accent line
    L.polyline(coords, {
      color: '#1d4ed8',
      weight: 8,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(group);

    // Animated dashed pulse route line
    const animatedPolyline = L.polyline(coords, {
      color: '#38bdf8',
      weight: 5,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
      className: 'animated-route-line',
    }).addTo(group);

    // Start Waypoint Ring
    const startCoord = coords[0];
    L.circleMarker(startCoord, {
      radius: 8,
      color: '#059669',
      fillColor: '#10b981',
      fillOpacity: 1,
      weight: 3,
    }).addTo(group);

    // End Waypoint Ring
    const endCoord = coords[coords.length - 1];
    L.circleMarker(endCoord, {
      radius: 8,
      color: '#dc2626',
      fillColor: '#ef4444',
      fillOpacity: 1,
      weight: 3,
    }).addTo(group);

    // Auto-fit route with comfortable padding
    const routeBounds = animatedPolyline.getBounds();
    map.fitBounds(routeBounds.pad(0.3), {
      animate: true,
      duration: 0.8,
    });
  }, [routeResult]);

  // Walking simulation marker update
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!isSimulating || !routeResult || routeResult.allCoordinates.length < 2) {
      if (simulationMarkerRef.current) {
        simulationMarkerRef.current.remove();
        simulationMarkerRef.current = null;
      }
      return;
    }

    // Calculate interpolated position based on simulationProgress
    const coords = routeResult.allCoordinates;
    const totalSegments = coords.length - 1;
    const scaledProgress = simulationProgress * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentProgress = scaledProgress - segmentIndex;

    const p1 = coords[segmentIndex];
    const p2 = coords[segmentIndex + 1];

    const currentLat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
    const currentLng = p1[1] + (p2[1] - p1[1]) * segmentProgress;

    const walkerIcon = L.divIcon({
      className: 'walker-simulation-avatar',
      html: `
        <div class="relative">
          <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl ring-4 ring-white animate-bounce">
            <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    if (!simulationMarkerRef.current) {
      simulationMarkerRef.current = L.marker([currentLat, currentLng], {
        icon: walkerIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    } else {
      simulationMarkerRef.current.setLatLng([currentLat, currentLng]);
      simulationMarkerRef.current.setIcon(walkerIcon);
    }
  }, [isSimulating, simulationProgress, routeResult]);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      <div id="campus-map-container" ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
