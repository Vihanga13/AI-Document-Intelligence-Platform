'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProjectStatusBadge } from '@/components/common/ProjectStatusBadge';
import { api } from '@/lib/api';
import { Project, ProjectStatus } from '@/types';

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const projectId = Number(id);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProject(projectId);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Project not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    if (!project) return;
    try {
      setIsUpdating(true);
      const updated = await api.updateProject(project.id, {
        status: newStatus,
      });
      setProject(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    if (!confirm(`Are you sure you want to delete "${project.name}"?`)) return;

    try {
      setIsDeleting(true);
      await api.deleteProject(project.id);
      router.push('/projects');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete project');
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
            <Link href="/projects" className="hover:text-white transition-colors">
              Projects
            </Link>
            <span>/</span>
            <span className="text-white font-medium truncate">
              {project ? project.name : `Project #${id}`}
            </span>
          </nav>

          {loading ? (
            <div className="p-16 text-center text-slate-500 bg-slate-900/30 border border-slate-800 rounded-xl">
              <svg className="w-6 h-6 animate-spin mx-auto text-indigo-500 mb-2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm">Loading project details...</p>
            </div>
          ) : error || !project ? (
            <div className="p-8 text-center bg-rose-950/20 border border-rose-800/40 rounded-xl">
              <p className="text-sm text-rose-300 mb-3">{error || 'Project not found'}</p>
              <Link
                href="/projects"
                className="inline-flex px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                Return to Projects
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                  {project.repository_name && (
                    <p className="text-xs text-slate-400 font-mono mt-1 flex items-center space-x-1.5">
                      <span>Repository:</span>
                      <span className="text-indigo-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {project.repository_name}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3.5 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/40 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Project'}
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* Description */}
                  <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h2 className="text-sm font-semibold text-white mb-2">Description</h2>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {project.description || 'No description provided for this project.'}
                    </p>
                  </div>

                  {/* Future Phase Preparation */}
                  <div className="p-6 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
                    <div className="flex items-center space-x-2 text-indigo-400 mb-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-sm font-semibold text-white">Repository Ingestion & AI Analysis</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Source code ZIP upload, syntax parsing, pgvector embeddings, and RAG Q&A will be enabled in subsequent development phases.
                    </p>
                  </div>
                </div>

                {/* Metadata Sidebar */}
                <div className="space-y-6">
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4 text-xs">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Project Metadata
                    </h3>

                    <div>
                      <span className="text-slate-500 block">Project ID</span>
                      <span className="text-slate-200 font-mono block mt-0.5">#{project.id}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Created</span>
                      <span className="text-slate-200 block mt-0.5">
                        {new Date(project.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Last Updated</span>
                      <span className="text-slate-200 block mt-0.5">
                        {new Date(project.updated_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      <span className="text-slate-500 block mb-2">Change Status</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(['pending', 'processing', 'ready', 'failed'] as ProjectStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(st)}
                            disabled={isUpdating || project.status === st}
                            className={`px-2 py-1 text-[11px] font-medium rounded capitalize transition-colors cursor-pointer ${
                              project.status === st
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
