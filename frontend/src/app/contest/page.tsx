'use client';

import React from 'react';
import { Trophy, Clock, Sparkles, Award } from 'lucide-react';
import { AuthGuard } from '../../components/auth/AuthGuard';

export default function ContestPage() {
  return (
    <AuthGuard>
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        {/* Contest Header Banner matching Screenshot 3 */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gradient-to-b from-amber-50/60 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 p-10 text-center shadow-xl dark:shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 border border-emerald-500/30 dark:border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Luck += 10</span>
          </div>

          <div className="mx-auto mt-6 mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-gray-950 shadow-2xl shadow-orange-500/30">
            <Trophy className="h-12 w-12 stroke-[2]" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            CodeArena Contest
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Contest every week. Compete and see your ranking!
          </p>
        </div>

        {/* Weekly & Biweekly Contest Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative overflow-hidden rounded-3xl border border-amber-300 dark:border-amber-500/30 bg-gradient-to-br from-amber-50/80 via-white to-white dark:from-amber-500/20 dark:via-gray-900 dark:to-gray-950 p-8 shadow-md dark:shadow-xl transition hover:border-amber-400 dark:hover:border-amber-500/50">
            <div className="flex items-center justify-between mb-16">
              <span className="rounded-full bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
                Weekly Contest 511
              </span>
              <div className="flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-300 font-mono">
                <Clock className="h-4 w-4" />
                <span>Starts Sun, 08:00 GMT+05:30</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Contest 511</h2>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Compete globally with top algorithm developers and earn limited edition badges.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-indigo-300 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50/80 via-white to-white dark:from-indigo-500/20 dark:via-gray-900 dark:to-gray-950 p-8 shadow-md dark:shadow-xl transition hover:border-indigo-400 dark:hover:border-indigo-500/50">
            <div className="flex items-center justify-between mb-16">
              <span className="rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
                Biweekly Contest 187
              </span>
              <div className="flex items-center space-x-1 text-xs text-indigo-600 dark:text-indigo-300 font-mono">
                <Clock className="h-4 w-4" />
                <span>Starts Sat, 20:00 GMT+05:30</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Biweekly Contest 187</h2>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Fast-paced 90-minute coding challenge with 4 algorithmic problems.
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
