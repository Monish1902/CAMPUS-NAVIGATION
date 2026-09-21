import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  ChevronRight,
  Navigation,
  Info,
  Building,
  Utensils,
  Bath,
  MapPin,
  Compass,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import { CampusNode, NodeType } from '../types';
import { getNodeIcon, getTypeBadgeColor } from '../utils/iconHelper';

interface LocationsSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: CampusNode[];
  selectedFromId: string;
  selectedToId: string;
  onSelectFrom: (id: string) => void;
  onSelectTo: (id: string) => void;
  onOpenNodeInfo: (node: CampusNode) => void;
}

export const LocationsSidePanel: React.FC<LocationsSidePanelProps> = ({
  isOpen,
  onClose,
  nodes,
  selectedFromId,
  selectedToId,
  onSelectFrom,
  onSelectTo,
  onOpenNodeInfo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | NodeType>('all');
  const [targetSlot, setTargetSlot] = useState<'to' | 'from'>('to'); // Which dropdown slot to populate on direct card click

  // Filter and sort selectable nodes alphabetically by name
  const sortedAndFilteredNodes = useMemo(() => {
    // Only selectable navigational points
    const selectable = nodes.filter((n) => n.isSelectable);

    // Apply category filter
    const categoryFiltered =
      selectedCategory === 'all'
        ? selectable
        : selectable.filter((n) => n.type === selectedCategory);

    // Apply search query filter
    const query = searchQuery.trim().toLowerCase();
    const searched = categoryFiltered.filter((node) => {
      if (!query) return true;
      const matchesName = node.name.toLowerCase().includes(query);
      const matchesTelugu = node.teluguName?.toLowerCase().includes(query);
      const matchesDesc = node.description?.toLowerCase().includes(query);
      const matchesType = node.type.toLowerCase().includes(query);
      const matchesFullName = node.details?.fullName.toLowerCase().includes(query);
      return matchesName || matchesTelugu || matchesDesc || matchesType || matchesFullName;
    });

    // Sort strictly in Alphabetical order A-Z
    return searched.sort((a, b) => a.name.localeCompare(b.name));
  }, [nodes, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const categories: { id: 'all' | NodeType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Locations', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'department', label: 'Departments', icon: <Building className="w-3.5 h-3.5" /> },
    { id: 'canteen', label: 'Canteen', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'washroom', label: 'Washrooms', icon: <Bath className="w-3.5 h-3.5" /> },
    { id: 'landmark', label: 'Landmarks', icon: <MapPin className="w-3.5 h-3.5" /> },
  ];

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 w-full sm:w-96 max-w-md bg-white shadow-2xl border-r border-slate-200 flex flex-col transition-all duration-300 animate-in slide-in-from-left"
      aria-label="Campus Locations Directory"
    >
      {/* Panel Header */}
      <div className="p-4 bg-slate-900 text-white shrink-0">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white leading-tight">
                Campus Directory
              </h2>
              <p className="text-xs text-blue-200">
                Alphabetical Index ({sortedAndFilteredNodes.length} locations)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close Directory panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mt-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search buildings, departments, labs..."
            className="w-full bg-slate-800 text-white placeholder-slate-400 text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Target Slot Selector for Fast 1-Click Dropdown Selection */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
          <span>Clicking a card sets as:</span>
          <span className="font-semibold text-slate-800">
            {targetSlot === 'to' ? 'Destination (To)' : 'Starting Point (From)'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-0.5 bg-slate-200/80 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTargetSlot('from')}
            className={`py-1 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              targetSlot === 'from'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block" />
            Set as "From"
          </button>
          <button
            type="button"
            onClick={() => setTargetSlot('to')}
            className={`py-1 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              targetSlot === 'to'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-300 inline-block" />
            Set as "To"
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-3 py-2 border-b border-slate-200 shrink-0 overflow-x-auto scrollbar-none flex gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 flex items-center gap-1 transition-colors ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Alphabetical Location Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100">
        {sortedAndFilteredNodes.length === 0 ? (
          <div className="text-center py-12 px-4 text-slate-500">
            <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-sm text-slate-700">No locations found</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Try searching with another keyword or select "All Locations".
            </p>
          </div>
        ) : (
          sortedAndFilteredNodes.map((node) => {
            const badge = getTypeBadgeColor(node.type);
            const isFrom = node.id === selectedFromId;
            const isTo = node.id === selectedToId;

            return (
              <div
                key={node.id}
                className={`pt-2 first:pt-0 rounded-xl p-2.5 transition-all border ${
                  isFrom
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : isTo
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-200/60 hover:border-slate-300 bg-white hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Category / Icon Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl ${badge.bg} text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5`}
                  >
                    {getNodeIcon(node.iconName, node.type, 'w-4 h-4 text-white')}
                  </div>

                  {/* Name and Information */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      // Selecting a location functions the same as selecting it from the dropdowns
                      if (targetSlot === 'from') {
                        onSelectFrom(node.id);
                      } else {
                        onSelectTo(node.id);
                      }
                      onOpenNodeInfo(node);
                    }}
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                        {node.name}
                      </h3>
                      {isFrom && (
                        <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.2 rounded-md">
                          FROM
                        </span>
                      )}
                      {isTo && (
                        <span className="text-[10px] font-extrabold bg-blue-600 text-white px-1.5 py-0.2 rounded-md">
                          TO
                        </span>
                      )}
                    </div>

                    {node.teluguName && (
                      <p className="text-[11px] text-slate-500 font-medium leading-tight">
                        {node.teluguName}
                      </p>
                    )}

                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                </div>

                {/* Quick Action Buttons for Toolbar Dropdowns and Details */}
                <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectFrom(node.id)}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                        isFrom
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                      title="Set as Starting Point"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      From
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectTo(node.id)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                        isTo
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                      title="Set as Destination"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                      To
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenNodeInfo(node)}
                    className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                    title="View Department Information & Hours"
                  >
                    <Info className="w-3 h-3 text-blue-600" />
                    <span>Info</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0 text-center">
        <p className="text-[11px] text-slate-500">
          MVGR College Ground-Truth Navigational Points
        </p>
      </div>
    </aside>
  );
};
