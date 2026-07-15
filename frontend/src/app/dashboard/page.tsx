'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Flame,
  CheckCircle2,
  AlertCircle,
  Clock,
  Cpu,
  TrendingUp,
  Award,
  Code2,
  Calendar,
  ArrowUpRight
} from 'lucide-react';

export default function DashboardPage() {
  const { user, solvedProblems, problems, submissions } = useApp();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Compute exact unique solved problems directly from solvedProblems and Accepted submissions
  const acceptedProblemIds = React.useMemo(() => {
    const ids = new Set<string>();
    Array.from(solvedProblems).forEach((id) => ids.add(id));
    submissions.forEach((s) => {
      if (s.status === 'Accepted' && s.problemId) {
        ids.add(s.problemId);
      }
    });
    return ids;
  }, [solvedProblems, submissions]);

  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 space-y-8 animate-pulse">
        <div className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800/60" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 h-80 rounded-2xl bg-gray-200 dark:bg-gray-800/60" />
          <div className="lg:col-span-5 h-80 rounded-2xl bg-gray-200 dark:bg-gray-800/60" />
        </div>
      </div>
    );
  }

  const totalEasy = problems.filter((p) => p.difficulty === 'Easy').length || 1;
  const totalMedium = problems.filter((p) => p.difficulty === 'Medium').length || 1;
  const totalHard = problems.filter((p) => p.difficulty === 'Hard').length || 1;

  const solvedEasy = problems.filter((p) => (acceptedProblemIds.has(p.id) || acceptedProblemIds.has(p.slug)) && p.difficulty === 'Easy').length;
  const solvedMedium = problems.filter((p) => (acceptedProblemIds.has(p.id) || acceptedProblemIds.has(p.slug)) && p.difficulty === 'Medium').length;
  const solvedHard = problems.filter((p) => (acceptedProblemIds.has(p.id) || acceptedProblemIds.has(p.slug)) && p.difficulty === 'Hard').length;
  const totalSolved = acceptedProblemIds.size;

  const easyPercent = Math.min(100, Math.round((solvedEasy / totalEasy) * 100));
  const medPercent = Math.min(100, Math.round((solvedMedium / totalMedium) * 100));
  const hardPercent = Math.min(100, Math.round((solvedHard / totalHard) * 100));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Profile Header Card */}
      {/* Profile Header Card */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-950 p-6 shadow-sm dark:shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-2xl font-black text-gray-950 shadow-lg shadow-orange-500/20">
              {user?.displayName?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {user?.displayName || 'Developer Profile'}
                </h1>
                {user?.role === 'admin' && (
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300 capitalize">
                    admin
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {user?.email || 'user@codearena.dev'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Streak Badge */}
            <div className="flex items-center space-x-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-2.5">
              <Flame className="h-5 w-5 text-orange-500 dark:text-orange-400 fill-orange-500/20 animate-pulse" />
              <div>
                <p className="text-[11px] font-semibold uppercase text-orange-700 dark:text-orange-300">
                  Current Streak
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {user?.streak || 7} Days
                </p>
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="flex items-center space-x-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-[11px] font-semibold uppercase text-emerald-700 dark:text-emerald-300">
                  Acceptance Rate
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {user?.acceptanceRate || 68.4}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Solved Breakdown & Badges */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Card: Problems Solved Breakdown (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 space-y-6 shadow-sm dark:shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Problems Solved</h2>
            <Link
              href="/problems"
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1"
            >
              <span>Practice More</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Solved Summary Count */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
            <div>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {totalSolved}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Total problems completed successfully
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Trophy className="h-7 w-7" />
            </div>
          </div>

          {/* Easy / Medium / Hard Progress Bars */}
          <div className="space-y-4">
            {/* Easy */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-teal-600 dark:text-emerald-400">Easy</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {solvedEasy} / {totalEasy}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-teal-500 dark:bg-emerald-500 transition-all duration-500"
                  style={{ width: `${easyPercent}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-amber-600 dark:text-amber-400">Medium</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {solvedMedium} / {totalMedium}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${medPercent}%` }}
                />
              </div>
            </div>

            {/* Hard */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-rose-600 dark:text-rose-400">Hard</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {solvedHard} / {totalHard}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${hardPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Earned Badges & Achievements (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 space-y-4 shadow-sm dark:shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Earned Badges
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-center space-x-3">
                <Award className="h-7 w-7 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Algorithm Pioneer</p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-200/70">Completed 10+ algorithms</p>
                </div>
              </div>

              <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-3.5 flex items-center space-x-3">
                <Flame className="h-7 w-7 text-orange-500 dark:text-orange-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">7 Day Streak</p>
                  <p className="text-[11px] text-orange-700 dark:text-orange-200/70">Consistent daily practice</p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center space-x-3">
                <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">First Blood</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-200/70">Solved Two Sum in 1st try</p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 flex items-center space-x-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Polyglot</p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-200/70">Submitted in 3 languages</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 p-3.5 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Next Badge: Dynamic Programming Master</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">80%</span>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 shadow-sm dark:shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Submissions</h2>
        {submissions.length === 0 ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No recent submissions yet. Start solving problems to build your history!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
              <thead className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Runtime</th>
                  <th className="py-3 px-4">Memory</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {submissions.slice(0, 10).map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">
                      <Link
                        href={`/problems/${sub.problemId}`}
                        className="hover:text-amber-600 dark:hover:text-amber-400 transition"
                      >
                        {sub.problemTitle}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      {sub.status === 'Accepted' ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Accepted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-rose-600 dark:text-rose-400 font-bold">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{sub.status}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 uppercase font-mono">{sub.language}</td>
                    <td className="py-3.5 px-4 font-mono">{sub.runtimeMs} ms</td>
                    <td className="py-3.5 px-4 font-mono">{sub.memoryMB} MB</td>
                    <td className="py-3.5 px-4 text-right text-gray-500 dark:text-gray-400">
                      {new Date(sub.createdAt).toLocaleDateString()}{' '}
                      {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
