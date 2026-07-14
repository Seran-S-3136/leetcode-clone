'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthModal } from '../../components/auth/AuthModal';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-950 flex items-center justify-center p-4 transition-colors">
      <AuthModal
        isOpen={true}
        onClose={() => router.push('/problems')}
        initialMode="signin"
        isStandalone={true}
      />
    </div>
  );
}
