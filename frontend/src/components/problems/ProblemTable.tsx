'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Problem, Difficulty } from '../../../../shared/types';
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  ArrowUpDown,
  Building2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ProblemTable: React.FC = () => {
  const { problems, solvedProblems } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Unsolved'>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'title' | 'difficulty' | 'acceptance'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Collect all unique tags and companies
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    problems.forEach((p: Problem) => (p.tags || []).forEach((t: string) => tagsSet.add(t)));
    return ['All', ...Array.from(tagsSet)];
  }, [problems]);

  const allCompanies = useMemo(() => {
    const compSet = new Set<string>();
    problems.forEach((p: Problem) => (p.companyTags || []).forEach((c: string) => compSet.add(c)));
    return ['All', ...Array.from(compSet)];
  }, [problems]);

  // Filtered and sorted problems
  const filteredProblems = useMemo(() => {
    return problems
      .filter((p: Problem) => {
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.tags || []).some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesDifficulty =
          difficultyFilter === 'All' || p.difficulty === difficultyFilter;
        const isSolved = solvedProblems.has(p.id) || solvedProblems.has(p.slug);
        const matchesStatus =
          statusFilter === 'All' ||
          (statusFilter === 'Solved' && isSolved) ||
          (statusFilter === 'Unsolved' && !isSolved);
        const matchesTag =
          selectedTag === 'All' || (Array.isArray(p.tags) && p.tags.includes(selectedTag));
        const matchesCompany =
          selectedCompany === 'All' || (Array.isArray(p.companyTags) && p.companyTags.includes(selectedCompany));

        return (
          matchesSearch &&
          matchesDifficulty &&
          matchesStatus &&
          matchesTag &&
          matchesCompany
        );
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          const numA = parseInt((a.title.match(/^(\d+)\./) || [])[1] || a.title, 10);
          const numB = parseInt((b.title.match(/^(\d+)\./) || [])[1] || b.title, 10);
          if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
            return sortOrder === 'asc' ? numA - numB : numB - numA;
          }
          return sortOrder === 'asc'
            ? a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' })
            : b.title.localeCompare(a.title, undefined, { numeric: true, sensitivity: 'base' });
        }
        if (sortBy === 'acceptance') {
          return sortOrder === 'asc'
            ? a.acceptanceRate - b.acceptanceRate
            : b.acceptanceRate - a.acceptanceRate;
        }
        if (sortBy === 'difficulty') {
          const order: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
          return sortOrder === 'asc'
            ? (order[a.difficulty] || 2) - (order[b.difficulty] || 2)
            : (order[b.difficulty] || 2) - (order[a.difficulty] || 2);
        }
        return 0;
      });
  }, [
    problems,
    searchQuery,
    difficultyFilter,
    statusFilter,
    selectedTag,
    selectedCompany,
    solvedProblems,
    sortBy,
    sortOrder,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage) || 1;
  const currentProblems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(start, start + itemsPerPage);
  }, [filteredProblems, currentPage]);

  const toggleSort = (field: 'title' | 'difficulty' | 'acceptance') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return (
          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
            Easy
          </span>
        );
      case 'Medium':
        return (
          <span className="text-xs font-semibold text-amber-500 dark:text-amber-400">
            Med.
          </span>
        );
      case 'Hard':
        return (
          <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">
            Hard
          </span>
        );
    }
  };

  // Quick popular tags for authentic LeetCode Topic Tags row
  const popularTags = [
    { name: 'Array', count: 2197 },
    { name: 'String', count: 880 },
    { name: 'Hash Table', count: 825 },
    { name: 'Dynamic Programming', count: 666 },
    { name: 'Sorting', count: 527 },
    { name: 'Greedy', count: 470 },
  ];

  const categoryPills = [
    { label: 'All Topics', tag: 'All' },
    { label: 'Algorithms', tag: 'Array' },
    { label: 'Database', tag: 'Hash Table' },
    { label: 'Shell', tag: 'String' },
    { label: 'Concurrency', tag: 'Dynamic Programming' },
  ];

  return (
    <div className="space-y-6">
      {/* Authentic LeetCode Topic Tags & Categories Section */}
      <div className="space-y-3">
        {/* Topic quick counts row */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {popularTags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => {
                setSelectedTag(selectedTag === tag.name ? 'All' : tag.name);
                setCurrentPage(1);
              }}
              className="group flex items-center space-x-1.5 transition"
            >
              <span
                className={`font-semibold ${
                  selectedTag === tag.name
                    ? 'text-amber-500 font-bold'
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-amber-500'
                }`}
              >
                {tag.name}
              </span>
            </button>
          ))}
        </div>

        {/* Category rounded pills row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categoryPills.map((pill) => {
            const isSelected = selectedTag === pill.tag || (pill.tag === 'All' && selectedTag === 'All');
            return (
              <button
                key={pill.label}
                onClick={() => {
                  setSelectedTag(pill.tag);
                  setCurrentPage(1);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                    : 'bg-gray-100/90 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-full border border-gray-200 dark:border-gray-800 bg-gray-100/80 dark:bg-gray-800/60 py-2 pl-9 pr-4 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="rounded-full border border-gray-200 dark:border-gray-800 bg-gray-100/80 dark:bg-gray-800/60 px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 focus:border-amber-500 focus:outline-none transition cursor-pointer"
          >
            <option value="All">Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="rounded-full border border-gray-200 dark:border-gray-800 bg-gray-100/80 dark:bg-gray-800/60 px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 focus:border-amber-500 focus:outline-none transition cursor-pointer"
          >
            <option value="All">Status</option>
            <option value="Solved">Solved</option>
            <option value="Unsolved">Unsolved</option>
          </select>

          {/* Topic Tags Filter */}
          <select
            value={selectedTag}
            onChange={(e) => {
              setSelectedTag(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-full border border-gray-200 dark:border-gray-800 bg-gray-100/80 dark:bg-gray-800/60 px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 focus:border-amber-500 focus:outline-none transition cursor-pointer max-w-[130px]"
          >
            <option value="All">Tags</option>
            {allTags.filter((t: string) => t !== 'All').map((tag: string) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Right side Solved Progress Counter */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span className="flex h-3 w-3 rounded-full border-2 border-emerald-500" />
          <span>
            <strong className="text-gray-900 dark:text-white font-bold">{solvedProblems.size}</strong>/{problems.length} Solved
          </span>
        </div>
      </div>

      {/* Authentic LeetCode Problem List Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800/80 bg-white dark:bg-gray-950 shadow-sm">
        <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
          <thead className="border-b border-gray-200 dark:border-gray-800/80 bg-gray-50/80 dark:bg-gray-900/40 text-xs text-gray-600 dark:text-gray-400 font-semibold">
            <tr>
              <th className="py-3.5 pl-6 pr-3 w-16">Status</th>
              <th
                className="py-3.5 px-3 cursor-pointer hover:text-gray-900 dark:hover:text-white transition"
                onClick={() => toggleSort('title')}
              >
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
                </div>
              </th>
              <th
                className="py-3.5 px-3 cursor-pointer hover:text-gray-900 dark:hover:text-white transition w-32"
                onClick={() => toggleSort('difficulty')}
              >
                <div className="flex items-center space-x-1">
                  <span>Difficulty</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
                </div>
              </th>
              <th
                className="py-3.5 px-3 cursor-pointer hover:text-gray-900 dark:hover:text-white transition w-36"
                onClick={() => toggleSort('acceptance')}
              >
                <div className="flex items-center space-x-1">
                  <span>Acceptance</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
                </div>
              </th>
              <th className="py-3.5 px-3 hidden lg:table-cell">Tags & Topics</th>
              <th className="py-3.5 pr-6 text-right w-28">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800/60">
            {currentProblems.map((problem) => {
              const isSolved = solvedProblems.has(problem.id) || solvedProblems.has(problem.slug);
              return (
                <tr
                  key={problem.id}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors duration-150"
                >
                  {/* Status Checkmark */}
                  <td className="py-4 pl-6 pr-3">
                    {isSolved ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                    )}
                  </td>

                  {/* Problem Title */}
                  <td className="py-4 px-3 font-bold text-gray-900 dark:text-white">
                    <Link
                      href={`/problems/${problem.slug}`}
                      className="group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center space-x-2"
                    >
                      <span>{problem.title}</span>
                    </Link>
                  </td>

                  {/* Difficulty */}
                  <td className="py-4 px-3">
                    {getDifficultyBadge(problem.difficulty)}
                  </td>

                  {/* Acceptance Rate */}
                  <td className="py-4 px-3 font-medium text-gray-700 dark:text-gray-300">
                    {problem.acceptanceRate}%
                  </td>

                  {/* Tags */}
                  <td className="py-4 px-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1.5">
                      {(problem.tags || []).slice(0, 3).map((t: string) => (
                        <span
                          key={t}
                          className="rounded-md bg-gray-100 dark:bg-gray-800/80 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700/50 shadow-2xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Action Link */}
                  <td className="py-4 pr-6 text-right">
                    <Link
                      href={`/problems/${problem.slug}`}
                      className="inline-flex items-center space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 px-3.5 py-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 group-hover:bg-amber-500 group-hover:text-gray-950 group-hover:border-amber-500 transition-all shadow-sm"
                    >
                      <span>Solve</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
            {currentProblems.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  No problems match your selected search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Showing <span className="font-bold text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-bold text-gray-900 dark:text-white">
            {Math.min(currentPage * itemsPerPage, filteredProblems.length)}
          </span>{' '}
          of <span className="font-bold text-gray-900 dark:text-white">{filteredProblems.length}</span> problems
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-gray-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-2xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-gray-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-2xs"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
