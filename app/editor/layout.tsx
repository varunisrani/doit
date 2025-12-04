import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Editor - DoIt',
  description: 'Browser-based video editor built with Next.js',
};

export default function EditorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
