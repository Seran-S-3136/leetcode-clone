'use client';

import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase/config';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../../../shared/types';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  LogIn,
  UserPlus
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  isStandalone?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  isStandalone = false,
}) => {
  const { setUser } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);

  // Form Fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');

  // Status
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const resetMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleModeSwitch = (newMode: 'signin' | 'signup' | 'forgot') => {
    resetMessages();
    setMode(newMode);
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Try fetching user profile from Firestore
      let userProfile = null;
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          userProfile = userDoc.data() as any;
        }
      } catch (err: any) {
        if (!err?.message?.includes('offline')) {
          console.debug('Could not read user profile doc, using default info:', err);
        }
      }

      const isAdminEmail =
        (firebaseUser.email || email || '').trim().toLowerCase() === 'seran7869@gmail.com';

      const currentProfile: UserProfile = userProfile || {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: firebaseUser.displayName || email.split('@')[0],
        role: isAdminEmail ? ('admin' as const) : ('user' as const),
        solvedCount: { easy: 0, medium: 0, hard: 0 },
        streak: 1,
        acceptanceRate: 100,
        createdAt: new Date().toISOString(),
      };

      currentProfile.role = isAdminEmail ? 'admin' : 'user';

      setUser(currentProfile);
      setSuccessMsg('Signed in successfully!');
      setTimeout(() => {
        onClose();
        if (isAdminEmail) {
          window.location.href = '/admin';
        }
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!displayName.trim()) {
      setErrorMsg('Please enter your full name or display name.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: displayName.trim(),
      });

      // Send Verification Email
      try {
        await sendEmailVerification(firebaseUser);
      } catch (verErr) {
        console.warn('Verification email send warning:', verErr);
      }

      const isAdminEmail =
        (firebaseUser.email || email || '').toLowerCase() === 'seran7869@gmail.com';

      // Create initial user document in Firestore
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: displayName.trim(),
        role: isAdminEmail ? ('admin' as const) : ('user' as const),
        solvedCount: { easy: 0, medium: 0, hard: 0 },
        streak: 1,
        acceptanceRate: 100,
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
      } catch (dbErr) {
        console.warn('Firestore write warning during registration:', dbErr);
      }

      setUser(newProfile);
      setSuccessMsg('Account created! A verification email has been sent to your address.');
      setTimeout(() => {
        onClose();
        if (isAdminEmail) {
          window.location.href = '/admin';
        }
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim()) {
      setErrorMsg('Please enter your email address to reset password.');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg('Password reset link sent! Check your email inbox.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  // Google & GitHub OAuth Handler
  const handleOAuthSignIn = async (providerName: 'google' | 'github') => {
    resetMessages();
    setLoading(true);

    const provider =
      providerName === 'google'
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      let userProfileDoc: UserProfile | null = null;
      try {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          userProfileDoc = docSnap.data() as UserProfile;
        }
      } catch (err: any) {
        if (!err?.message?.includes('offline')) {
          console.debug('Could not read user profile doc during OAuth:', err);
        }
      }

      const isAdminEmail =
        (firebaseUser.email || '').toLowerCase() === 'seran7869@gmail.com';

      const currentProfile: UserProfile = userProfileDoc || {
        uid: firebaseUser.uid,
        email: firebaseUser.email || `${firebaseUser.uid}@codearena.dev`,
        displayName:
          firebaseUser.displayName ||
          (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Developer'),
        role: isAdminEmail ? ('admin' as const) : ('user' as const),
        solvedCount: { easy: 0, medium: 0, hard: 0 },
        streak: 1,
        acceptanceRate: 100,
        createdAt: new Date().toISOString(),
      };

      currentProfile.role = isAdminEmail ? 'admin' : 'user';

      if (!userProfileDoc) {
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), currentProfile);
        } catch (dbErr) {
          console.warn('Could not create Firestore doc during OAuth:', dbErr);
        }
      }

      setUser(currentProfile);
      setSuccessMsg(`Signed in with ${providerName === 'google' ? 'Google' : 'GitHub'}!`);
      setTimeout(() => {
        onClose();
        if (isAdminEmail) {
          window.location.href = '/admin';
        }
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to sign in with ${providerName === 'google' ? 'Google' : 'GitHub'}.`);
    } finally {
      setLoading(false);
    }
  };

  const cardContent = (
    <div className="w-full max-w-md max-h-[92vh] flex flex-col rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden relative my-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-gray-950/50">
        <div className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {mode === 'signin' ? (
              <LogIn className="h-5 w-5" />
            ) : mode === 'signup' ? (
              <UserPlus className="h-5 w-5" />
            ) : (
              <KeyRound className="h-5 w-5" />
            )}
          </div>
          <h2 className="text-base font-extrabold text-white">
            {mode === 'signin'
              ? 'Sign In to CodeArena'
              : mode === 'signup'
              ? 'Create Your Account'
              : 'Reset Password'}
          </h2>
        </div>

        {!isStandalone && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

        {/* Tab Selector */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 border-b border-gray-800 bg-gray-950/30">
            <button
              type="button"
              onClick={() => handleModeSwitch('signin')}
              className={`py-3 text-xs font-bold transition border-b-2 ${
                mode === 'signin'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('signup')}
              className={`py-3 text-xs font-bold transition border-b-2 ${
                mode === 'signup'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 flex items-start space-x-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-start space-x-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode !== 'forgot' && (
            <div className="mb-6 space-y-3">
              <button
                type="button"
                onClick={() => handleOAuthSignIn('google')}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 rounded-xl border border-gray-700 bg-gray-800/80 hover:bg-gray-800 px-4 py-2.5 text-xs font-bold text-gray-100 transition shadow-sm disabled:opacity-50"
              >
                {/* Official Google Icon SVG */}
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.3 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 10.4 0 12s.6 3 1.6 5l3.7-2.2z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.2L1.6 15.9C3.5 19.7 7.4 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn('github')}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 rounded-xl border border-gray-700 bg-gray-950 hover:bg-black px-4 py-2.5 text-xs font-bold text-gray-100 transition shadow-sm disabled:opacity-50"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-800"></div>
                <span className="flex-shrink mx-3 text-[10px] font-extrabold tracking-wider uppercase text-gray-500">
                  Or continue with email
                </span>
                <div className="flex-grow border-t border-gray-800"></div>
              </div>
            </div>
          )}

          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-950 pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('forgot')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-950 pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-gray-950 hover:bg-amber-400 disabled:opacity-50 transition shadow-lg shadow-amber-500/20"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Sign In</span>
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivers"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-950 pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-950 pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Password (at least 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-950 pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-gray-950 hover:bg-amber-400 disabled:opacity-50 transition shadow-lg shadow-amber-500/20"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Create Account</span>
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-gray-400">
                Enter the email associated with your account and we will send you a password reset link.
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-950 pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signin')}
                  className="flex-1 rounded-xl border border-gray-700 bg-gray-800 py-2.5 text-xs font-semibold text-gray-300 hover:bg-gray-700"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-gray-950 hover:bg-amber-400 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Send Reset Link</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
  );

  if (isStandalone) {
    return <div className="w-full flex items-center justify-center my-auto py-4">{cardContent}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      {cardContent}
    </div>
  );
};
