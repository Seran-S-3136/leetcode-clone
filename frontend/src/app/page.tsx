'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Terminal,
  Cpu,
  Zap,
  Award,
  ArrowRight,
  CheckCircle2,
  Layers,
  Flame,
  ShieldCheck,
  Play
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Background ambient glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        {/* Top Announcement Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-lg shadow-amber-500/5">
            <Flame className="h-4 w-4 text-orange-500 dark:text-orange-400 animate-pulse" />
            <span>Next-Gen Algorithm Interview Studio & Sandboxed Sandbox</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
            Master Competitive Coding With{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 bg-clip-text text-transparent">
              Real-Time Sandboxed Judging
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Experience an authentic LeetCode workflow with Monaco Code Editor, multi-language execution via the Piston API, line-precise compiler & runtime error diagnostics, and a docked testcase debugger.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/problems"
              className="flex items-center space-x-2 rounded-xl bg-amber-500 px-7 py-3.5 text-sm font-extrabold text-gray-950 hover:bg-amber-400 transition shadow-xl shadow-amber-500/20"
            >
              <Play className="h-4 w-4 fill-gray-950" />
              <span>Explore Problem Library</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/admin"
              className="flex items-center space-x-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3.5 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition shadow-sm"
            >
              <Layers className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Admin Studio & Creator</span>
            </Link>
          </div>
        </div>

        {/* Live Metrics Showcase */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-5 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">7+</div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">Languages Supported</div>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-5 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">&lt; 80ms</div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">Evaluation Latency</div>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-5 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">100%</div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">Sandboxed Isolation</div>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-5 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">Public + Hidden</div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">Testcase Engine</div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 space-y-3 hover:border-gray-300 dark:hover:border-gray-700 transition shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              <Terminal className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Docked Integrated Terminal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Test multi-case inputs instantly. Inspect pass/fail diffs, runtime duration (ms), memory footprint (MB), and standard console output without page reloads.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 space-y-3 hover:border-gray-300 dark:hover:border-gray-700 transition shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Line-Precise Diagnostic Errors</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Real compiler and runtime traces detailing SyntaxError, Compilation Error, TLE, MLE, and Runtime Exception line numbers just like authentic LeetCode judging.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 space-y-3 hover:border-gray-300 dark:hover:border-gray-700 transition shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Firebase Sync & Admin Creator</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Extract problems via URL import or design custom algorithms with multi-language starter code and hidden test cases persisted securely in cloud Firestore.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
