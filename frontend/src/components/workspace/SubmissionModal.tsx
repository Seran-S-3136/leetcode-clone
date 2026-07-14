'use client';

import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Trophy,
  X,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { ExecutionResult } from './IntegratedTerminal';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ExecutionResult | null;
  language: string;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  result,
  language,
}) => {
  if (!isOpen || !result) return null;

  const isAccepted = result.status === 'Accepted';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-xl rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div
          className={`px-6 py-5 border-b border-gray-800 flex items-center justify-between ${
            isAccepted
              ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent'
              : 'bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent'
          }`}
        >
          <div className="flex items-center space-x-3">
            {isAccepted ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Trophy className="h-6 w-6" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                <XCircle className="h-6 w-6" />
              </div>
            )}
            <div>
              <h2
                className={`text-xl font-extrabold ${
                  isAccepted ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {result.status}
              </h2>
              <p className="text-xs text-gray-400">
                Passed {result.passedCount} of {result.totalCount} hidden & public test cases
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span className="flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Runtime</span>
                </span>
                <span className="text-emerald-400 font-semibold">Beats 84.6%</span>
              </div>
              <div className="text-2xl font-bold text-white">{result.runtimeMs} ms</div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span className="flex items-center space-x-1">
                  <Cpu className="h-3.5 w-3.5 text-blue-400" />
                  <span>Memory</span>
                </span>
                <span className="text-emerald-400 font-semibold">Beats 79.2%</span>
              </div>
              <div className="text-2xl font-bold text-white">{result.memoryMB} MB</div>
            </div>
          </div>

          {/* Failed TestCase Details if Rejected */}
          {!isAccepted && result.failedTestCase && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center space-x-1.5 font-sans font-semibold text-rose-300">
                <AlertTriangle className="h-4 w-4" />
                <span>Failed Test Case</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Input:</span>
                <div className="rounded bg-gray-950 p-2.5 text-gray-200">
                  {result.failedTestCase.input}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-400 block mb-1">Output:</span>
                  <div className="rounded bg-gray-950 p-2.5 text-rose-300">
                    {result.failedTestCase.actual}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Expected:</span>
                  <div className="rounded bg-gray-950 p-2.5 text-emerald-300">
                    {result.failedTestCase.expected}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-800">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-200 hover:bg-gray-700 transition"
            >
              Continue Practicing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
