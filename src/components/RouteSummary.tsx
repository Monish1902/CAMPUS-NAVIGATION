import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Footprints,
  Navigation,
  Play,
  Square,
  X,
} from 'lucide-react';
import { RouteResult } from '../types';
import { getTypeBadgeColor } from '../utils/iconHelper';

interface RouteSummaryProps {
  route: RouteResult;
  onClearRoute: () => void;
  isSimulating: boolean;
  onStartSimulation: () => void;
  onStopSimulation: () => void;
  simulationProgress?: number; // 0 to 1
}

export const RouteSummary: React.FC<RouteSummaryProps> = ({
  route,
  onClearRoute,
  isSimulating,
  onStartSimulation,
  onStopSimulation,
  simulationProgress = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const caloriesBurned = Math.round(route.totalDistance * 0.05);

  if (isMinimized) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl p-2.5 flex items-center justify-between gap-3 max-w-xs w-full animate-in fade-in">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 text-left flex-1 min-w-0 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Navigation className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-slate-900 truncate">
              {route.totalDistance}m • ~{route.estimatedMinutes} min
            </div>
            <div className="text-[10px] text-blue-600 font-semibold truncate">
              Tap to expand route details
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onClearRoute}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Clear Route"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden transition-all max-w-sm w-full">
      {/* Header Bar */}
      <div className="p-3 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <Navigation className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="truncate">
            <div className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider">
              Walking Route
            </div>
            <div className="text-xs font-bold truncate flex items-center gap-1">
              <span className="truncate">{route.fromNode.name}</span>
              <ArrowRight className="w-3 h-3 shrink-0 opacity-70" />
              <span className="truncate">{route.toNode.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/15 rounded-lg transition-colors text-white"
            title="Minimize Route Card"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClearRoute}
            className="p-1 hover:bg-white/15 rounded-lg transition-colors text-white/80 hover:text-white"
            title="Clear Route"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/70 p-2 text-center">
        <div>
          <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-center gap-0.5">
            <Compass className="w-2.5 h-2.5 text-blue-500" />
            <span>Distance</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-0.5">
            {route.totalDistance} <span className="text-[10px] font-semibold text-slate-500">m</span>
          </div>
        </div>

        <div>
          <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-center gap-0.5">
            <Clock className="w-2.5 h-2.5 text-emerald-500" />
            <span>Walk Time</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-0.5">
            ~{route.estimatedMinutes} <span className="text-[10px] font-semibold text-slate-500">min</span>
          </div>
        </div>

        <div>
          <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-center gap-0.5">
            <Footprints className="w-2.5 h-2.5 text-indigo-500" />
            <span>Steps</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-0.5">
            ~{route.stepCount}
          </div>
        </div>
      </div>

      {/* Live Walk Simulation Progress Bar */}
      {isSimulating && (
        <div className="px-3 pt-2 pb-1.5 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between text-[11px] font-semibold text-blue-700 mb-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping inline-block" />
              Simulating Walk...
            </span>
            <span>{Math.round(simulationProgress * 100)}%</span>
          </div>
          <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-200"
              style={{ width: `${Math.min(100, Math.max(0, simulationProgress * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* Expandable Turn-by-Turn Steps */}
      {isExpanded && (
        <div className="p-3 space-y-2.5 max-h-48 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Milestones ({route.directions.length} steps)</span>
            <span className="font-normal text-slate-400">Traced Walkway</span>
          </div>

          <div className="relative pl-5 space-y-2.5 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-200">
            {route.directions.map((step, idx) => {
              const isStart = idx === 0;
              const isEnd = idx === route.directions.length - 1;

              return (
                <div key={idx} className="relative text-xs">
                  <span
                    className={`absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ring-2 ring-white ${
                      isStart
                        ? 'bg-emerald-600 text-white'
                        : isEnd
                        ? 'bg-rose-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div>
                    <p className={`font-medium ${isEnd ? 'text-rose-700 font-semibold' : 'text-slate-800'}`}>
                      {step.instruction}
                    </p>
                    {step.distance > 0 && (
                      <span className="text-[10px] text-slate-400">
                        {step.distance}m
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Action Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
        {!isSimulating ? (
          <button
            type="button"
            onClick={onStartSimulation}
            className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Start Walk Sim</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onStopSimulation}
            className="flex-1 py-1.5 px-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Square className="w-3 h-3 fill-white" />
            <span>Stop Sim</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs rounded-xl transition-colors shadow-2xs"
        >
          {isExpanded ? 'Hide Steps' : 'View Steps'}
        </button>
      </div>
    </div>
  );
};
