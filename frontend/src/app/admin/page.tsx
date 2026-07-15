'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { useApp } from '../../context/AppContext';
import { Problem, TestCase, Difficulty, UserProfile } from '../../../../shared/types';
import {
  ShieldAlert,
  Link as LinkIcon,
  PlusCircle,
  FolderKanban,
  Users,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit,
  Edit2,
  Globe,
  Sparkles,
  Loader2,
  Save,
  Eye,
  Plus,
  Code,
  ChevronLeft,
  ChevronRight,
  X,
  Database
} from 'lucide-react';

export default function AdminPage() {
  const { user, problems, addProblem, deleteProblem, updateProblem } = useApp();
  const [activeTab, setActiveTab] = useState<'url-import' | 'manual-create' | 'manage-problems' | 'manage-users'>('url-import');
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [editForm, setEditForm] = useState<Partial<Problem> & { tagsString?: string; companyTagsString?: string; constraintsString?: string }>({});
  const [seedingFirebase, setSeedingFirebase] = useState<boolean>(false);
  const [adminPage, setAdminPage] = useState<number>(1);
  const adminItemsPerPage = 10;

  // Real users fetched from DB
  const [dbUsers, setDbUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  const refreshPlatformUsers = React.useCallback(async () => {
    setLoadingUsers(true);
    const usersMap = new Map<string, UserProfile>();

    // 1. Try fetching from Backend API (queries Firebase Admin Auth & Firestore directly)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/users`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.users)) {
          data.users.forEach((u: UserProfile) => {
            if (u && (u.uid || u.email)) {
              usersMap.set((u.uid || u.email).toLowerCase(), u);
            }
          });
        }
      }
    } catch (err) {
      console.debug('Admin users API fallback:', err);
    }

    // 2. Client-side fetch from Firebase Firestore 'users' collection
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as UserProfile;
        if (data && (data.uid || data.email)) {
          const key = (data.uid || data.email).toLowerCase();
          const existing = usersMap.get(key);
          usersMap.set(key, { ...(existing || {}), ...data });
        }
      });
    } catch (error) {
      console.debug('Firestore users client query fallback:', error);
    }

    // 3. Client-side fetch from Firestore 'submissions' to aggregate users & exact solved problem counts
    try {
      const subSnap = await getDocs(collection(db, 'submissions'));
      const acceptedByUser = new Map<string, Set<string>>();
      subSnap.forEach((docSnap) => {
        const sub = docSnap.data();
        if (sub.status === 'Accepted' && sub.userId && sub.problemId) {
          const key = sub.userId.toLowerCase();
          if (!acceptedByUser.has(key)) acceptedByUser.set(key, new Set());
          acceptedByUser.get(key)!.add(sub.problemId);
        }
      });

      acceptedByUser.forEach((problemIds, userIdKey) => {
        if (usersMap.has(userIdKey)) {
          const u = usersMap.get(userIdKey)!;
          const currentTotal = (u.solvedCount?.easy || 0) + (u.solvedCount?.medium || 0) + (u.solvedCount?.hard || 0);
          if (currentTotal < problemIds.size) {
            u.solvedCount = { easy: problemIds.size, medium: 0, hard: 0 };
          }
        } else {
          usersMap.set(userIdKey, {
            uid: userIdKey,
            email: `${userIdKey}@codearena.dev`,
            displayName: 'Platform User',
            role: 'user',
            solvedCount: { easy: problemIds.size, medium: 0, hard: 0 },
            streak: 1,
            acceptanceRate: 100,
            createdAt: new Date().toISOString(),
          });
        }
      });
    } catch (subErr) {
      console.debug('Firestore submissions client query fallback:', subErr);
    }

    // 4. Ensure logged-in admin is included
    if (user) {
      const key = (user.uid || user.email || '').toLowerCase();
      if (!usersMap.has(key)) {
        usersMap.set(key, user);
      } else {
        const existing = usersMap.get(key)!;
        usersMap.set(key, { ...existing, ...user, solvedCount: user.solvedCount || existing.solvedCount });
      }
    }

    const finalList = Array.from(usersMap.values());
    setDbUsers(finalList);
    setLoadingUsers(false);
  }, [user]);

  useEffect(() => {
    refreshPlatformUsers();
  }, [refreshPlatformUsers]);

  // Method 1 state: URL Import
  const [importUrl, setImportUrl] = useState<string>('');
  const [importing, setImporting] = useState<boolean>(false);
  const [importedProblem, setImportedProblem] = useState<Partial<Problem> | null>(null);

  // Method 2 state: Manual Problem Form
  const [title, setTitle] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [description, setDescription] = useState<string>('');
  const [constraints, setConstraints] = useState<string>('1 <= N <= 10^5\nTime Limit: 2.0 seconds');
  const [inputFormat, setInputFormat] = useState<string>('Standard Input stream');
  const [outputFormat, setOutputFormat] = useState<string>('Standard Output stream');
  const [tags, setTags] = useState<string>('Array, Dynamic Programming');
  const [companyTags, setCompanyTags] = useState<string>('Google, Amazon');
  const [timeLimitMs, setTimeLimitMs] = useState<number>(2000);
  const [memoryLimitMB, setMemoryLimitMB] = useState<number>(128);

  // Multi-Language Starter Code & Solution state
  const [selectedLang, setSelectedLang] = useState<string>('python');
  const [starterCodes, setStarterCodes] = useState<Record<string, string>>({
    python: 'class Solution:\n    def solve(self, *args, **kwargs):\n        pass\n',
    javascript: '/**\n * @return {any}\n */\nvar solution = function(...args) {\n    \n};\n',
    cpp: 'class Solution {\npublic:\n    void solve() {\n        \n    }\n};\n',
    java: 'class Solution {\n    public void solve() {\n        \n    }\n}\n',
    c: '/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* solve() {\n    return NULL;\n}\n',
    rust: 'impl Solution {\n    pub fn solve() {\n        \n    }\n}\n',
    go: 'func solve() {\n    \n}\n',
  });
  const [correctSolutions, setCorrectSolutions] = useState<Record<string, string>>({
    python: '# Official correct solution\n',
  });

  // Test Case Builder state
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: 'tc-1', input: 'Sample Input 1', expectedOutput: 'Sample Output 1', isHidden: false },
    { id: 'tc-2', input: 'Hidden Input 1', expectedOutput: 'Hidden Output 1', isHidden: true },
  ]);

  // Check role authorization
  if (user?.role !== 'admin') {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Access Denied</h1>
        <p className="text-sm text-gray-400">
          You must have Administrator role to access the Admin Studio. Click the{' '}
          <span className="text-amber-400 font-semibold">Role: user</span> badge in the top navbar to switch to Admin mode for testing!
        </p>
      </div>
    );
  }

  // Handle URL Import extraction
  const handleExtractFromUrl = async () => {
    if (!importUrl) return;
    setImporting(true);
    setImportedProblem(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/import-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        setImportedProblem(data.data);
      } else {
        throw new Error('Fallback importer');
      }
    } catch (err) {
      // Local URL fallback extractor
      const slugMatch = importUrl.match(/\/problems\/([^/?#]+)/);
      const slug = slugMatch ? slugMatch[1] : 'imported-problem';
      const formattedTitle = slug
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const isAddTwoNumbers = slug === 'add-two-numbers';
      setImportedProblem({
        title: `${formattedTitle}`,
        difficulty: 'Medium',
        description: isAddTwoNumbers
          ? `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.`
          : `You are given the problem **${formattedTitle}**.\n\nDesign an efficient algorithm to compute the solution while respecting the given time and memory constraints. Ensure your code handles edge cases properly.`,
        constraints: isAddTwoNumbers
          ? ['The number of nodes in each linked list is in the range [1, 100].', '0 <= Node.val <= 9', 'It is guaranteed that the list represents a number that does not have leading zeros.']
          : ['1 <= N <= 10^5', 'Time Limit: 2.0 seconds'],
        inputFormat: 'Standard Input parameters matching problem specifications.',
        outputFormat: 'Standard Output answer matching problem specifications.',
        examples: isAddTwoNumbers
          ? [
              {
                input: 'l1 = [2,4,3], l2 = [5,6,4]',
                output: '[7,0,8]',
                explanation: '342 + 465 = 807.',
              },
              {
                input: 'l1 = [0], l2 = [0]',
                output: '[0]',
              },
            ]
          : [
              {
                input: 'nums = [2,7,11,15], target = 9',
                output: '[0,1]',
                explanation: 'Sample illustration for the test case.',
              },
            ],
        tags: ['Algorithms', 'Data Structures'],
        companyTags: ['LeetCode'],
        timeLimitMs: 2000,
        memoryLimitMB: 128,
        acceptanceRate: Math.round((48 + Math.random() * 28) * 10) / 10,
        starterCode: {
          python: 'class Solution:\n    def solve(self, *args, **kwargs):\n        pass\n',
          javascript: 'var solution = function(...args) {\n    \n};\n',
          cpp: 'class Solution {\npublic:\n    void solve() {\n        \n    }\n};\n',
          java: 'class Solution {\n    public void solve() {\n        \n    }\n}\n',
          c: 'int* solve() {\n    return NULL;\n}\n',
          rust: 'impl Solution {\n    pub fn solve() {\n        \n    }\n}\n',
          go: 'func solve() {\n    \n}\n',
        },
      });
    } finally {
      setImporting(false);
    }
  };

  // Publish Imported Problem
  const handlePublishImported = () => {
    if (!importedProblem || !importedProblem.title) return;
    const slug = importedProblem.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProblem: Problem = {
      id: slug,
      slug: slug,
      title: importedProblem.title,
      difficulty: importedProblem.difficulty || 'Medium',
      description: importedProblem.description || '',
      constraints: importedProblem.constraints || [],
      inputFormat: importedProblem.inputFormat || '',
      outputFormat: importedProblem.outputFormat || '',
      examples:
        importedProblem.examples && importedProblem.examples.length > 0
          ? importedProblem.examples
          : [
              {
                input: 'l1 = [2,4,3], l2 = [5,6,4]',
                output: '[7,0,8]',
                explanation: '342 + 465 = 807.',
              },
            ],
      tags: importedProblem.tags || ['Imported'],
      companyTags: importedProblem.companyTags || ['Platform'],
      timeLimitMs: importedProblem.timeLimitMs || 2000,
      memoryLimitMB: importedProblem.memoryLimitMB || 128,
      starterCode: importedProblem.starterCode || {
        python: 'class Solution:\n    def solve(self):\n        pass\n',
      },
      correctSolution: {},
      status: 'published',
      acceptanceRate: importedProblem.acceptanceRate || 65.0,
      totalSubmissions: 1,
      totalAccepted: 1,
      testCases:
        importedProblem.examples && importedProblem.examples.length > 0
          ? importedProblem.examples.map((ex, idx) => ({
              id: `tc-imp-${idx + 1}`,
              input: ex.input,
              expectedOutput: ex.output,
              isHidden: false,
            }))
          : [
              { id: 'tc-imp-1', input: 'l1 = [2,4,3], l2 = [5,6,4]', expectedOutput: '[7,0,8]', isHidden: false },
            ],
    };

    addProblem(newProblem);
    setImportedProblem(null);
    setImportUrl('');
    setActiveTab('manage-problems');
  };

  // Handle Manual Problem Creation
  const handleCreateManualProblem = (status: 'published' | 'draft') => {
    if (!title.trim()) return;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProblem: Problem = {
      id: slug,
      slug: slug,
      title: title.trim(),
      difficulty: difficulty,
      description: description,
      constraints: constraints.split('\n').filter((l: string) => Boolean(l.trim())),
      inputFormat: inputFormat,
      outputFormat: outputFormat,
      examples: [
        {
          input: testCases[0]?.input || 'Input 1',
          output: testCases[0]?.expectedOutput || 'Output 1',
        },
      ],
      tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      companyTags: companyTags.split(',').map((c: string) => c.trim()).filter(Boolean),
      timeLimitMs: timeLimitMs,
      memoryLimitMB: memoryLimitMB,
      starterCode: starterCodes,
      correctSolution: correctSolutions,
      status: status,
      acceptanceRate: 100,
      totalSubmissions: 0,
      totalAccepted: 0,
      testCases: testCases,
    };

    addProblem(newProblem);
    setTitle('');
    setDescription('');
    setActiveTab('manage-problems');
  };

  // Add Test Case row
  const addTestCase = (isHidden: boolean) => {
    setTestCases((prev) => [
      ...prev,
      {
        id: `tc-${Date.now()}`,
        input: '',
        expectedOutput: '',
        isHidden: isHidden,
      },
    ]);
  };

  const removeTestCase = (id: string) => {
    setTestCases((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTestCase = (id: string, field: 'input' | 'expectedOutput' | 'isHidden', value: any) => {
    setTestCases((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleOpenEdit = (prob: Problem) => {
    setEditingProblem(prob);
    setEditForm({
      ...prob,
      tagsString: Array.isArray(prob.tags) ? prob.tags.join(', ') : '',
      companyTagsString: Array.isArray(prob.companyTags) ? prob.companyTags.join(', ') : '',
      constraintsString: Array.isArray(prob.constraints) ? prob.constraints.join('\n') : '',
    });
  };

  const handleSaveEditModal = () => {
    if (!editingProblem) return;
    const updated: Partial<Problem> = {
      ...editForm,
      acceptanceRate: typeof editForm.acceptanceRate === 'number' ? editForm.acceptanceRate : parseFloat(editForm.acceptanceRate as any) || editingProblem.acceptanceRate,
      tags: typeof editForm.tagsString === 'string' ? editForm.tagsString.split(',').map(t => t.trim()).filter(Boolean) : editingProblem.tags,
      companyTags: typeof editForm.companyTagsString === 'string' ? editForm.companyTagsString.split(',').map(c => c.trim()).filter(Boolean) : editingProblem.companyTags,
      constraints: typeof editForm.constraintsString === 'string' ? editForm.constraintsString.split('\n').map(c => c.trim()).filter(Boolean) : editingProblem.constraints,
    };
    delete (updated as any).tagsString;
    delete (updated as any).companyTagsString;
    delete (updated as any).constraintsString;
    updateProblem(editingProblem.id, updated);
    setEditingProblem(null);
    setEditForm({});
  };

  const handleSeedToFirebase = async () => {
    setSeedingFirebase(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/seed-firebase?force=true`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully synced ${data.count} problems to Firebase Firestore database!`);
      } else {
        alert(`Failed to sync: ${data.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Error connecting to backend: ${err.message}`);
    } finally {
      setSeedingFirebase(false);
    }
  };

  const isAuthorizedAdmin = user && (user.email || '').trim().toLowerCase() === 'seran7869@gmail.com';

  if (!isAuthorizedAdmin) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <div className="rounded-3xl border border-rose-500/20 bg-gray-900/90 p-12 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mb-6 border border-rose-500/20">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-white">Admin Access Restricted</h1>
          <p className="mt-3 text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            Only authorized administrator accounts (<span className="text-amber-400 font-bold">seran7869@gmail.com</span>) have permission to view or manage the Admin Studio.
          </p>
          <div className="mt-8">
            <a
              href="/dashboard"
              className="inline-flex items-center space-x-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-gray-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition"
            >
              Return to User Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Admin Title Bar */}
      <div className="rounded-2xl border border-gray-200 dark:border-amber-500/20 bg-white dark:bg-gradient-to-r dark:from-amber-500/10 dark:via-gray-900 dark:to-gray-950 p-6 shadow-sm dark:shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20">
            <ShieldAlert className="h-6 w-6 font-bold" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin Studio</h1>
            <p className="text-xs text-amber-600 dark:text-amber-300">
              Role-Based Administrator Management Panel
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('url-import')}
            className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'url-import'
                ? 'bg-amber-500 text-gray-950 shadow-md'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="h-3.5 w-3.5" />
            <span>Import by URL</span>
          </button>

          <button
            onClick={() => setActiveTab('manual-create')}
            className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'manual-create'
                ? 'bg-amber-500 text-gray-950 shadow-md'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Create Problem</span>
          </button>

          <button
            onClick={() => setActiveTab('manage-problems')}
            className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'manage-problems'
                ? 'bg-amber-500 text-gray-950 shadow-md'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FolderKanban className="h-3.5 w-3.5" />
            <span>Problems ({problems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('manage-users')}
            className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'manage-users'
                ? 'bg-amber-500 text-gray-950 shadow-md'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Users</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Method 1 - Import Using Problem URL */}
      {activeTab === 'url-import' && (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Globe className="h-5 w-5 text-amber-400" />
              <span>Method 1: Import Problem Using URL</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Paste a LeetCode or competitive programming problem URL. The system will automatically scrape and prefill the title, difficulty, description, constraints, and starter code for your review.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="url"
              placeholder="e.g. https://leetcode.com/problems/two-sum"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              className="flex-1 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-amber-500 focus:outline-none"
            />
            <button
              onClick={handleExtractFromUrl}
              disabled={!importUrl || importing}
              className="flex items-center space-x-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-gray-950 hover:bg-amber-400 disabled:opacity-50 transition w-full sm:w-auto justify-center shadow-lg shadow-amber-500/20"
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Extract & Prefill</span>
            </button>
          </div>

          {/* Extracted Problem Review Card */}
          {importedProblem && (
            <div className="rounded-xl border border-amber-500/30 bg-gray-950 p-6 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Extracted Problem Preview
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {importedProblem.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400">
                    {importedProblem.difficulty}
                  </span>
                  <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                    {importedProblem.acceptanceRate || 65}% Acceptance
                  </span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-xs text-gray-300 max-h-48 overflow-y-auto p-3 rounded-lg bg-gray-900 border border-gray-800">
                {importedProblem.description}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setImportedProblem(null)}
                  className="rounded-lg bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-700"
                >
                  Discard
                </button>
                <button
                  onClick={handlePublishImported}
                  className="flex items-center space-x-1.5 rounded-lg bg-emerald-500 px-5 py-2 text-xs font-bold text-gray-950 hover:bg-emerald-400 shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span>Review & Publish Problem</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Method 2 - Manual Problem Creator */}
      {activeTab === 'manual-create' && (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <PlusCircle className="h-5 w-5 text-amber-400" />
              <span>Method 2: Create Problem From Scratch</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Design a complete coding challenge with custom descriptions, time/memory limits, multi-language starter code, and public/hidden test cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Problem Title *
              </label>
              <input
                type="text"
                placeholder="e.g. 501. Find Minimum in Rotated Array"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Difficulty Level *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Markdown Problem Description *
            </label>
            <textarea
              rows={5}
              placeholder="Explain the problem statement clearly using Markdown syntax..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3.5 py-2.5 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Constraints (one per line)
              </label>
              <textarea
                rows={3}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3.5 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Time Limit (ms)
                </label>
                <input
                  type="number"
                  value={timeLimitMs}
                  onChange={(e) => setTimeLimitMs(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Memory Limit (MB)
                </label>
                <input
                  type="number"
                  value={memoryLimitMB}
                  onChange={(e) => setMemoryLimitMB(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Topic Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Company Tags (comma-separated)
              </label>
              <input
                type="text"
                value={companyTags}
                onChange={(e) => setCompanyTags(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Starter Code Multi-Language Manager */}
          <div className="space-y-3 pt-2 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Multi-Language Starter Code
              </label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="rounded-lg border border-gray-700 bg-gray-950 px-2.5 py-1 text-xs text-white"
              >
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
              </select>
            </div>

            <textarea
              rows={4}
              value={starterCodes[selectedLang] || ''}
              onChange={(e) =>
                setStarterCodes({
                  ...starterCodes,
                  [selectedLang]: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-xs text-amber-200 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Test Case Manager */}
          <div className="space-y-3 pt-2 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Public & Hidden Test Cases ({testCases.length})
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => addTestCase(false)}
                  className="rounded-lg bg-gray-800 px-3 py-1 text-xs font-semibold text-emerald-400 hover:bg-gray-700"
                >
                  + Public Test Case
                </button>
                <button
                  type="button"
                  onClick={() => addTestCase(true)}
                  className="rounded-lg bg-gray-800 px-3 py-1 text-xs font-semibold text-rose-400 hover:bg-gray-700"
                >
                  + Hidden Test Case
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {testCases.map((tc, index) => (
                <div
                  key={tc.id}
                  className="rounded-xl border border-gray-800 bg-gray-950 p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-300">
                      Test Case #{index + 1} ({tc.isHidden ? 'Hidden' : 'Public'})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTestCase(tc.id)}
                      className="text-gray-500 hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <textarea
                      rows={2}
                      placeholder="Input data"
                      value={tc.input}
                      onChange={(e) =>
                        updateTestCase(tc.id, 'input', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-800 bg-gray-900 p-2 text-xs text-white font-mono"
                    />
                    <textarea
                      rows={2}
                      placeholder="Expected Output"
                      value={tc.expectedOutput}
                      onChange={(e) =>
                        updateTestCase(tc.id, 'expectedOutput', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-800 bg-gray-900 p-2 text-xs text-emerald-300 font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
            <button
              onClick={() => handleCreateManualProblem('draft')}
              className="rounded-xl border border-gray-700 bg-gray-800 px-5 py-2.5 text-xs font-semibold text-gray-200 hover:bg-gray-700 transition"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleCreateManualProblem('published')}
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-gray-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Publish Problem</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Problem Management Table */}
      {activeTab === 'manage-problems' && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Problem Library Management</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSeedToFirebase}
                disabled={seedingFirebase}
                className="flex items-center space-x-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 disabled:opacity-50 transition cursor-pointer"
                title="Push all 50 authentic problems directly to Firebase Firestore database"
              >
                {seedingFirebase ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                <span>{seedingFirebase ? 'Syncing DB...' : 'Sync to Firebase DB'}</span>
              </button>
              <button
                onClick={() => setActiveTab('manual-create')}
                className="flex items-center space-x-1 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-gray-950 hover:bg-amber-400 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>New Problem</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
              <thead className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Acceptance</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800/60">
                {problems
                  .slice((adminPage - 1) * adminItemsPerPage, adminPage * adminItemsPerPage)
                  .map((problem) => (
                    <tr key={problem.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                        {problem.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`rounded px-2 py-0.5 font-semibold text-[11px] uppercase ${
                            problem.status === 'published'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {problem.status || 'published'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{problem.acceptanceRate}%</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              updateProblem(problem.id, {
                                status:
                                  problem.status === 'published'
                                    ? 'draft'
                                    : 'published',
                              })
                            }
                            className="rounded bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            {problem.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleOpenEdit(problem)}
                            className="rounded p-1.5 text-gray-400 hover:bg-amber-500/20 hover:text-amber-600 dark:hover:text-amber-400"
                            title="Edit problem"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteProblem(problem.id)}
                            className="rounded p-1.5 text-gray-400 hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Delete problem"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Admin Table Pagination Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Showing <span className="font-bold text-gray-900 dark:text-white">{(adminPage - 1) * adminItemsPerPage + 1}</span> to{' '}
              <span className="font-bold text-gray-900 dark:text-white">
                {Math.min(adminPage * adminItemsPerPage, problems.length)}
              </span>{' '}
              of <span className="font-bold text-gray-900 dark:text-white">{problems.length}</span> problems
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAdminPage((p) => Math.max(1, p - 1))}
                disabled={adminPage === 1}
                className="flex items-center space-x-1 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-gray-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-2xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Page {adminPage} of {Math.ceil(problems.length / adminItemsPerPage) || 1}
              </span>
              <button
                onClick={() => setAdminPage((p) => Math.min(Math.ceil(problems.length / adminItemsPerPage) || 1, p + 1))}
                disabled={adminPage === (Math.ceil(problems.length / adminItemsPerPage) || 1)}
                className="flex items-center space-x-1 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-gray-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-2xs"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: User Management Table */}
      {activeTab === 'manage-users' && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 shadow-sm dark:shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Users className="h-5 w-5 text-amber-500" />
                <span>Platform Users & Roles</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Real-time user directory fetched directly from Firebase Authentication and Firestore DB
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => refreshPlatformUsers()}
                disabled={loadingUsers}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                <Loader2 className={`h-3.5 w-3.5 ${loadingUsers ? 'animate-spin text-amber-500' : ''}`} />
                <span>Refresh DB</span>
              </button>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 rounded-xl">
                Only seran7869@gmail.com has Administrator Access
              </span>
            </div>
          </div>

          {/* Visual Firebase Database Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Total Platform Users
                </p>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {dbUsers.length}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Fetched from Firebase Auth & DB
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Total Problems Solved
                </p>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {dbUsers.reduce((sum, u) => sum + ((u.solvedCount?.easy || 0) + (u.solvedCount?.medium || 0) + (u.solvedCount?.hard || 0)), 0)}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Accepted submissions across users
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  Active Roles Breakdown
                </p>
                <p className="text-2xl sm:text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-1">
                  {dbUsers.filter(u => (u.email || '').trim().toLowerCase() === 'seran7869@gmail.com' || u.role === 'admin').length} Admin / {dbUsers.filter(u => (u.email || '').trim().toLowerCase() !== 'seran7869@gmail.com' && u.role !== 'admin').length} Users
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Role-based permissions active
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <ShieldAlert className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
              <thead className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Solved</th>
                  <th className="py-3 px-4 text-right">Actions / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800/60">
                {loadingUsers ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                        <span>Loading platform users from Firestore DB...</span>
                      </div>
                    </td>
                  </tr>
                ) : dbUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No users found in database.
                    </td>
                  </tr>
                ) : (
                  dbUsers.map((u, index) => {
                    const isAdmin = (u.email || '').trim().toLowerCase() === 'seran7869@gmail.com';
                    const totalSolved = u.solvedCount
                      ? (u.solvedCount.easy || 0) + (u.solvedCount.medium || 0) + (u.solvedCount.hard || 0)
                      : 0;

                    return (
                      <tr key={u.uid || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {u.displayName || u.email.split('@')[0] || 'Platform User'}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                              {u.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`rounded px-2.5 py-0.5 font-bold uppercase text-xs border ${
                              isAdmin
                                ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/20 text-amber-700 dark:text-amber-300'
                                : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300'
                            }`}
                          >
                            {isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                          {totalSolved}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-semibold text-gray-600 dark:text-gray-400">
                            {isAdmin ? 'Primary Administrator' : 'Active User'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Problem Modal */}
      {editingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Problem: {editingProblem.title}</h3>
              <button
                onClick={() => setEditingProblem(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Difficulty</label>
                  <select
                    value={editForm.difficulty || 'Medium'}
                    onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Acceptance Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.acceptanceRate !== undefined ? editForm.acceptanceRate : 65}
                    onChange={(e) => setEditForm({ ...editForm, acceptanceRate: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Constraints (one per line)</label>
                  <textarea
                    rows={3}
                    value={editForm.constraintsString || ''}
                    onChange={(e) => setEditForm({ ...editForm, constraintsString: e.target.value })}
                    className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Status</label>
                  <select
                    value={editForm.status || 'published'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Topic Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editForm.tagsString || ''}
                    onChange={(e) => setEditForm({ ...editForm, tagsString: e.target.value })}
                    className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Company Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editForm.companyTagsString || ''}
                    onChange={(e) => setEditForm({ ...editForm, companyTagsString: e.target.value })}
                    className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Time Limit (ms)</label>
                  <input
                    type="number"
                    value={editForm.timeLimitMs || 2000}
                    onChange={(e) => setEditForm({ ...editForm, timeLimitMs: parseInt(e.target.value, 10) || 2000 })}
                    className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Memory Limit (MB)</label>
                  <input
                    type="number"
                    value={editForm.memoryLimitMB || 128}
                    onChange={(e) => setEditForm({ ...editForm, memoryLimitMB: parseInt(e.target.value, 10) || 128 })}
                    className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-gray-800 pt-3">
              <button
                onClick={() => setEditingProblem(null)}
                className="rounded-lg bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditModal}
                className="flex items-center space-x-1.5 rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-gray-950 hover:bg-amber-400 shadow-md transition cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Updated Problem</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
