'use client';

import Link from 'next/link';
import { Project } from '@/types';
import { ProjectStatusBadge } from '@/components/common/ProjectStatusBadge';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export function ProjectCard({
  project,
  onDelete,
  isDeleting = false,
}: ProjectCardProps) {
  const formattedDate = new Date(project.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/projects/${project.id}`}
              className="text-base font-semibold text-white hover:text-indigo-400 transition-colors truncate block"
            >
              {project.name}
            </Link>
            {project.repository_name && (
              <span className="inline-flex items-center text-xs text-slate-400 font-mono mt-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                <svg
                  className="w-3.5 h-3.5 mr-1 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                {project.repository_name}
              </span>
            )}
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        <p className="mt-3 text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span>Created {formattedDate}</span>

        <div className="flex items-center space-x-2">
          <Link
            href={`/projects/${project.id}`}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-md transition-colors"
          >
            Details
          </Link>
          <button
            onClick={() => onDelete(project.id)}
            disabled={isDeleting}
            className="px-2.5 py-1 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/40 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
