'use client';

import React from 'react';
import { ProblemTable } from '../../components/problems/ProblemTable';
import { Trophy, Code, Flame, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthGuard } from '../../components/auth/AuthGuard';

export default function ProblemsPage() {
  const { problems, solvedProblems } = useApp();

  return (
    <AuthGuard>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero Header Banner */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-amber-50/70 via-orange-50/50 to-white dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-950 p-6 shadow-xl dark:shadow-2xl relative">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute right-32 -bottom-12 h-36 w-36 rounded-full bg-orange-500/15 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-amber-500/15 dark:bg-amber-500/10 border border-amber-600/30 dark:border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interview Readiness & Algorithm Mastery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Coding Problem Library
            </h1>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              Sharpen your algorithmic thinking with interactive problems, live sandboxed code execution, and multi-language support.
            </p>
          </div>

          {/* Quick Progress Cards */}
          <div className="flex items-center space-x-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/60 p-3.5 text-center min-w-[100px] shadow-sm">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Solved</p>
              <p className="mt-0.5 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {solvedProblems.size}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/60 p-3.5 text-center min-w-[100px] shadow-sm">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total</p>
              <p className="mt-0.5 text-xl font-bold text-gray-900 dark:text-white">
                {problems.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Table Component */}
      <ProblemTable />
      </div>
    </AuthGuard>
  );
}
