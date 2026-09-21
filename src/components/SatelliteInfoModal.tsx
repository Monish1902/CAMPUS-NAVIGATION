import React from 'react';
import { CheckCircle2, Compass, Layers, MapPin, Sparkles, X } from 'lucide-react';

interface SatelliteInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SatelliteInfoModal: React.FC<SatelliteInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-white text-base">Google Satellite Map Ground Truth</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-blue-100 hover:text-white hover:bg-white/15 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto text-xs text-slate-600 leading-relaxed">
          <div className="bg-blue-50 border border-blue-200/80 p-3.5 rounded-xl">
            <h4 className="font-bold text-blue-950 text-xs mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Exact Visuals &amp; Labels Matching Ground Truth</span>
            </h4>
            <p className="text-blue-900 text-[11px]">
              Every department footprint, rooftop solar panel array, courtyard, and labeled annotation has been verified against the Google Satellite images for MVGR College of Engineering.
            </p>
          </div>

          {/* Labeled Blocks Checklist */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
            <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Verified Campus Blocks &amp; Departments
            </h5>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="font-semibold truncate">Data Enginnering block</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="font-semibold truncate">MECHANICAL Dept (Mech)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="font-semibold truncate">Workshop Labortary</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="font-semibold truncate">ECE Department</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="font-semibold truncate">CSE BLOCK</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="font-semibold truncate">Chemistry Labortary</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="font-semibold truncate">IT Department</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span className="font-semibold truncate">CANTEEN</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="font-semibold truncate">CIVIL, EEE, CHEM block</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="font-semibold truncate">CENTRAL LIBRAY</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-blue-800 shrink-0" />
                <span className="font-semibold truncate">ADMIN BLOCK</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-semibold truncate">MVGR Main Gate</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                <span className="font-semibold truncate">Umamaheswara Temple</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-cyan-600 shrink-0" />
                <span className="font-semibold truncate">Pond (పాండ్)</span>
              </div>
            </div>
          </div>

          {/* Blue Path details */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-1.5">
            <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              Blue Dotted Trail Routing
            </h5>
            <p className="text-[11px] text-slate-600">
              The blue dashed trail connecting the Main Gate around the western perimeter curve of the cricket oval towards the academic core is mapped faithfully as walkable path segments in the navigation graph.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
