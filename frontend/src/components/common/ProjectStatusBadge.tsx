import { ProjectStatus } from '@/types';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  switch (status) {
    case 'ready':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400" />
          Ready
        </span>
      );
    case 'processing':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/70 text-amber-400 border border-amber-800/60">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-400 animate-pulse" />
          Processing
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-950/70 text-rose-400 border border-rose-800/60">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-400" />
          Failed
        </span>
      );
    case 'pending':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-slate-400" />
          Pending
        </span>
      );
  }
}
