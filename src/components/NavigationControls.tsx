import React, { useState } from 'react';
import {
  ArrowDownUp,
  ArrowRight,
  Compass,
  Home,
  MapPin,
  Navigation,
  Search,
  X,
  ListOrdered,
  Layers,
  Grid3X3,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { CampusNode } from '../types';
import { getTypeBadgeColor } from '../utils/iconHelper';

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
  showNetworkGrid?: boolean;
  onToggleNetworkGrid?: () => void;
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
  onBackToHome,
  mapStyle = 'satellite',
  onToggleMapStyle,
  onResetView,
  showNetworkGrid = false,
  onToggleNetworkGrid,
}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'to' | 'from'>('to');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const selectedFromNode = nodes.find((n) => n.id === selectedFromId);
  const selectedToNode = nodes.find((n) => n.id === selectedToId);

  // Popular quick route destinations
  const quickPresets = [
    { label: 'Data Eng Block', id: 'dept-data-eng', tag: 'New Block' },
    { label: 'CSE Block', id: 'dept-cse-central', tag: 'Dept' },
    { label: 'ECE Dept', id: 'dept-ece', tag: 'Dept' },
    { label: 'Mechanical Dept', id: 'dept-mech', tag: 'Dept' },
    { label: 'Admin Block', id: 'central-admin', tag: 'Admin' },
    { label: 'Canteen', id: 'canteen', tag: 'Food' },
    { label: 'Civil, EEE, Chem', id: 'dept-civil-eee-chem', tag: 'Dept' },
    { label: 'Central Library', id: 'library-pg', tag: 'Library' },
    { label: 'Main Gate', id: 'main-gate', tag: 'Gate' },
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'department', label: 'Departments' },
    { id: 'academic', label: 'Academic' },
    { id: 'canteen', label: 'Food' },
    { id: 'facility', label: 'Facilities' },
    { id: 'gate', label: 'Gates' },
  ];

  const filteredNodes = nodes.filter((node) => {
    if (!node.isSelectable) return false;
    if (categoryFilter !== 'all' && node.type !== categoryFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      node.name.toLowerCase().includes(q) ||
      (node.teluguName && node.teluguName.toLowerCase().includes(q)) ||
      (node.description && node.description.toLowerCase().includes(q))
    );
  });

  const handlePickNode = (nodeId: string) => {
    if (activeTab === 'to') {
      onSelectTo(nodeId);
      // If From is not yet set, default to Main Gate for immediate path calculation
      if (!selectedFromId && nodeId !== 'main-gate') {
        onSelectFrom('main-gate');
      }
      setIsSearchModalOpen(false);
    } else {
      onSelectFrom(nodeId);
      setActiveTab('to');
    }
  };

  const handlePresetClick = (nodeId: string) => {
    onSelectTo(nodeId);
    if (!selectedFromId && nodeId !== 'main-gate') {
      onSelectFrom('main-gate');
    }
    setIsSearchModalOpen(false);
  };

  return (
    <>
      {/* =========================================================
          1. FLOATING UNIFIED TOP APP BAR
          Compact, non-intrusive, mobile-first header
         ========================================================= */}
      <header className="absolute top-2.5 sm:top-4 inset-x-2.5 sm:inset-x-4 max-w-4xl mx-auto z-30 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-1.5 sm:p-2 flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Back to College Home Button */}
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-xl transition-all font-semibold text-xs shrink-0 cursor-pointer shadow-2xs"
              title="Return to MVGR College Home"
            >
              <Home className="w-4 h-4 text-blue-700" />
              <span className="hidden sm:inline font-bold">College Home</span>
            </button>
          )}

          {/* Central Route Search Pill */}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex-1 flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all text-left min-w-0 cursor-pointer group"
          >
            <Search className="w-4 h-4 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="truncate flex-1">
              {selectedToNode ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate">
                  <span className="text-emerald-700 truncate max-w-[45%]">
                    {selectedFromNode ? selectedFromNode.name : 'Main Gate'}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-blue-700 truncate max-w-[45%]">
                    {selectedToNode.name}
                  </span>
                </div>
              ) : (
                <div className="text-xs font-bold text-slate-800 truncate">
                  Where to on MVGR Campus?
                </div>
              )}
              <div className="text-[10px] text-slate-500 truncate hidden xs:block">
                Tap to search departments, blocks &amp; routes
              </div>
            </div>
          </button>

          {/* Swap Button (Visible if both endpoints exist) */}
          {selectedFromId && selectedToId && (
            <button
              type="button"
              onClick={onSwap}
              className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors shrink-0 cursor-pointer"
              title="Reverse Direction"
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>
          )}

          {/* Satellite / Vector Toggle Button */}
          {onToggleMapStyle && (
            <button
              type="button"
              onClick={onToggleMapStyle}
              className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1 text-xs font-bold ${
                mapStyle === 'satellite'
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={`Switch to ${mapStyle === 'satellite' ? 'Vector' : 'Satellite'} Map`}
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">
                {mapStyle === 'satellite' ? 'Satellite' : 'Vector'}
              </span>
            </button>
          )}

          {/* Directory Button */}
          {onOpenDirectory && (
            <button
              type="button"
              onClick={onOpenDirectory}
              className="p-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 rounded-xl transition-colors shrink-0 cursor-pointer"
              title="A–Z Campus Directory"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          )}

          {/* Network Grid Toggle Button */}
          {onToggleNetworkGrid && (
            <button
              type="button"
              onClick={onToggleNetworkGrid}
              className={`hidden sm:flex p-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
                showNetworkGrid
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle Walking Road Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          )}

          {/* Clear Route Button (If active) */}
          {(selectedFromId || selectedToId) && (
            <button
              type="button"
              onClick={onClear}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
              title="Clear Active Route"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* =========================================================
          2. INTERACTIVE ROUTE SEARCH MODAL / BOTTOM SHEET
          Does NOT permanently block the map; closes cleanly on selection!
         ========================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          {/* Backdrop dismiss */}
          <div
            className="absolute inset-0"
            onClick={() => setIsSearchModalOpen(false)}
          />

          {/* Sheet/Modal Card */}
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden z-10 animate-in slide-in-from-bottom duration-200">
            {/* Sheet Handle (Mobile) */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 sm:hidden" />

            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                    Plan Campus Walking Route
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    MVGR College of Engineering
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Origin & Destination Pickers */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-2.5">
              {/* From Selector */}
              <div className="flex items-center gap-2">
                <div className="w-6 flex justify-center">
                  <div className="w-3 h-3 rounded-full border-2 border-emerald-600 bg-white" />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('from')}
                  className={`flex-1 px-3 py-2 text-left rounded-xl text-xs font-semibold border transition-all ${
                    activeTab === 'from'
                      ? 'bg-white border-emerald-500 ring-2 ring-emerald-100 text-slate-900 shadow-xs'
                      : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                    Starting Point
                  </span>
                  <span className="truncate block font-bold">
                    {selectedFromNode ? selectedFromNode.name : 'Main Gate (Default Entrance)'}
                  </span>
                </button>
              </div>

              {/* To Selector */}
              <div className="flex items-center gap-2">
                <div className="w-6 flex justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('to')}
                  className={`flex-1 px-3 py-2 text-left rounded-xl text-xs font-semibold border transition-all ${
                    activeTab === 'to'
                      ? 'bg-white border-blue-500 ring-2 ring-blue-100 text-slate-900 shadow-xs'
                      : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-blue-700 block">
                    Destination
                  </span>
                  <span className="truncate block font-bold">
                    {selectedToNode ? selectedToNode.name : 'Tap to choose destination...'}
                  </span>
                </button>
              </div>

              {/* Quick Preset Chips */}
              <div className="pt-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Popular Quick Destinations
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetClick(preset.id)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                        selectedToId === preset.id
                          ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {preset.tag === 'New Block' && (
                        <span className="ml-1 text-[8px] font-extrabold uppercase px-1 py-0.2 rounded bg-amber-500 text-white">
                          New
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Input & Category Filters */}
            <div className="p-3 border-b border-slate-100 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={`Search for ${activeTab === 'to' ? 'destination' : 'starting'} block or facility...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      categoryFilter === cat.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Filtered Locations */}
            <div className="overflow-y-auto p-2 divide-y divide-slate-100 flex-1">
              {filteredNodes.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No matching locations found for "{searchQuery}".
                </div>
              ) : (
                filteredNodes.map((node) => {
                  const badge = getTypeBadgeColor(node.type);
                  const isSelected =
                    activeTab === 'to'
                      ? selectedToId === node.id
                      : selectedFromId === node.id;

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => handlePickNode(node.id)}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-xs text-slate-900 truncate">
                          {node.name}
                        </div>
                        {node.teluguName && (
                          <div className="text-[10px] text-slate-400 font-medium truncate">
                            {node.teluguName}
                          </div>
                        )}
                        {node.description && (
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {node.description}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badge.bg} text-white uppercase tracking-wider`}
                        >
                          {node.type}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with Find Route action */}
            {selectedToId && (
              <div className="p-3 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onFindRoute();
                    setIsSearchModalOpen(false);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>Navigate on Campus Map</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
