'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
  Cpu,
  Maximize2,
  Minimize2,
  GripHorizontal
} from 'lucide-react';
import { TestCase } from '../../../../shared/types';

export interface ExecutionResult {
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error' | 'Time Limit Exceeded';
  runtimeMs: number;
  memoryMB: number;
  passedCount: number;
  totalCount: number;
  compilationOutput?: string;
  consoleOutput?: string;
  testResults: {
    id: string;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    isHidden: boolean;
  }[];
  failedTestCase?: {
    input: string;
    expected: string;
    actual: string;
  };
}

interface IntegratedTerminalProps {
  testCases?: TestCase[];
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const IntegratedTerminal: React.FC<IntegratedTerminalProps> = ({
  testCases = [],
  executionResult,
  isRunning,
  isOpen,
  setIsOpen,
}) => {
  const [activeTab, setActiveTab] = useState<'testcase' | 'result' | 'console'>('testcase');
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const outputEndRef = useRef<HTMLDivElement>(null);

  // Resize / Adjustable Height States
  const [terminalHeight, setTerminalHeight] = useState<number>(280);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  // Load persisted terminal height
  useEffect(() => {
    const saved = localStorage.getItem('terminal_height');
    if (saved && !isNaN(Number(saved))) {
      setTerminalHeight(Math.max(140, Math.min(800, Number(saved))));
    }
  }, []);

  // Auto-switch to result tab when execution finishes
  useEffect(() => {
    if (executionResult) {
      setActiveTab('result');
      setIsOpen(true);
    }
  }, [executionResult, setIsOpen]);

  // Auto-scroll to latest output
  useEffect(() => {
    if (isOpen) {
      outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [executionResult, isRunning, activeTab, isOpen]);

  const handleCopyOutput = async () => {
    if (!executionResult) return;
    const textToCopy = JSON.stringify(executionResult, null, 2);
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: ExecutionResult['status']) => {
    switch (status) {
      case 'Accepted':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Wrong Answer':
      case 'Runtime Error':
      case 'Compilation Error':
      case 'Time Limit Exceeded':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';

    const startY = e.clientY;
    const startHeight = isMaximized ? Math.min(650, window.innerHeight * 0.65) : terminalHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const newHeight = Math.max(140, Math.min(window.innerHeight * 0.8, startHeight + deltaY));
      if (isMaximized) setIsMaximized(false);
      setTerminalHeight(newHeight);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      const finalDelta = startY - upEvent.clientY;
      const finalHeight = Math.max(140, Math.min(window.innerHeight * 0.8, startHeight + finalDelta));
      setTerminalHeight(finalHeight);
      localStorage.setItem('terminal_height', String(finalHeight));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const currentHeight = isMaximized
    ? Math.min(650, typeof window !== 'undefined' ? window.innerHeight * 0.68 : 500)
    : terminalHeight;

  return (
    <div
      style={isOpen ? { height: `${currentHeight}px` } : undefined}
      className={`border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col transition-height duration-100 relative ${
        isResizing ? 'select-none border-amber-500 dark:border-amber-500 ring-1 ring-amber-500/30' : ''
      } ${!isOpen ? 'h-auto' : ''}`}
    >
      {/* Interactive Vertical Resize Drag Bar across the top edge */}
      {isOpen && (
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={() => setIsMaximized(!isMaximized)}
          title="Drag vertically to adjust terminal height, or double-click to maximize/restore"
          className="absolute -top-2 left-0 right-0 h-4 cursor-row-resize z-40 group flex items-center justify-center hover:bg-amber-500/10 transition-colors"
        >
          <div
            className={`flex items-center justify-center h-1.5 rounded-full transition-all duration-150 ${
              isResizing
                ? 'bg-amber-500 w-24 shadow-sm shadow-amber-500/50'
                : 'bg-gray-300 dark:bg-gray-700 w-12 group-hover:bg-amber-500 group-hover:w-20'
            }`}
          />
        </div>
      )}

      {/* Docked Bar / Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/90 px-4 py-2 shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 text-xs font-bold text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
          >
            <TerminalIcon className="h-4 w-4 text-emerald-600 dark:text-amber-400" />
            <span>Integrated Testcase & Output</span>
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {/* Status Badge preview when closed */}
          {!isOpen && executionResult && (
            <span
              className={`ml-3 rounded-md px-2 py-0.5 text-xs font-bold border ${getStatusColor(
                executionResult.status
              )}`}
            >
              {executionResult.status}
            </span>
          )}
        </div>

        {/* Tab Buttons & Actions */}
        {isOpen && (
          <div className="flex items-center space-x-3">
            <div className="flex rounded-lg bg-gray-100 dark:bg-gray-950 p-0.5 border border-gray-300 dark:border-gray-800">
              <button
                onClick={() => setActiveTab('testcase')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                  activeTab === 'testcase'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Testcase
              </button>
              <button
                onClick={() => setActiveTab('result')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                  activeTab === 'result'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Test Result
              </button>
              <button
                onClick={() => setActiveTab('console')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                  activeTab === 'console'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Console Log
              </button>
            </div>

            {/* Maximize Toggle & Copy Buttons */}
            <div className="flex items-center space-x-1.5 ml-1">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "Restore default height" : "Maximize height"}
                className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
              >
                {isMaximized ? (
                  <Minimize2 className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </button>
              {executionResult && (
                <button
                  onClick={handleCopyOutput}
                  title="Copy output"
                  className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Terminal Panel */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-950 font-mono text-xs border-t border-gray-200 dark:border-gray-800">
          {isRunning ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3 text-gray-500 dark:text-gray-400">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              <p className="font-sans text-xs">Executing code against sample test cases...</p>
            </div>
          ) : activeTab === 'testcase' ? (
            <div className="space-y-4 font-sans">
              {/* Case selector tabs */}
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                {testCases.map((tc, idx) => (
                  <button
                    key={tc.id || idx}
                    onClick={() => setSelectedTestCaseIdx(idx)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold border transition ${
                      selectedTestCaseIdx === idx
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300'
                        : 'border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {testCases[selectedTestCaseIdx] && (
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-semibold block mb-1">
                      Input:
                    </span>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3 text-gray-900 dark:text-gray-200 whitespace-pre-wrap font-bold">
                      {testCases[selectedTestCaseIdx].input}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-semibold block mb-1">
                      Expected Output:
                    </span>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3 text-emerald-700 dark:text-emerald-300 whitespace-pre-wrap font-bold">
                      {testCases[selectedTestCaseIdx].expectedOutput}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'result' ? (
            !executionResult ? (
              <div className="flex items-center justify-center h-full text-gray-500 font-sans">
                You must run your code first to view test results.
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                {/* Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-lg px-3 py-1 font-bold text-sm border ${getStatusColor(
                        executionResult.status
                      )}`}
                    >
                      {executionResult.status}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Passed {executionResult.passedCount} / {executionResult.totalCount} Test Cases
                    </span>
                  </div>

                  {/* Runtime & Memory Metrics */}
                  <div className="flex items-center space-x-4 text-xs text-gray-700 dark:text-gray-300 font-semibold">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      <span>{executionResult.runtimeMs} ms</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Cpu className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      <span>{executionResult.memoryMB} MB</span>
                    </div>
                  </div>
                </div>

                {/* Mandatory Error Box with exact Line Number for Compilation & Runtime Errors */}
                {(executionResult.status === 'Compilation Error' ||
                  executionResult.status === 'Runtime Error' ||
                  (executionResult.status !== 'Accepted' && executionResult.status !== 'Wrong Answer' && (executionResult.compilationOutput || executionResult.consoleOutput))) && (
                  <div className="rounded-xl border border-rose-500/50 bg-rose-50/80 dark:bg-rose-950/40 p-4 space-y-2 text-rose-900 dark:text-rose-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-bold font-sans text-sm text-rose-700 dark:text-rose-400">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                        <span>{executionResult.status} Occurred</span>
                      </div>
                      {/* Extract line badge if present */}
                      {(() => {
                        const msg = executionResult.compilationOutput || executionResult.consoleOutput || '';
                        const match = msg.match(/\[Line\s+(\d+)\]/i) || msg.match(/\bline\s+(\d+)\b/i);
                        if (match && match[1]) {
                          return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-sm">
                              📍 Line {match[1]}
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <div className="font-mono text-xs bg-white/60 dark:bg-black/40 p-3 rounded-lg border border-rose-300/40 dark:border-rose-800/40 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {executionResult.compilationOutput || executionResult.consoleOutput || 'Error details not available.'}
                    </div>
                  </div>
                )}

                {/* Individual Case Output Comparison */}
                <div className="space-y-3">
                  {executionResult.testResults.map((tr, idx) => (
                    <div
                      key={tr.id || idx}
                      className={`rounded-xl border p-3.5 space-y-2 font-mono text-xs ${
                        tr.passed
                          ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5'
                          : 'border-rose-200 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between font-sans">
                        <span className="font-semibold text-gray-800 dark:text-gray-300">
                          Case {idx + 1}
                        </span>
                        {tr.passed ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">Passed</span>
                        ) : (
                          <span className="text-rose-700 dark:text-rose-400 font-bold">Failed</span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600 dark:text-gray-500 block">Input:</span>
                          <div className="text-gray-900 dark:text-gray-200 truncate font-semibold">{tr.input}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-500 block">Output:</span>
                          <div
                            className={
                              tr.passed ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-rose-700 dark:text-rose-300 font-bold'
                            }
                          >
                            {tr.actualOutput}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-500 block">Expected:</span>
                          <div className="text-emerald-700 dark:text-emerald-300 font-bold">
                            {tr.expectedOutput}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            /* Console Log Tab */
            <div className="space-y-2 font-mono text-xs">
              {executionResult?.compilationOutput && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3 text-gray-800 dark:text-gray-300">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold block mb-1">
                    Compilation Log:
                  </span>
                  {executionResult.compilationOutput}
                </div>
              )}
              {executionResult?.consoleOutput ? (
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3 text-gray-800 dark:text-gray-300">
                  <span className="text-gray-600 dark:text-gray-400 font-semibold block mb-1">
                    Standard Output / Console:
                  </span>
                  {executionResult.consoleOutput}
                </div>
              ) : (
                <div className="text-gray-500 font-sans">No console logs outputted.</div>
              )}
            </div>
          )}
          <div ref={outputEndRef} />
        </div>
      )}
    </div>
  );
};
