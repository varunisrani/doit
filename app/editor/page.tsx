'use client';

import React, { useEffect } from 'react';
import { EditorLayout } from '@/app/components/layout';

export default function EditorPage() {
  useEffect(() => {
    // Initialize stores here when they're ready
    console.log('Editor page initialized');
  }, []);

  return <EditorLayout />;
}
