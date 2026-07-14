'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import {
  Code2,
  Sun,
  Moon,
  ShieldAlert,
  User,
  LogOut,
  CheckCircle2,
  Terminal,
  LayoutDashboard,
  KeyRound
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

export const Navbar: React.FC = () => {
  const { user, logout, toggleRole, theme, toggleTheme } = useApp();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

  const navLinks = [
    { label: 'Problems', href: '/problems' },
    { label: 'Contest', href: '/contest' },
    { label: 'Discuss', href: '/discuss' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/80 backdrop-blur-md transition-colors duration-200 shadow-xs">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-gray-950 shadow-lg shadow-orange-500/20 transition-transform duration-300 group-hover:scale-105">
              <Code2 className="h-5 w-5 font-bold stroke-[2.5]" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
              Code<span className="text-amber-600 dark:text-amber-400">Arena</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gray-200/80 dark:bg-gray-800 text-gray-900 dark:text-white shadow-inner font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {user && (user.email || '').trim().toLowerCase() === 'seran7869@gmail.com' && (
              <Link
                href="/admin"
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                  pathname.startsWith('/admin')
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Admin Studio</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center space-x-3">
          {/* Role Display Badge */}
          {user && (
            <div
              className={`hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                (user.email || '').trim().toLowerCase() === 'seran7869@gmail.com'
                  ? 'border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300'
                  : 'border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300'
              }`}
            >
              <KeyRound className="h-3 w-3" />
              <span className="capitalize">
                Role: {(user.email || '').trim().toLowerCase() === 'seran7869@gmail.com' ? 'Admin' : 'User'}
              </span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            )}
          </button>

          {/* Profile Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-1 pl-3.5 transition-all shadow-xs hover:border-amber-500 dark:hover:border-gray-600"
              >
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {user.displayName}
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-xs font-bold text-gray-950">
                  {user.displayName.charAt(0)}
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/95 p-2 shadow-2xl backdrop-blur-lg">
                  <div className="border-b border-gray-200 dark:border-gray-800 px-3 py-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Signed in as</p>
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="mt-1 flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  >
                    <LayoutDashboard className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>User Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-gray-950 hover:bg-amber-400 transition shadow-md shadow-amber-500/20"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Firebase Authentication Modal */}
      <AuthModal
        isOpen={Boolean(authModal)}
        onClose={() => setAuthModal(null)}
        initialMode={authModal === 'register' ? 'signup' : 'signin'}
      />
    </header>
  );
};
