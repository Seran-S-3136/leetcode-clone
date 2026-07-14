'use client';

import React from 'react';
import { MessageSquare, ThumbsUp, Eye, MessageCircle, Sparkles, Plus } from 'lucide-react';
import { AuthGuard } from '../../components/auth/AuthGuard';

export default function DiscussPage() {
  const posts = [
    {
      id: 1,
      author: 'LeetCode',
      date: 'Jun 29, 2026',
      title: 'Interview Incoming: Choose Your Build',
      snippet:
        'An interview is on the horizon. Algorithms, SQL, system design. What do you tackle first? Everyone has access to the tools. Not everyone develops the judgment to use them well.',
      votes: 30,
      views: '12.2K',
      comments: 52,
    },
    {
      id: 2,
      author: 'samantha-lc',
      date: 'Jul 01, 2026',
      title: 'LeetCode Hiring DSA Problem Developers',
      snippet:
        'Hey LeetCoders! Do you love LeetCode and have a passion for creating new coding problems? Are you also up for new challenges and have creative ideas?',
      votes: 23,
      views: '4.1K',
      comments: 11,
    },
    {
      id: 3,
      author: 'DeveloperCore',
      date: 'Jul 10, 2026',
      title: 'Dynamic Programming Patterns Roadmap (2026 Edition)',
      snippet:
        'Mastering 1D DP, 2D Grid DP, Knapsack variations, and Interval DP with detailed templates in Python and C++.',
      votes: 148,
      views: '28.5K',
      comments: 89,
    },
  ];

  return (
    <AuthGuard>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">CodeArena Community Discuss</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Share interview experiences, study plans, compensation insights, and algorithm roadmaps.
            </p>
          </div>

          <button className="flex items-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg">
            <Plus className="h-4 w-4" />
            <span>Create Topic</span>
          </button>
        </div>

        {/* Category Tabs matching Screenshot 4 */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
          {['For You', 'Career', 'Contest', 'Compensation', 'Feedback', 'Interview'].map(
            (tab, i) => (
              <button
                key={tab}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  i === 0
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 transition hover:border-gray-300 dark:hover:border-gray-700 shadow-sm"
            >
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-bold text-amber-600 dark:text-amber-400">{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
              </div>

              <h2 className="text-lg font-bold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer">
                {post.title}
              </h2>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {post.snippet}
              </p>

              <div className="mt-4 flex items-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1.5">
                  <ThumbsUp className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                  <span>{post.votes}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
