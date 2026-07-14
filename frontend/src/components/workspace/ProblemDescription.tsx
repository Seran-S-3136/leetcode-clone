'use client';

import React, { useState } from 'react';
import { Problem, Difficulty, Submission } from '../../../../shared/types';
import {
  FileText,
  BookOpen,
  History,
  CheckCircle2,
  AlertCircle,
  Clock,
  Cpu,
  Tag,
  Building2,
  Lightbulb
} from 'lucide-react';

interface ProblemDescriptionProps {
  problem: Problem;
  submissions: Submission[];
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problem,
  submissions,
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'editorial' | 'submissions'>('description');

  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return (
          <span className="inline-flex items-center rounded-md bg-teal-50 dark:bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:text-emerald-400 border border-teal-200 dark:border-emerald-500/20">
            Easy
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            Medium
          </span>
        );
      case 'Hard':
        return (
          <span className="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            Hard
          </span>
        );
    }
  };

  const getStatusBadge = (status: Submission['status']) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Accepted</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-rose-600 dark:text-rose-400 font-semibold text-xs">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-950/80 border-r border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Pane Tabs Header */}
      <div className="flex items-center border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 px-4">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex items-center space-x-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'description'
              ? 'border-blue-600 dark:border-amber-500 text-gray-900 dark:text-white font-bold'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Description</span>
        </button>
        <button
          onClick={() => setActiveTab('editorial')}
          className={`flex items-center space-x-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'editorial'
              ? 'border-blue-600 dark:border-amber-500 text-gray-900 dark:text-white font-bold'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Editorial</span>
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center space-x-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'submissions'
              ? 'border-blue-600 dark:border-amber-500 text-gray-900 dark:text-white font-bold'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>Submissions ({submissions.length})</span>
        </button>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'description' && (
          <div className="space-y-6">
            {/* Title & Metadata */}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {problem.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {getDifficultyBadge(problem.difficulty)}
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Acceptance: {problem.acceptanceRate}%
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Submissions: {problem.totalSubmissions.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="prose max-w-none text-sm leading-relaxed text-gray-800 dark:text-gray-300 whitespace-pre-line">
              {problem.description}
            </div>

            {/* Examples Section */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Examples
                </h3>
                {problem.examples.map((ex, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4 space-y-2 font-mono text-xs text-gray-800 dark:text-gray-300"
                  >
                    <div>
                      <span className="font-semibold text-gray-500 dark:text-gray-400">Input: </span>
                      <span className="text-gray-900 dark:text-amber-200 font-bold">{ex.input}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500 dark:text-gray-400">Output: </span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="font-sans text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800/80 pt-2 mt-1">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">Explanation: </span>
                        {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Constraints
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs font-mono text-gray-800 dark:text-gray-300">
                  {problem.constraints.map((c: string, idx: number) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags & Companies */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <div>
                <span className="text-xs font-semibold text-gray-400 flex items-center space-x-1 mb-1.5">
                  <Tag className="h-3 w-3" />
                  <span>Topic Tags</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(problem.tags || []).map((t: string) => (
                    <span
                      key={t}
                      className="rounded-md bg-gray-900 border border-gray-800 px-2 py-0.5 text-xs text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {problem.companyTags && problem.companyTags.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-gray-400 flex items-center space-x-1 mb-1.5">
                    <Building2 className="h-3 w-3" />
                    <span>Company Tags</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.companyTags.map((c: string) => (
                      <span
                        key={c}
                        className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs text-amber-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'editorial' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <span>Official Editorial & Approach</span>
            </h2>
            {problem.editorial ? (
              <div className="prose prose-invert max-w-none text-sm text-gray-300 leading-relaxed whitespace-pre-line bg-gray-900/60 p-4 rounded-xl border border-gray-800">
                {problem.editorial}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 text-center text-sm text-gray-400">
                Editorial is currently being prepared for this problem. Try analyzing the constraints and hash map optimizations!
              </div>
            )}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Your Submissions
            </h3>
            {submissions.length === 0 ? (
              <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-8 text-center text-sm text-gray-400">
                No submissions yet. Write your code and click Submit!
              </div>
            ) : (
              <div className="space-y-2">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/60 p-3.5 text-xs transition hover:border-gray-700"
                  >
                    <div className="space-y-1">
                      <div>{getStatusBadge(sub.status)}</div>
                      <p className="text-gray-400 text-[11px] font-medium">
                        Submission Time: {new Date(sub.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>{sub.runtimeMs}ms</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Cpu className="h-3 w-3 text-gray-400" />
                        <span>{sub.memoryMB} MB</span>
                      </div>
                      <span className="rounded bg-gray-800 px-2 py-0.5 font-mono text-[11px] uppercase text-gray-300">
                        {sub.language}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
