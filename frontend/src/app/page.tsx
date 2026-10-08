import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span>Phase 1 — Core Foundation & REST Architecture</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          AI Software Engineering{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">
            Assistant
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
          A production-style developer platform designed to understand and analyze complex codebases.
          Upload software repositories, index source code, and use grounded AI for architecture investigation.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            Open Dashboard
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 rounded-lg text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:scale-[1.02]"
          >
            Manage Projects
          </Link>
        </div>

        {/* Architecture Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/60 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white">Full-Stack Separation</h3>
            <p className="mt-2 text-sm text-slate-400">
              Next.js 16 App Router on frontend, decoupled from a robust Laravel 11 REST API engine with clean Service layers.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-violet-950 text-violet-400 border border-violet-800/60 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white">PostgreSQL Foundation</h3>
            <p className="mt-2 text-sm text-slate-400">
              Structured database schema with Project status lifecycles, prepared for high-performance pgvector integration.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white">Production Quality</h3>
            <p className="mt-2 text-sm text-slate-400">
              Strict Form Request validation, API Resources, typed fetch clients, and comprehensive automated test suites.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        AI Software Engineering Assistant · Phase 1 Foundation
      </footer>
    </div>
  );
}
