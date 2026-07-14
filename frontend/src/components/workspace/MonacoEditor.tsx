'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import {
  RotateCcw,
  Copy,
  Download,
  Check,
  Type,
  Code2,
  Terminal as TerminalIcon,
  Play,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MonacoEditorProps {
  problemId: string;
  starterCode: Record<string, string>;
  language: string;
  setLanguage: (lang: string) => void;
  code: string;
  setCode: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
}

const SUPPORTED_LANGUAGES = [
  { id: 'python', name: 'Python 3', ext: 'py' },
  { id: 'javascript', name: 'JavaScript', ext: 'js' },
  { id: 'cpp', name: 'C++', ext: 'cpp' },
  { id: 'java', name: 'Java', ext: 'java' },
  { id: 'c', name: 'C', ext: 'c' },
  { id: 'rust', name: 'Rust', ext: 'rs' },
  { id: 'go', name: 'Go', ext: 'go' },
];

const getDefaultStarterCode = (lang: string, starterMap?: Record<string, string>): string => {
  if (starterMap && starterMap[lang]) return starterMap[lang];
  // Check common aliases
  if (lang === 'c++' && starterMap && starterMap['cpp']) return starterMap['cpp'];
  if (lang === 'python3' && starterMap && starterMap['python']) return starterMap['python'];
  if (lang === 'js' && starterMap && starterMap['javascript']) return starterMap['javascript'];
  if (lang === 'golang' && starterMap && starterMap['go']) return starterMap['go'];

  switch (lang) {
    case 'python':
    case 'python3':
      return `class Solution:\n    def solve(self, *args, **kwargs):\n        pass`;
    case 'javascript':
    case 'js':
      return `/**\n * @return {any}\n */\nvar solution = function(...args) {\n    \n};`;
    case 'java':
      return `class Solution {\n    public void solve() {\n        \n    }\n}`;
    case 'cpp':
    case 'c++':
      return `class Solution {\npublic:\n    void solve() {\n        \n    }\n};`;
    case 'c':
      return `/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* solve() {\n    return NULL;\n}`;
    case 'rust':
      return `impl Solution {\n    pub fn solve() {\n        \n    }\n}`;
    case 'go':
    case 'golang':
      return `func solve() {\n    \n}`;
    default:
      return `// Write your ${lang} code here`;
  }
};

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  problemId,
  starterCode,
  language,
  setLanguage,
  code,
  setCode,
  onRun,
  onSubmit,
  isRunning,
}) => {
  const { theme } = useApp();
  const [fontSize, setFontSize] = useState<number>(14);
  const [copied, setCopied] = useState<boolean>(false);
  const [autoSavedTime, setAutoSavedTime] = useState<string>('');
  const editorRef = useRef<any>(null);

  // Load saved code from localStorage on mount or language change
  useEffect(() => {
    const storageKey = `code_${problemId}_${language}`;
    const savedCode = localStorage.getItem(storageKey);
    if (savedCode !== null) {
      setCode(savedCode);
    } else {
      const defaultCode = getDefaultStarterCode(language, starterCode);
      setCode(defaultCode);
    }
  }, [problemId, language, starterCode]);

  // Auto-save code on change
  const handleCodeChange = (value: string | undefined) => {
    const nextCode = value || '';
    setCode(nextCode);
    const storageKey = `code_${problemId}_${language}`;
    localStorage.setItem(storageKey, nextCode);
    setAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleResetCode = () => {
    const defaultCode = getDefaultStarterCode(language, starterCode);
    setCode(defaultCode);
    const storageKey = `code_${problemId}_${language}`;
    localStorage.setItem(storageKey, defaultCode);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const langConfig = SUPPORTED_LANGUAGES.find((l) => l.id === language) || SUPPORTED_LANGUAGES[0];
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${problemId}_solution.${langConfig.ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add Keyboard shortcuts (Ctrl+Enter to Run, Ctrl+Shift+Enter to Submit)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        onSubmit();
      }
    );
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80 px-4 py-2 gap-2">
        {/* Language Selector & Auto-save status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-800 dark:text-gray-300">
            <Code2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Code</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-gray-200 focus:border-blue-600 dark:focus:border-amber-500 focus:outline-none transition"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          {autoSavedTime && (
            <span className="hidden sm:inline text-[11px] text-gray-500">
              Saved at {autoSavedTime}
            </span>
          )}
        </div>

        {/* Editor Controls: Font Size, Reset, Copy, Download */}
        <div className="flex items-center space-x-1.5">
          {/* Font Size Dropdown */}
          <div className="flex items-center space-x-1 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-700 dark:text-gray-300">
            <Type className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-transparent text-xs font-medium text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer"
            >
              {[12, 14, 16, 18, 20].map((size) => (
                <option key={size} value={size} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
                  {size}px
                </option>
              ))}
            </select>
          </div>

          {/* Reset Code */}
          <button
            onClick={handleResetCode}
            title="Reset code to default template"
            className="flex items-center space-x-1 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            title="Copy code to clipboard"
            className="flex items-center space-x-1 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Download Code */}
          <button
            onClick={handleDownloadCode}
            title="Download solution file"
            className="flex items-center space-x-1 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative min-h-[300px]">
        <Editor
          height="100%"
          language={language === 'c++' ? 'cpp' : language}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            padding: { top: 12 },
          }}
        />
      </div>
    </div>
  );
};
