/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CAMPUS_NODES } from './data/campusData';
import { findShortestRoute, getSelectableNodes } from './utils/pathfinding';
import { RouteResult, CampusNode } from './types';
import { NavigationControls } from './components/NavigationControls';
import { CampusMap } from './components/CampusMap';
import { RouteSummary } from './components/RouteSummary';
import { LegendModal } from './components/LegendModal';
import { SatelliteInfoModal } from './components/SatelliteInfoModal';
import { NodeInfoModal } from './components/NodeInfoModal';
import { LocationsSidePanel } from './components/LocationsSidePanel';
import { HomePage } from './components/HomePage';
import { getTypeBadgeColor } from './utils/iconHelper';
import {
  Compass,
  Home,
  Info,
  Layers,
  ListOrdered,
  MapPin,
  Navigation,
  RotateCcw,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  // Page view state: 'home' for College Overview & Intro; 'map' for Full Campus Pathfinder
  const [currentPage, setCurrentPage] = useState<'home' | 'map'>('home');

  const selectableNodes = getSelectableNodes();

  // Selected endpoints (default: Main Gate to Data Engineering block for immediate demo)
  const [selectedFromId, setSelectedFromId] = useState<string>('main-gate');
  const [selectedToId, setSelectedToId] = useState<string>('dept-data-eng');
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);

  // Map appearance settings
  const [mapStyle, setMapStyle] = useState<'satellite' | 'vector'>('satellite');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [showNetworkGrid, setShowNetworkGrid] = useState<boolean>(false);

  // Panel & modal toggles
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [isSatelliteInfoOpen, setIsSatelliteInfoOpen] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  // Department / Location Information Modal state
  const [selectedNodeForInfo, setSelectedNodeForInfo] = useState<CampusNode | null>(null);
  const [isNodeInfoOpen, setIsNodeInfoOpen] = useState<boolean>(false);
  const [focusedNode, setFocusedNode] = useState<CampusNode | null>(null);

  // Quick Action Card when user taps a marker on the map directly
  const [activeMapNode, setActiveMapNode] = useState<CampusNode | null>(null);

  // Handler to open node information modal
  const handleOpenNodeInfo = useCallback((node: CampusNode) => {
    setSelectedNodeForInfo(node);
    setIsNodeInfoOpen(true);
  }, []);

  // Compute route whenever From or To changes or when Find Route is clicked
  const computeRoute = useCallback((fromId: string, toId: string) => {
    if (!fromId || !toId) {
      setRouteResult(null);
      setIsSimulating(false);
      return;
    }
    const result = findShortestRoute(fromId, toId);
    setRouteResult(result);
    setIsSimulating(false);
    setSimulationProgress(0);
  }, []);

  // Compute initial route on mount
  useEffect(() => {
    computeRoute('main-gate', 'dept-data-eng');
  }, [computeRoute]);

  // Handle From selection
  const handleSelectFrom = (id: string) => {
    setSelectedFromId(id);
    if (id && selectedToId) {
      computeRoute(id, selectedToId);
    } else {
      setRouteResult(null);
    }
    if (id) {
      const node = CAMPUS_NODES.find((n) => n.id === id);
      if (node) setFocusedNode(node);
    }
  };

  // Handle To selection
  const handleSelectTo = (id: string) => {
    setSelectedToId(id);
    const startId = selectedFromId || 'main-gate';
    if (!selectedFromId) {
      setSelectedFromId('main-gate');
    }
    if (id) {
      computeRoute(startId, id);
      const node = CAMPUS_NODES.find((n) => n.id === id);
      if (node) setFocusedNode(node);
    } else {
      setRouteResult(null);
    }
  };

  // Handle Swap
  const handleSwap = () => {
    const prevFrom = selectedFromId;
    const prevTo = selectedToId;
    setSelectedFromId(prevTo);
    setSelectedToId(prevFrom);
    if (prevFrom && prevTo) {
      computeRoute(prevTo, prevFrom);
    }
  };

  // Handle Clear
  const handleClear = () => {
    setSelectedFromId('');
    setSelectedToId('');
    setRouteResult(null);
    setIsSimulating(false);
    setSimulationProgress(0);
  };

  // Direct map node click
  const handleMapNodeClick = (node: CampusNode) => {
    setActiveMapNode(node);
    setFocusedNode(node);
  };

  // Reset view to encompass the campus
  const handleResetView = () => {
    if (selectedFromId && selectedToId) {
      computeRoute(selectedFromId, selectedToId);
    } else {
      const mainGate = CAMPUS_NODES.find((n) => n.id === 'main-gate');
      if (mainGate) setFocusedNode(mainGate);
    }
  };

  // Simulation animation loop
  useEffect(() => {
    if (!isSimulating) {
      setSimulationProgress(0);
      return;
    }

    let animId: number;
    let startTime: number | null = null;
    const totalMeters = routeResult?.totalDistance || 300;
    const durationMs = Math.max(6000, Math.min(18000, totalMeters * 25));

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      setSimulationProgress(progress);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setIsSimulating(false);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isSimulating, routeResult]);

  if (currentPage === 'home') {
    return (
      <HomePage
        onNavigateToMap={(destId?: string) => {
          if (destId) {
            handleSelectTo(destId);
          }
          setCurrentPage('map');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans antialiased select-none">
      {/* =========================================================================
          1. FULL-SCREEN INTERACTIVE CAMPUS MAP (CRS.Simple with Satellite SVG)
         ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0">
        <CampusMap
          fromNodeId={selectedFromId}
          toNodeId={selectedToId}
          routeResult={routeResult}
          onSelectFrom={handleSelectFrom}
          onSelectTo={handleSelectTo}
          onOpenNodeInfo={handleOpenNodeInfo}
          onNodeClick={handleMapNodeClick}
          focusedNode={focusedNode}
          highContrast={highContrast}
          mapStyle={mapStyle}
          isSimulating={isSimulating}
          simulationProgress={simulationProgress}
          showNetworkGrid={showNetworkGrid}
        />
      </div>

      {/* =========================================================================
          2. FLOATING NAVIGATION CONTROLS (Google Maps Style Console)
         ========================================================================= */}
      <NavigationControls
        nodes={selectableNodes}
        selectedFromId={selectedFromId}
        selectedToId={selectedToId}
        onSelectFrom={handleSelectFrom}
        onSelectTo={handleSelectTo}
        onSwap={handleSwap}
        onFindRoute={() => computeRoute(selectedFromId, selectedToId)}
        onClear={handleClear}
        onOpenDirectory={() => setIsSidePanelOpen(!isSidePanelOpen)}
        onOpenNodeInfo={handleOpenNodeInfo}
        onBackToHome={() => setCurrentPage('home')}
        mapStyle={mapStyle}
        onToggleMapStyle={() => setMapStyle(mapStyle === 'satellite' ? 'vector' : 'satellite')}
        onResetView={handleResetView}
        onOpenSatelliteInfo={() => setIsSatelliteInfoOpen(true)}
      />

      {/* =========================================================================
          3. FLOATING TOP-RIGHT QUICK ACTIONS (Desktop & Mobile accessible)
         ========================================================================= */}
      <div className="absolute top-4 right-4 z-20 flex flex-col sm:flex-row items-end sm:items-center gap-2 pointer-events-auto">
        {/* Return to College Home Button */}
        <button
          type="button"
          onClick={() => setCurrentPage('home')}
          className="px-3 py-2 text-xs font-bold rounded-xl shadow-lg border backdrop-blur-md transition-all flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-800 border-slate-200"
          title="Return to MVGR College Home"
        >
          <Home className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Map Style Toggle: Satellite vs Vector */}
        <button
          type="button"
          onClick={() => setMapStyle(mapStyle === 'satellite' ? 'vector' : 'satellite')}
          className="px-3 py-2 text-xs font-bold rounded-xl shadow-lg border backdrop-blur-md transition-all flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-800 border-slate-200"
          title="Switch Map Style"
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">
            {mapStyle === 'satellite' ? '🛰️ Satellite' : '📐 Vector'}
          </span>
        </button>

        {/* Path Grid Toggle */}
        <button
          type="button"
          onClick={() => setShowNetworkGrid(!showNetworkGrid)}
          className={`px-3 py-2 text-xs font-bold rounded-xl shadow-lg border backdrop-blur-md transition-all flex items-center gap-1.5 ${
            showNetworkGrid
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white/90 text-slate-700 hover:bg-white border-slate-200'
          }`}
          title="Toggle Walking Trails & Junctions"
        >
          <span className="hidden sm:inline">Path Grid</span>
          <span className="sm:hidden">Grid</span>
        </button>

        {/* Directory Button */}
        <button
          type="button"
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          className="px-3 py-2 text-xs font-bold rounded-xl shadow-lg border backdrop-blur-md transition-all flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-800 border-slate-200"
          title="A–Z Campus Directory"
        >
          <ListOrdered className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline">Directory (A–Z)</span>
        </button>
      </div>

      {/* =========================================================================
          4. FLOATING ROUTE SUMMARY (Docked at Bottom-Left or Mobile Bottom)
         ========================================================================= */}
      {routeResult && (
        <div className="absolute bottom-4 left-4 z-20 max-w-sm w-[calc(100%-2rem)] sm:w-auto pointer-events-auto">
          <RouteSummary
            route={routeResult}
            onClearRoute={handleClear}
            isSimulating={isSimulating}
            onStartSimulation={() => setIsSimulating(true)}
            onStopSimulation={() => setIsSimulating(false)}
            simulationProgress={simulationProgress}
          />
        </div>
      )}

      {/* =========================================================================
          5. DIRECT MAP CLICK QUICK-ACTION CARD ("Use Navigation on the Map Itself")
         ========================================================================= */}
      {activeMapNode && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-3.5 animate-in slide-in-from-bottom pointer-events-auto">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${getTypeBadgeColor(activeMapNode.type).bg}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {activeMapNode.type}
                </span>
                {activeMapNode.isEstimated && (
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-medium">
                    Estimated
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {activeMapNode.name}
              </h3>
              {activeMapNode.teluguName && (
                <p className="text-xs text-slate-500 font-medium">{activeMapNode.teluguName}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveMapNode(null)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeMapNode.description && (
            <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
              {activeMapNode.description}
            </p>
          )}

          {/* Quick Action Buttons on Selected Map Node */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                handleSelectFrom(activeMapNode.id);
                setActiveMapNode(null);
              }}
              className="px-2.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>From Here</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSelectTo(activeMapNode.id);
                setActiveMapNode(null);
              }}
              className="px-2.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5 fill-current" />
              <span>Route To</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleOpenNodeInfo(activeMapNode);
                setActiveMapNode(null);
              }}
              className="px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Info</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. MODALS & SIDE PANELS
         ========================================================================= */}
      {/* Collapsible Alphabetical Locations Directory Side Panel */}
      <LocationsSidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        nodes={CAMPUS_NODES}
        selectedFromId={selectedFromId}
        selectedToId={selectedToId}
        onSelectFrom={handleSelectFrom}
        onSelectTo={handleSelectTo}
        onOpenNodeInfo={handleOpenNodeInfo}
      />

      {/* Department & Landmark Detailed Information Modal */}
      <NodeInfoModal
        isOpen={isNodeInfoOpen}
        node={selectedNodeForInfo}
        onClose={() => setIsNodeInfoOpen(false)}
        onSelectAsFrom={(id: string) => handleSelectFrom(id)}
        onSelectAsTo={(id: string) => handleSelectTo(id)}
        onFocusOnMap={(node: CampusNode) => setFocusedNode(node)}
      />

      {/* Legend & Satellite Info Modals */}
      <LegendModal
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
        showNetworkGrid={showNetworkGrid}
        onToggleNetworkGrid={() => setShowNetworkGrid(!showNetworkGrid)}
      />

      <SatelliteInfoModal isOpen={isSatelliteInfoOpen} onClose={() => setIsSatelliteInfoOpen(false)} />
    </div>
  );
}
