'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Problem, UserProfile, Submission } from '../../../shared/types';
import { FIRST_50_LEETCODE_PROBLEMS } from '../../../shared/problemsData';
import { auth, db, isDemoMode } from '../lib/firebase/config';

const SEED_PROBLEMS_FRONTEND: Problem[] = FIRST_50_LEETCODE_PROBLEMS;

const sortProblemsAscending = (list: Problem[]): Problem[] => {
  return [...list].sort((a, b) => {
    const numA = parseInt((a.title.match(/^(\d+)\./) || [])[1] || a.title, 10);
    const numB = parseInt((b.title.match(/^(\d+)\./) || [])[1] || b.title, 10);
    if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
      return numA - numB;
    }
    return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
  });
};

const DEFAULT_USER: UserProfile = {
  uid: 'demo-user-001',
  email: 'alex.developer@example.com',
  displayName: 'Alex Rivers',
  role: 'admin', // Default to admin so user can test admin dashboard AND user workflow immediately
  solvedCount: {
    easy: 18,
    medium: 12,
    hard: 4,
  },
  streak: 7,
  acceptanceRate: 68.4,
  createdAt: new Date().toISOString(),
};

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  logout: () => Promise<void>;
  toggleRole: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  problems: Problem[];
  addProblem: (problem: Problem) => void;
  updateProblem: (id: string, updated: Partial<Problem>) => void;
  deleteProblem: (id: string) => void;
  solvedProblems: Set<string>;
  addSolvedProblem: (problemId: string) => void;
  submissions: Submission[];
  addSubmission: (submission: Submission) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initially un-signed in / unregistered state
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [deletedProblemIds, setDeletedProblemIds] = useState<Set<string>>(new Set<string>());
  const [problems, setProblems] = useState<Problem[]>(SEED_PROBLEMS_FRONTEND);
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set<string>());
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    // Listen to Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Load user-specific solved problems
        const userSolvedKey = `leetcode_solved_problem_ids_${firebaseUser.uid}`;
        const savedSolved = localStorage.getItem(userSolvedKey);
        if (savedSolved) {
          try {
            setSolvedProblems(new Set(JSON.parse(savedSolved)));
          } catch {
            setSolvedProblems(new Set<string>());
          }
        } else {
          setSolvedProblems(new Set<string>());
        }

        // Load user-specific submissions
        const userSubmissionsKey = `leetcode_submissions_${firebaseUser.uid}`;
        const savedSubmissions = localStorage.getItem(userSubmissionsKey);
        if (savedSubmissions) {
          try {
            setSubmissions(JSON.parse(savedSubmissions));
          } catch {
            setSubmissions([]);
          }
        } else {
          setSubmissions([]);
        }

        const isAdminEmail =
          (firebaseUser.email || '').trim().toLowerCase() === 'seran7869@gmail.com';

        const cacheKey = `leetcode_user_profile_${firebaseUser.uid}`;
        const cachedProfileStr = localStorage.getItem(cacheKey);
        let fallbackProfile: UserProfile = cachedProfileStr
          ? JSON.parse(cachedProfileStr)
          : {
              uid: firebaseUser.uid,
              email: firebaseUser.email || 'user@codearena.dev',
              displayName: firebaseUser.displayName || 'Developer',
              role: isAdminEmail ? 'admin' : 'user',
              solvedCount: { easy: 0, medium: 0, hard: 0 },
              streak: 1,
              acceptanceRate: 100,
              createdAt: new Date().toISOString(),
            };

        fallbackProfile.role = isAdminEmail ? 'admin' : 'user';
        setUserState(fallbackProfile);

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            data.role = isAdminEmail ? 'admin' : 'user';
            setUserState(data);
            localStorage.setItem(cacheKey, JSON.stringify(data));
            setDoc(doc(db, 'users', firebaseUser.uid), {
              role: data.role,
              email: fallbackProfile.email,
              displayName: fallbackProfile.displayName || data.displayName || 'Developer',
            }, { merge: true }).catch(() => {});
          } else {
            setUserState(fallbackProfile);
            localStorage.setItem(cacheKey, JSON.stringify(fallbackProfile));
            await setDoc(doc(db, 'users', firebaseUser.uid), fallbackProfile, { merge: true }).catch(() => {});
          }
        } catch (err: any) {
          if (!err?.message?.includes('offline')) {
            console.debug('Firestore profile read fallback to cache:', err?.message || err);
          }
        }
      } else {
        setUserState(null);
        setSolvedProblems(new Set<string>());
        setSubmissions([]);
      }
    });

    // Load persisted theme & state from localStorage
    const savedTheme = localStorage.getItem('leetcode_theme') as 'dark' | 'light';
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }

    let loadedDeletedSet = new Set<string>();
    const savedDel = localStorage.getItem('leetcode_deleted_problem_ids');
    if (savedDel) {
      try {
        loadedDeletedSet = new Set(JSON.parse(savedDel));
        setDeletedProblemIds(loadedDeletedSet);
      } catch {}
    }

    const savedCustom = localStorage.getItem('leetcode_custom_problems');
    if (savedCustom) {
      try {
        const customList: Problem[] = JSON.parse(savedCustom);
        const seedIds = new Set(SEED_PROBLEMS_FRONTEND.map((p) => p.id));
        const uniqueCustom = customList.filter((c) => !seedIds.has(c.id) && !loadedDeletedSet.has(c.id) && !loadedDeletedSet.has(c.slug));
        const activeSeeds = SEED_PROBLEMS_FRONTEND.filter((sp) => !loadedDeletedSet.has(sp.id) && !loadedDeletedSet.has(sp.slug));
        setProblems([...uniqueCustom, ...activeSeeds]);
      } catch {}
    } else if (loadedDeletedSet.size > 0) {
      setProblems(SEED_PROBLEMS_FRONTEND.filter((sp) => !loadedDeletedSet.has(sp.id) && !loadedDeletedSet.has(sp.slug)));
    }

    const savedSubmissions = localStorage.getItem('leetcode_submissions');
    if (savedSubmissions) {
      try {
        setSubmissions(JSON.parse(savedSubmissions));
      } catch {
        // ignore
      }
    }

    // Fetch from backend API (bypasses Firestore client security rules via Admin SDK)
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/problems`)
      .then((res) => res.ok ? res.json() : null)
      .then((apiProblems: Problem[] | null) => {
        if (apiProblems && Array.isArray(apiProblems) && apiProblems.length > 0) {
          setProblems((prev) => {
            const apiMap = new Map(apiProblems.map((p) => [p.id, p]));
            const combined: Problem[] = apiProblems.filter((p) => !deletedProblemIds.has(p.id) && !deletedProblemIds.has(p.slug));
            prev.forEach((p) => {
              const isSeed = SEED_PROBLEMS_FRONTEND.some((sp) => sp.id === p.id || sp.slug === p.id || sp.id === p.slug || sp.slug === p.slug);
              if (!isSeed && !apiMap.has(p.id) && !deletedProblemIds.has(p.id) && !deletedProblemIds.has(p.slug)) {
                combined.push(p);
              }
            });
            return sortProblemsAscending(combined);
          });
        }
      })
      .catch(() => {});

    // Listen for real-time problem additions and updates from Admin in Firestore DB
    const unsubscribeProblems = onSnapshot(
      collection(db, 'problems'),
      (snapshot) => {
        const dbProblems: Problem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Problem;
          if (data && data.title && !deletedProblemIds.has(data.id) && !deletedProblemIds.has(data.slug) && !deletedProblemIds.has(docSnap.id)) {
            dbProblems.push(data);
          }
        });

        setProblems((prev) => {
          const dbMap = new Map(dbProblems.map((p) => [p.id, p]));
          const combined: Problem[] = [...dbProblems];

          if (dbProblems.length === 0) {
            // Only fall back to seeds & local custom problems if Firestore is completely empty/offline
            prev.forEach((p) => {
              if (!dbMap.has(p.id) && !SEED_PROBLEMS_FRONTEND.some((sp) => sp.id === p.id) && !deletedProblemIds.has(p.id) && !deletedProblemIds.has(p.slug)) {
                combined.push(p);
              }
            });

            SEED_PROBLEMS_FRONTEND.forEach((sp) => {
              if (!dbMap.has(sp.id) && !deletedProblemIds.has(sp.id) && !deletedProblemIds.has(sp.slug)) {
                combined.push(sp);
              }
            });
          } else {
            // Firestore is active and seeded: respect exact database state, only preserve locally created custom problems that are pending sync
            prev.forEach((p) => {
              const isSeed = SEED_PROBLEMS_FRONTEND.some((sp) => sp.id === p.id || sp.slug === p.id || sp.id === p.slug || sp.slug === p.slug);
              if (!isSeed && !dbMap.has(p.id) && !deletedProblemIds.has(p.id) && !deletedProblemIds.has(p.slug)) {
                combined.push(p);
              }
            });
          }

          const customOnly = combined.filter((c) => !SEED_PROBLEMS_FRONTEND.some((sp) => sp.id === c.id));
          localStorage.setItem('leetcode_custom_problems', JSON.stringify(customOnly));
          return sortProblemsAscending(combined);
        });
      },
      (error) => {
        console.debug('Firestore problems listener fallback:', error);
      }
    );

    return () => {
      unsubscribe();
      unsubscribeProblems();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
    setUserState(null);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('leetcode_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser);
  };

  const toggleRole = () => {
    if (!user) return;
    const isAuthorizedAdmin = (user.email || '').trim().toLowerCase() === 'seran7869@gmail.com';
    if (!isAuthorizedAdmin) return;
    setUserState({
      ...user,
      role: user.role === 'admin' ? 'user' : 'admin',
    });
  };

  const saveCustomProblemsToStorage = (updatedList: Problem[]) => {
    const seedIds = new Set(SEED_PROBLEMS_FRONTEND.map((p) => p.id));
    const customOnly = updatedList.filter((c) => !seedIds.has(c.id));
    if (typeof window !== 'undefined') {
      localStorage.setItem('leetcode_custom_problems', JSON.stringify(customOnly));
    }
  };

  const addProblem = (problem: Problem) => {
    // Remove from deleted set if re-adding a previously deleted problem
    if (deletedProblemIds.has(problem.id || '') || deletedProblemIds.has(problem.slug || '')) {
      const nextDeleted = new Set(deletedProblemIds);
      if (problem.id) nextDeleted.delete(problem.id);
      if (problem.slug) nextDeleted.delete(problem.slug);
      setDeletedProblemIds(nextDeleted);
      if (typeof window !== 'undefined') {
        localStorage.setItem('leetcode_deleted_problem_ids', JSON.stringify(Array.from(nextDeleted)));
      }
    }

    setProblems((prev) => {
      const updated = [problem, ...prev.filter(p => p.id !== problem.id && p.slug !== problem.slug)];
      saveCustomProblemsToStorage(updated);
      return sortProblemsAscending(updated);
    });
    setDoc(doc(db, 'problems', problem.id || problem.slug), problem, { merge: true }).catch(() => {});
    if (problem.slug && problem.slug !== problem.id) {
      setDoc(doc(db, 'problems', problem.slug), problem, { merge: true }).catch(() => {});
    }
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/problems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problem),
    }).catch(() => {});
  };

  const updateProblem = (id: string, updated: Partial<Problem>) => {
    const targetProb = problems.find((p) => p.id === id || p.slug === id);
    const targetId = targetProb?.id || id;
    const targetSlug = targetProb?.slug || id;

    setProblems((prev) => {
      const updatedList = prev.map((p) => (p.id === targetId || p.slug === targetSlug ? { ...p, ...updated } : p));
      saveCustomProblemsToStorage(updatedList);
      return sortProblemsAscending(updatedList);
    });
    setDoc(doc(db, 'problems', targetId), updated, { merge: true }).catch(() => {});
    if (targetSlug !== targetId) {
      setDoc(doc(db, 'problems', targetSlug), updated, { merge: true }).catch(() => {});
    }
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/problems/${encodeURIComponent(targetId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const deleteProblem = (id: string) => {
    const probToDelete = problems.find((p) => p.id === id || p.slug === id);
    const delId = probToDelete?.id || id;
    const delSlug = probToDelete?.slug || id;

    // Add to local deleted set & localStorage to block any resurrection
    const nextDeleted = new Set(deletedProblemIds);
    nextDeleted.add(delId);
    nextDeleted.add(delSlug);
    setDeletedProblemIds(nextDeleted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('leetcode_deleted_problem_ids', JSON.stringify(Array.from(nextDeleted)));
    }

    setProblems((prev) => {
      const updatedList = prev.filter((p) => p.id !== delId && p.slug !== delId && p.id !== delSlug && p.slug !== delSlug);
      saveCustomProblemsToStorage(updatedList);
      return sortProblemsAscending(updatedList);
    });

    // Delete from Firestore DB by both id and slug to guarantee immediate database cleanup
    deleteDoc(doc(db, 'problems', delId)).catch(() => {});
    if (delSlug && delSlug !== delId) {
      deleteDoc(doc(db, 'problems', delSlug)).catch(() => {});
    }

    // Delete via Backend API
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/problems/${encodeURIComponent(delId)}`, {
      method: 'DELETE',
    }).catch(() => {});
    if (delSlug && delSlug !== delId) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/problems/${encodeURIComponent(delSlug)}`, {
        method: 'DELETE',
      }).catch(() => {});
    }
  };

  // Keep user profile solvedCount perfectly synchronized with actual unique accepted submissions & solved problems set
  useEffect(() => {
    if (!user || problems.length === 0) return;

    const acceptedIds = new Set<string>(Array.from(solvedProblems));
    submissions.forEach((s) => {
      if (s.status === 'Accepted' && s.problemId) {
        acceptedIds.add(s.problemId);
      }
    });

    let easy = 0, medium = 0, hard = 0;
    acceptedIds.forEach((idOrSlug) => {
      const p = problems.find((item) => item.id === idOrSlug || item.slug === idOrSlug);
      if (p) {
        if (p.difficulty === 'Easy') easy++;
        else if (p.difficulty === 'Medium') medium++;
        else if (p.difficulty === 'Hard') hard++;
      }
    });

    const currentCount = user.solvedCount || { easy: 0, medium: 0, hard: 0 };
    if (currentCount.easy !== easy || currentCount.medium !== medium || currentCount.hard !== hard) {
      const updatedProfile: UserProfile = {
        ...user,
        solvedCount: { easy, medium, hard },
      };
      setUserState(updatedProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`leetcode_user_profile_${user.uid}`, JSON.stringify(updatedProfile));
      }
      if (user.uid && user.uid !== 'demo-user-001') {
        setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true }).catch(() => {});
      }
    }
  }, [solvedProblems, submissions, problems, user?.uid]);

  const addSolvedProblem = (problemId: string) => {
    const prob = problems.find((p) => p.id === problemId || p.slug === problemId);
    const isAlreadySolved = solvedProblems.has(problemId) || (prob && (solvedProblems.has(prob.id) || solvedProblems.has(prob.slug)));

    const updatedSolvedSet = new Set(solvedProblems).add(problemId);
    if (prob) {
      updatedSolvedSet.add(prob.id).add(prob.slug);
    }
    setSolvedProblems(updatedSolvedSet);
    if (typeof window !== 'undefined') {
      const storageKey = user?.uid ? `leetcode_solved_problem_ids_${user.uid}` : 'leetcode_solved_problem_ids_anon';
      localStorage.setItem(storageKey, JSON.stringify(Array.from(updatedSolvedSet)));
    }

    if (!isAlreadySolved) {
      const difficulty = prob?.difficulty || 'Easy';

      const currentProfile: UserProfile = user || {
        uid: 'demo-user-001',
        email: 'developer@codearena.dev',
        displayName: 'Developer',
        role: 'user',
        solvedCount: { easy: 0, medium: 0, hard: 0 },
        streak: 1,
        acceptanceRate: 100,
        createdAt: new Date().toISOString(),
      };

      const updatedProfile: UserProfile = {
        ...currentProfile,
        solvedCount: {
          ...currentProfile.solvedCount,
          easy: difficulty === 'Easy' ? currentProfile.solvedCount.easy + 1 : currentProfile.solvedCount.easy,
          medium: difficulty === 'Medium' ? currentProfile.solvedCount.medium + 1 : currentProfile.solvedCount.medium,
          hard: difficulty === 'Hard' ? currentProfile.solvedCount.hard + 1 : currentProfile.solvedCount.hard,
        },
      };

      setUserState(updatedProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`leetcode_user_profile_${updatedProfile.uid}`, JSON.stringify(updatedProfile));
      }

      if (user?.uid && user.uid !== 'demo-user-001') {
        setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true }).catch(() => {
          // Silent catch when offline
        });
      }
    }
  };

  const addSubmission = (sub: Submission) => {
    setSubmissions((prev) => {
      const updated = [sub, ...prev];
      if (typeof window !== 'undefined') {
        const subKey = user?.uid ? `leetcode_submissions_${user.uid}` : 'leetcode_submissions_anon';
        localStorage.setItem(subKey, JSON.stringify(updated));
      }
      return updated;
    });
    if (sub.status === 'Accepted') {
      addSolvedProblem(sub.problemId);
    }
    if (user?.uid && user.uid !== 'demo-user-001') {
      setDoc(doc(db, 'submissions', `${user.uid}_${Date.now()}`), {
        ...sub,
        userId: user.uid,
        userEmail: user.email || 'developer@codearena.dev',
        userName: user.displayName || 'Developer',
      }, { merge: true }).catch(() => {});
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        logout,
        toggleRole,
        theme,
        toggleTheme,
        problems,
        addProblem,
        updateProblem,
        deleteProblem,
        solvedProblems,
        addSolvedProblem,
        submissions,
        addSubmission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
};
