import React from 'react';
import { Compass, Info, Map as MapIcon, RotateCcw, Building2, ListOrdered } from 'lucide-react';

interface HeaderProps {
  onResetView: () => void;
  onOpenLegend: () => void;
  onOpenSatelliteInfo: () => void;
  onToggleDirectory?: () => void;
  isDirectoryOpen?: boolean;
  highContrast: boolean;
  onToggleContrast: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onResetView,
  onOpenLegend,
  onOpenSatelliteInfo,
  onToggleDirectory,
  isDirectoryOpen,
  highContrast,
  onToggleContrast,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 shadow-xs z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                MVGR Campus Navigator
              </h1>
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Ground Truth Traced
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Maharaj Vijayaram Gajapathi Raj College of Engineering (Autonomous), Vizianagaram
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {onToggleDirectory && (
            <button
              type="button"
              onClick={onToggleDirectory}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                isDirectoryOpen
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
              }`}
              title="Alphabetical List of Campus Locations"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Locations (A–Z)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenLegend}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="View Marker Legend"
          >
            <MapIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Legend</span>
          </button>

          <button
            type="button"
            onClick={onOpenSatelliteInfo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Satellite Ground Truth Details"
          >
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Satellite Truth</span>
          </button>

          <button
            type="button"
            onClick={onToggleContrast}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              highContrast
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Toggle Blueprint / Illustrated Theme"
          >
            <span>{highContrast ? 'Dark Blueprint' : 'Illustrated Map'}</span>
          </button>

          <button
            type="button"
            onClick={onResetView}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            title="Fit Full Campus View"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Reset View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
