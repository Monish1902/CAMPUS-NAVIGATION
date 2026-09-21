import React from 'react';
import {
  Bath,
  Compass,
  Cpu,
  GraduationCap,
  Landmark,
  MapPin,
  Route,
  ShieldCheck,
  UtensilsCrossed,
  Waves,
  X,
} from 'lucide-react';
import { getTypeBadgeColor } from '../utils/iconHelper';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  showNetworkGrid: boolean;
  onToggleNetworkGrid: () => void;
}

export const LegendModal: React.FC<LegendModalProps> = ({
  isOpen,
  onClose,
  showNetworkGrid,
  onToggleNetworkGrid,
}) => {
  if (!isOpen) return null;

  const categories = [
    {
      type: 'department' as const,
      label: 'Academic Departments & Labs',
      description: 'ECE, Mechanical, IT, Chemistry Lab, Workshop Lab, Admin Block & Library',
      icon: <GraduationCap className="w-4 h-4 text-white" />,
    },
    {
      type: 'canteen' as const,
      label: 'Canteen & Dining Area',
      description: 'Central campus cafeteria and shaded outdoor dining courtyard (estimated location)',
      icon: <UtensilsCrossed className="w-4 h-4 text-white" />,
    },
    {
      type: 'washroom' as const,
      label: 'Campus Restrooms & Sanitation',
      description: 'Departmental washrooms (ECE, Mech, IT/Chem), Admin wing, Sports & Canteen',
      icon: <Bath className="w-4 h-4 text-white" />,
    },
    {
      type: 'gate' as const,
      label: 'Campus Main Gate & Entrance',
      description: 'Primary entrance gate on Highway (NH) with security post and vehicular arch',
      icon: <ShieldCheck className="w-4 h-4 text-white" />,
    },
    {
      type: 'landmark' as const,
      label: 'Landmarks & Grounds',
      description: 'Campus Pond (పాండ్), Cricket Oval, Basketball Courts & Open Air Auditorium',
      icon: <Landmark className="w-4 h-4 text-white" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Campus Map Legend</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2.5">
            {categories.map((cat) => {
              const badge = getTypeBadgeColor(cat.type);
              return (
                <div
                  key={cat.type}
                  className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${badge.bg} text-white shadow-xs`}
                  >
                    {cat.icon}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{cat.label}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Graph Network Toggle */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-blue-950">Show Path Graph & Junctions</div>
                <div className="text-[10px] text-blue-700">Display all underlying nodes & weighted edges</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleNetworkGrid}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                showNetworkGrid
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {showNetworkGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 text-xs leading-relaxed space-y-1">
            <p className="font-semibold text-slate-800">Ground-Truth Navigation Model:</p>
            <p className="text-[11px]">
              Routes are calculated via Dijkstra&apos;s shortest path algorithm over the authentic paved campus walkways.
              Path curves faithfully trace the blue trail around the cricket ground rather than cutting across lawns.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
