import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowDownUp,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Compass,
  Home,
  MapPin,
  Navigation,
  Search,
  X,
  Sparkles,
  Info,
  ListOrdered,
  Layers,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { CampusNode, NodeType } from '../types';
import { getNodeIcon, getTypeBadgeColor } from '../utils/iconHelper';

interface NavigationControlsProps {
  nodes: CampusNode[];
  selectedFromId: string;
  selectedToId: string;
  onSelectFrom: (id: string) => void;
  onSelectTo: (id: string) => void;
  onSwap: () => void;
  onFindRoute: () => void;
  onClear: () => void;
  onOpenDirectory?: () => void;
  onOpenNodeInfo?: (node: CampusNode) => void;
  onBackToHome?: () => void;
  mapStyle?: 'satellite' | 'vector';
  onToggleMapStyle?: () => void;
  onResetView?: () => void;
  onOpenSatelliteInfo?: () => void;
  isLoading?: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  nodes,
  selectedFromId,
  selectedToId,
  onSelectFrom,
  onSelectTo,
  onSwap,
  onFindRoute,
  onClear,
  onOpenDirectory,
  onOpenNodeInfo,
  onBackToHome,
  mapStyle = 'satellite',
  onToggleMapStyle,
  onResetView,
  onOpenSatelliteInfo,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | NodeType>('all');

  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  const selectedFromNode = nodes.find((n) => n.id === selectedFromId);
  const selectedToNode = nodes.find((n) => n.id === selectedToId);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target as Node)) {
        setIsFromOpen(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
        setIsToOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter nodes for search dropdowns
  const filterNodes = (searchStr: string) => {
    const q = searchStr.trim().toLowerCase();
    return nodes.filter((node) => {
      const matchCategory = activeCategory === 'all' || node.type === activeCategory;
      if (!matchCategory) return false;
      if (!q) return true;
      return (
        node.name.toLowerCase().includes(q) ||
        (node.teluguName && node.teluguName.includes(q)) ||
        node.type.toLowerCase().includes(q) ||
        (node.details?.fullName && node.details.fullName.toLowerCase().includes(q))
      );
    });
  };

  const filteredFromNodes = filterNodes(fromSearch);
  const filteredToNodes = filterNodes(toSearch);

  // Popular quick route destination presets matching the user's satellite map
  const quickPresets = [
    { label: 'Data Eng', id: 'dept-data-eng', tag: 'New Block' },
    { label: 'Admin Block', id: 'central-admin', tag: 'Office' },
    { label: 'CSE Block', id: 'dept-cse-central', tag: 'Dept' },
    { label: 'Canteen', id: 'canteen', tag: 'Food' },
    { label: 'Civil, EEE, Chem', id: 'dept-civil-eee-chem', tag: 'Dept' },
    { label: 'Central Library', id: 'library-pg', tag: 'Library' },
    { label: 'Mechanical', id: 'dept-mech', tag: 'Dept' },
    { label: 'ECE Dept', id: 'dept-ece', tag: 'Dept' },
    { label: 'Main Gate', id: 'main-gate', tag: 'Gate' },
  ];

  return (
    <>
      {/* =========================================================
          MOBILE TOP SEARCH PILL (Visible only on < md screens)
         ========================================================= */}
      <div className="md:hidden absolute top-3 inset-x-3 z-30 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-2 flex items-center justify-between gap-2">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors shrink-0"
              title="Return to College Home"
            >
              <Home className="w-4 h-4 text-blue-700" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="flex-1 flex items-center gap-2.5 px-3 py-2 text-left rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors min-w-0"
          >
            <Search className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-bold text-slate-800 truncate">
                {selectedToNode ? selectedToNode.name : 'Where to on MVGR Campus?'}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {selectedFromNode ? `From: ${selectedFromNode.name}` : 'Tap to search or pick route...'}
              </div>
            </div>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            {onOpenDirectory && (
              <button
                type="button"
                onClick={onOpenDirectory}
                className="p-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                title="A-Z Directory"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            )}
            {onToggleMapStyle && (
              <button
                type="button"
                onClick={onToggleMapStyle}
                className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                title="Toggle Satellite / Vector"
              >
                <Layers className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          DESKTOP FLOATING NAVIGATION CONSOLE (Top-Left on md+ screens)
          OR MOBILE SLIDE-OVER SHEET WHEN OPEN
         ========================================================= */}
      <div
        className={`z-30 pointer-events-auto transition-all duration-300 ${
          isMobileOpen
            ? 'fixed inset-x-0 bottom-0 top-12 bg-white rounded-t-3xl shadow-2xl p-4 flex flex-col md:static'
            : 'hidden md:block absolute top-4 left-4 w-96 max-w-[calc(100vw-32px)]'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Card Top Branding & Quick Toggles */}
          <div className="p-3 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center font-bold text-white shadow-xs shrink-0">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div className="truncate">
                <h1 className="text-xs font-bold uppercase tracking-wider text-blue-100 flex items-center gap-1.5">
                  <span>MVGR Campus Guide</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-500/40 text-blue-200">
                    Satellite
                  </span>
                </h1>
                <p className="text-[11px] text-blue-100 truncate">
                  Engineering College • Vizianagaram
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Return to Home button */}
              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="p-1.5 hover:bg-white/15 text-blue-100 hover:text-white rounded-lg transition-colors flex items-center gap-1"
                  title="Return to College Home"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden xl:inline text-[11px] font-semibold">Home</span>
                </button>
              )}

              {/* Directory Button */}
              {onOpenDirectory && (
                <button
                  type="button"
                  onClick={onOpenDirectory}
                  className="p-1.5 hover:bg-white/15 text-blue-100 hover:text-white rounded-lg transition-colors"
                  title="Alphabetical Locations Directory (A–Z)"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              )}

              {/* Satellite Reference Info */}
              {onOpenSatelliteInfo && (
                <button
                  type="button"
                  onClick={onOpenSatelliteInfo}
                  className="p-1.5 hover:bg-white/15 text-blue-100 hover:text-white rounded-lg transition-colors"
                  title="Satellite Ground Truth Specs"
                >
                  <Info className="w-4 h-4" />
                </button>
              )}

              {/* Reset View */}
              {onResetView && (
                <button
                  type="button"
                  onClick={onResetView}
                  className="p-1.5 hover:bg-white/15 text-blue-100 hover:text-white rounded-lg transition-colors"
                  title="Reset Map View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {/* Desktop Minimize/Expand */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden md:flex p-1.5 hover:bg-white/15 text-blue-100 hover:text-white rounded-lg transition-colors"
                title={isExpanded ? 'Collapse Navigation Card' : 'Expand Navigation Card'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Mobile Close Sheet Button */}
              {isMobileOpen && (
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="md:hidden p-1.5 hover:bg-white/15 text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Collapsed State Summary Pill (Desktop) */}
          {!isExpanded && (
            <div className="p-3 flex items-center justify-between gap-2 bg-slate-50/90 text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">
                  {selectedToNode ? selectedToNode.name : 'Search Campus...'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition-colors shadow-xs"
              >
                Open Route
              </button>
            </div>
          )}

          {/* Expanded State Body */}
          {isExpanded && (
            <div className="p-3.5 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] md:max-h-[600px]">
              {/* FROM & TO INPUT GROUP */}
              <div className="relative space-y-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
                {/* Visual Connector Line */}
                <div className="absolute left-[26px] top-[32px] bottom-[32px] w-0.5 border-l-2 border-dashed border-slate-300 pointer-events-none" />

                {/* 1. FROM SELECTOR */}
                <div className="relative" ref={fromDropdownRef}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-100" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsFromOpen(!isFromOpen);
                        setIsToOpen(false);
                      }}
                      className={`flex-1 min-h-[38px] px-3 py-1.5 bg-white border rounded-xl flex items-center justify-between text-left text-xs transition-all shadow-2xs ${
                        isFromOpen ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        {selectedFromNode ? (
                          <div className="font-semibold text-slate-900 truncate">
                            {selectedFromNode.name}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">Select start location...</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 shrink-0 ml-1">
                        {selectedFromId && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectFrom('');
                            }}
                            className="p-0.5 hover:text-slate-600"
                            title="Clear"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  </div>

                  {/* From Dropdown */}
                  {isFromOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 flex flex-col animate-in fade-in zoom-in-95">
                      <div className="p-2 border-b border-slate-100 bg-slate-50">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Filter starting point..."
                            value={fromSearch}
                            onChange={(e) => setFromSearch(e.target.value)}
                            autoFocus
                            className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto divide-y divide-slate-100 p-1">
                        {filteredFromNodes.map((node) => {
                          const badge = getTypeBadgeColor(node.type);
                          return (
                            <button
                              key={node.id}
                              type="button"
                              onClick={() => {
                                onSelectFrom(node.id);
                                setIsFromOpen(false);
                                setFromSearch('');
                              }}
                              className="w-full px-2.5 py-1.5 flex items-center justify-between text-left hover:bg-blue-50 rounded-lg text-xs transition-colors"
                            >
                              <div className="truncate">
                                <div className="font-semibold text-slate-800 truncate">{node.name}</div>
                                {node.teluguName && (
                                  <div className="text-[10px] text-slate-400 truncate">{node.teluguName}</div>
                                )}
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badge.bg} text-white shrink-0 ml-1`}>
                                {node.type}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. SWAP BUTTON BAR */}
                <div className="flex justify-end pr-2 py-0.5">
                  <button
                    type="button"
                    onClick={onSwap}
                    className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200/80 bg-white shadow-2xs flex items-center gap-1 text-[10px] font-semibold"
                    title="Swap start and destination"
                  >
                    <ArrowDownUp className="w-3 h-3" />
                    <span>Swap</span>
                  </button>
                </div>

                {/* 3. TO SELECTOR */}
                <div className="relative" ref={toDropdownRef}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 ring-4 ring-rose-100" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsToOpen(!isToOpen);
                        setIsFromOpen(false);
                      }}
                      className={`flex-1 min-h-[38px] px-3 py-1.5 bg-white border rounded-xl flex items-center justify-between text-left text-xs transition-all shadow-2xs ${
                        isToOpen ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        {selectedToNode ? (
                          <div className="font-semibold text-slate-900 truncate">
                            {selectedToNode.name}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">Select destination...</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 shrink-0 ml-1">
                        {selectedToId && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTo('');
                            }}
                            className="p-0.5 hover:text-slate-600"
                            title="Clear"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  </div>

                  {/* To Dropdown */}
                  {isToOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 flex flex-col animate-in fade-in zoom-in-95">
                      <div className="p-2 border-b border-slate-100 bg-slate-50">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Filter destination..."
                            value={toSearch}
                            onChange={(e) => setToSearch(e.target.value)}
                            autoFocus
                            className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto divide-y divide-slate-100 p-1">
                        {filteredToNodes.map((node) => {
                          const badge = getTypeBadgeColor(node.type);
                          return (
                            <button
                              key={node.id}
                              type="button"
                              onClick={() => {
                                onSelectTo(node.id);
                                setIsToOpen(false);
                                setToSearch('');
                              }}
                              className="w-full px-2.5 py-1.5 flex items-center justify-between text-left hover:bg-blue-50 rounded-lg text-xs transition-colors"
                            >
                              <div className="truncate">
                                <div className="font-semibold text-slate-800 truncate">{node.name}</div>
                                {node.teluguName && (
                                  <div className="text-[10px] text-slate-400 truncate">{node.teluguName}</div>
                                )}
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badge.bg} text-white shrink-0 ml-1`}>
                                {node.type}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS: FIND ROUTE & CLEAR */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onFindRoute();
                    if (isMobileOpen) setIsMobileOpen(false);
                  }}
                  disabled={!selectedFromId || !selectedToId}
                  className={`flex-1 py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    selectedFromId && selectedToId
                      ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5 fill-current" />
                  <span>Find Walking Route</span>
                </button>

                {(selectedFromId || selectedToId) && (
                  <button
                    type="button"
                    onClick={onClear}
                    className="py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* POPULAR QUICK PRESET CHIPS */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Destinations
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">Tap to navigate</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        onSelectTo(preset.id);
                        if (isMobileOpen) setIsMobileOpen(false);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all flex items-center gap-1 shadow-2xs ${
                        selectedToId === preset.id
                          ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {preset.tag === 'New Block' && (
                        <span className="text-[8px] font-extrabold uppercase px-1 py-0.2 rounded bg-amber-500 text-white">
                          New
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
