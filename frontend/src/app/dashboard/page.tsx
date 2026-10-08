'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { api } from '@/lib/api';
import { HealthStatus, Project } from '@/types';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [healthData, projectsData] = await Promise.allSettled([
        api.getHealth(),
        api.getProjects(),
      ]);

      if (healthData.status === 'fulfilled') {
        setHealth(healthData.value);
      } else {
        setHealth(null);
      }

      if (projectsData.status === 'fulfilled') {
        setProjects(projectsData.value);
      } else {
        setError('Failed to fetch projects. Please ensure the backend API is running.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [healthData, projectsData] = await Promise.allSettled([
          api.getHealth(),
          api.getProjects(),
        ]);

        if (isMounted) {
          if (healthData.status === 'fulfilled') {
            setHealth(healthData.value);
          } else {
            setHealth(null);
          }

          if (projectsData.status === 'fulfilled') {
            setProjects(projectsData.value);
            setError(null);
          } else {
            setError('Failed to fetch projects. Please ensure the backend API is running.');
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError('Failed to load data.');
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      setDeletingId(id);
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setDeletingId(null);
    }
  };

  const readyCount = projects.filter((p) => p.status === 'ready').length;
  const processingCount = projects.filter((p) => p.status === 'processing').length;
  const pendingCount = projects.filter((p) => p.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar onCreateProjectClick={() => setIsModalOpen(true)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                CodeMind Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Overview of repository projects and backend infrastructure status
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchDashboardData}
                className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Project</span>
              </button>
            </div>
          </div>

          {/* Backend Status Card (Step 5 Requirement) */}
          <div className="mt-6 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    health?.status === 'ok' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <h2 className="text-sm font-semibold text-white">Backend Health Endpoint Status</h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                GET /api/health
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                <span className="text-slate-500 block">API Status</span>
                <span className="text-white font-medium mt-1 block">
                  {health ? health.message : 'Backend unreachable or starting...'}
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                <span className="text-slate-500 block">Database Connection</span>
                <span className="text-white font-medium mt-1 block capitalize">
                  {health?.database || 'Not verified'}
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                <span className="text-slate-500 block">Last Ping</span>
                <span className="text-white font-medium mt-1 block font-mono">
                  {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400">Total Projects</span>
              <p className="text-2xl font-bold text-white mt-1">{projects.length}</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-emerald-400">Ready</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{readyCount}</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-amber-400">Processing</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{processingCount}</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400">Pending</span>
              <p className="text-2xl font-bold text-slate-300 mt-1">{pendingCount}</p>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
              <Link
                href="/projects"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View all projects →
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 bg-slate-900/40 border border-slate-800 rounded-xl">
                <svg className="w-6 h-6 animate-spin mx-auto text-indigo-500 mb-2" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-sm">Loading projects from API...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-rose-950/20 border border-rose-800/40 rounded-xl">
                <p className="text-sm text-rose-300 mb-3">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            ) : projects.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white">No projects yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Create your first project to start organizing codebases for analysis.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.slice(0, 6).map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={handleDeleteProject}
                    isDeleting={deletingId === project.id}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
