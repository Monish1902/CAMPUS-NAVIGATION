import React from 'react';
import {
  Bath,
  BookOpen,
  Building2,
  Cog,
  Compass,
  Cpu,
  Dribbble,
  FlaskConical,
  GraduationCap,
  Landmark,
  MapPin,
  Mic2,
  Navigation,
  Server,
  ShieldCheck,
  Trophy,
  UtensilsCrossed,
  Waves,
  Wrench,
} from 'lucide-react';
import { NodeType } from '../types';

export function getNodeIcon(iconName?: string, type?: NodeType, className = 'w-4 h-4'): React.ReactNode {
  switch (iconName) {
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Cog':
      return <Cog className={className} />;
    case 'Server':
      return <Server className={className} />;
    case 'FlaskConical':
      return <FlaskConical className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} />;
    case 'Bath':
      return <Bath className={className} />;
    case 'Waves':
      return <Waves className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Dribbble':
      return <Dribbble className={className} />;
    case 'Mic2':
      return <Mic2 className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    default:
      switch (type) {
        case 'department':
          return <GraduationCap className={className} />;
        case 'canteen':
          return <UtensilsCrossed className={className} />;
        case 'washroom':
          return <Bath className={className} />;
        case 'gate':
          return <ShieldCheck className={className} />;
        case 'landmark':
          return <Landmark className={className} />;
        default:
          return <MapPin className={className} />;
      }
  }
}

export function getTypeBadgeColor(type: NodeType): {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  hex: string;
} {
  switch (type) {
    case 'department':
      return {
        bg: 'bg-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-500',
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        badgeText: 'text-blue-700',
        hex: '#2563eb',
      };
    case 'canteen':
      return {
        bg: 'bg-amber-500',
        text: 'text-amber-600',
        border: 'border-amber-500',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        badgeText: 'text-amber-700',
        hex: '#f59e0b',
      };
    case 'washroom':
      return {
        bg: 'bg-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-500',
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
        badgeText: 'text-purple-700',
        hex: '#9333ea',
      };
    case 'gate':
      return {
        bg: 'bg-emerald-600',
        text: 'text-emerald-600',
        border: 'border-emerald-500',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badgeText: 'text-emerald-700',
        hex: '#059669',
      };
    case 'landmark':
      return {
        bg: 'bg-teal-600',
        text: 'text-teal-600',
        border: 'border-teal-500',
        badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
        badgeText: 'text-teal-700',
        hex: '#0d9488',
      };
    default:
      return {
        bg: 'bg-slate-600',
        text: 'text-slate-600',
        border: 'border-slate-400',
        badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
        badgeText: 'text-slate-700',
        hex: '#475569',
      };
  }
}
