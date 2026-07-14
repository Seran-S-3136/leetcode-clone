'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Lock, LogIn, UserPlus } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user } = useApp();

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-50 dark:bg-gray-950 p-4 transition-colors">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/90 p-8 text-center shadow-lg dark:shadow-2xl backdrop-blur-md">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shadow-sm">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="mb-2 text-xl font-extrabold text-gray-900 dark:text-white">
            Authentication Required
          </h2>
          <p className="mb-6 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Please sign in or register an account to access the LeetCode problem library, sandboxed code editor, and dashboard.
          </p>

          <div className="flex flex-col space-y-3">
            <Link
              href="/login"
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold text-gray-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In to Continue</span>
            </Link>

            <Link
              href="/register"
              className="w-full flex items-center justify-center space-x-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-xs font-bold text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-750 transition"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
