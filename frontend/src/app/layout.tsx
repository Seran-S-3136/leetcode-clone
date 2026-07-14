import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CodeArena — Practice Algorithm & Interview Coding Problems',
  description: 'Full-stack production-ready coding interview platform featuring Monaco Editor, fast sandboxed code execution, real-time terminal, and role-based Admin Studio.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-gray-950 text-gray-100 min-h-screen flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200 transition-colors duration-200`}>
        <AppProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
