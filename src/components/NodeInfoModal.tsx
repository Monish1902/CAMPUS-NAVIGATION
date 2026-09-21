import React from 'react';
import {
  X,
  Clock,
  Mail,
  Phone,
  UserCheck,
  Building2,
  Navigation,
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Accessibility,
} from 'lucide-react';
import { CampusNode } from '../types';
import { getNodeIcon, getTypeBadgeColor } from '../utils/iconHelper';

interface NodeInfoModalProps {
  node: CampusNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAsFrom: (id: string) => void;
  onSelectAsTo: (id: string) => void;
  onFocusOnMap?: (node: CampusNode) => void;
}

export const NodeInfoModal: React.FC<NodeInfoModalProps> = ({
  node,
  isOpen,
  onClose,
  onSelectAsFrom,
  onSelectAsTo,
  onFocusOnMap,
}) => {
  if (!isOpen || !node) return null;

  const badge = getTypeBadgeColor(node.type);
  const details = node.details;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="node-info-title"
      >
        {/* Top Header Banner */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3.5 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shrink-0 shadow-inner">
              {getNodeIcon(node.iconName, node.type, 'w-6 h-6 text-white')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {node.type}
                </span>
                {node.isEstimated && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-400/30">
                    Estimated Landmark
                  </span>
                )}
              </div>
              <h3 id="node-info-title" className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                {node.name}
              </h3>
              {node.teluguName && (
                <p className="text-xs sm:text-sm text-blue-200 font-medium mt-0.5">{node.teluguName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Information Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          {/* Official Full Name */}
          {details?.fullName && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Official Department / Facility Title
              </div>
              <div className="font-semibold text-slate-900 leading-snug">{details.fullName}</div>
            </div>
          )}

          {/* Primary Function */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Primary Function & Scope
            </h4>
            <p className="text-slate-700 leading-relaxed text-sm bg-blue-50/40 p-3 rounded-xl border border-blue-100">
              {details?.primaryFunction || node.description || 'Information to be added.'}
            </p>
          </div>

          {/* Operating Hours & Head/In-charge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Operating Hours */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Operating Hours</span>
              </div>
              {details?.operatingHours ? (
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                  {details.operatingHours}
                </p>
              ) : (
                <p className="text-xs italic text-slate-400">
                  Hours to be added / Pending official college schedule
                </p>
              )}
            </div>

            {/* In-Charge / Head */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Department Head / Contact Officer</span>
              </div>
              {details?.headOrInCharge ? (
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                  {details.headOrInCharge}
                </p>
              ) : (
                <p className="text-xs italic text-slate-400">
                  Officer details to be added
                </p>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact & Direct Inquiries
            </h4>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {details?.contactPhone ? (
                  <a
                    href={`tel:${details.contactPhone.replace(/[^0-9+]/g, '')}`}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {details.contactPhone}
                  </a>
                ) : (
                  <span className="italic text-slate-400">Phone to be added</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {details?.contactEmail ? (
                  <a
                    href={`mailto:${details.contactEmail}`}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
                  >
                    {details.contactEmail}
                  </a>
                ) : (
                  <span className="italic text-slate-400">Email to be added</span>
                )}
              </div>
            </div>
          </div>

          {/* Facilities & Key Laboratories */}
          {details?.facilities && details.facilities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Key Facilities & Special Equipment
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {details.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-800 border border-slate-200/80"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Campus Location & Accessibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {details?.locationWing && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                <div className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] mb-0.5">
                  Campus Location & Wing
                </div>
                <div className="text-slate-800">{details.locationWing}</div>
              </div>
            )}

            {details?.accessibility && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                <div className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] mb-0.5 flex items-center gap-1">
                  <Accessibility className="w-3 h-3 text-blue-600" />
                  Accessibility & Pathways
                </div>
                <div className="text-slate-800">{details.accessibility}</div>
              </div>
            )}
          </div>

          {/* Notes */}
          {details?.notes && (
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Important Notice: </span>
                {details.notes}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {onFocusOnMap && (
            <button
              type="button"
              onClick={() => {
                onFocusOnMap(node);
                onClose();
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 border border-slate-300"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Focus on Map
            </button>
          )}

          <div className="flex items-center gap-2 flex-1 sm:justify-end">
            <button
              type="button"
              onClick={() => {
                onSelectAsFrom(node.id);
                onClose();
              }}
              className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 rotate-45" />
              Start From Here
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectAsTo(node.id);
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              Navigate To Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
