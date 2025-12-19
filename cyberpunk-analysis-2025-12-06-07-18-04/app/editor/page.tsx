'use client';

import React, { useEffect } from 'react';
import { EditorLayout } from '@/app/components/layout';

export default function EditorPage() {
  useEffect(() => {
    // Initialize modern editor with enhanced logging
    console.log('🎬 Video Editor Pro initialized');
    console.log('✨ Modern UI loaded successfully');

    // Set up any global event listeners or initializations
    const handleKeyPress = (e: KeyboardEvent) => {
      // Global keyboard shortcuts could be handled here
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 's':
            e.preventDefault();
            console.log('💾 Save project');
            break;
          case 'z':
            e.preventDefault();
            console.log('↩️ Undo action');
            break;
          case 'y':
            e.preventDefault();
            console.log('↪️ Redo action');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      console.log('🔄 Editor page cleanup complete');
    };
  }, []);

  return (
    <div className="animate-fade-in">
      <EditorLayout />
    </div>
  );
}
