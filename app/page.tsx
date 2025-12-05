'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to editor page
    const timer = setTimeout(() => {
      router.push('/editor');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="high-contrast-panel p-8 text-center max-w-lg w-full">
        {/* High Contrast Logo */}
        <div className="mb-6">
          <div className="w-16 h-16 high-contrast-button rounded flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Large, Clear Typography - No subtle gradients */}
        <h1 className="high-contrast-text-large mb-4 text-primary tracking-tight">
          Video Editor Pro
        </h1>
        <p className="high-contrast-text mb-8 text-secondary">
          High Contrast Accessibility Video Editing Suite
        </p>

        {/* Large Clear Status Messages */}
        <div className="space-y-4 mb-8">
          <div className="status-message high-contrast-status">
            <span className="text-lg font-bold">System Status: READY</span>
          </div>
          <div className="status-message high-contrast-status">
            <span className="text-lg font-bold">Editor Engine: INITIALIZING</span>
          </div>
          <div className="status-message high-contrast-status warning">
            <span className="text-lg font-bold">Media Pipeline: LOADING</span>
          </div>
        </div>

        {/* Clear Progress Indicator - High Contrast */}
        <div className="w-full bg-background border-2 border-white rounded h-4 overflow-hidden">
          <div 
            className="h-full transition-all duration-3000 ease-linear" 
            style={{ 
              width: '33%',
              backgroundColor: 'var(--primary)' // Yellow progress bar
            }}
          ></div>
        </div>

        <div className="mt-6 high-contrast-text text-lg font-semibold text-secondary">
          Professional accessibility tools loading...
        </div>
      </div>
    </div>
  );
}
