'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Input } from '../ui/Input';
import { ProjectModal } from '../modals/ProjectModal';
import { useEditorStore } from '@/app/lib/store/editorStore';
import { useAutoSave } from '@/app/hooks/useAutoSave';
import {
  Menu,
  FileText,
  FolderOpen,
  Save,
  Undo2,
  Redo2,
  Scissors,
  Copy,
  ClipboardPaste,
  Download,
  Settings,
  HelpCircle,
  Search,
  Bell,
  User,
  Moon,
  Sun,
  Keyboard,
  Share2,
  Folder,
  Film,
  Image as ImageIcon,
  FilePlus,
  Circle,
} from 'lucide-react';

interface MenuItem {
  label?: string;
  icon?: React.ReactNode;
  action?: () => void;
  shortcut?: string;
  divider?: boolean;
  danger?: boolean;
}

interface NavMenuProps {
  title: string;
  items: MenuItem[];
}

const NavMenu: React.FC<NavMenuProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-[var(--surface-elevated)] border border-[var(--border-primary)] rounded-lg shadow-[var(--shadow-lg)] z-50 overflow-hidden">
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div key={index} className="h-px bg-[var(--border-primary)] my-1" />
              );
            }

            return (
              <button
                key={index}
                className={`w-full px-3 py-2 text-sm flex items-center justify-between gap-3 transition-colors ${
                  item.danger
                    ? 'text-[var(--error)] hover:bg-[var(--error-bg)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                }`}
                onClick={() => {
                  item.action?.();
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 text-[var(--text-secondary)]">{item.icon}</div>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-xs px-1.5 py-0.5 bg-[var(--surface)] rounded text-[var(--text-tertiary)] font-mono">
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Header: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [projectModalMode, setProjectModalMode] = useState<'new' | 'open' | 'save' | 'saveAs' | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Get project state
  const { metadata, hasUnsavedChanges, setSidebarVisible, setPropertiesVisible, sidebarVisible, propertiesVisible } = useEditorStore();
  const { saveNow } = useAutoSave();

  // Close search on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
      if (e.key === '/' && !searchOpen && e.ctrlKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Keyboard shortcuts for file operations
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            setProjectModalMode('new');
            break;
          case 'o':
            e.preventDefault();
            setProjectModalMode('open');
            break;
          case 's':
            e.preventDefault();
            if (e.shiftKey) {
              setProjectModalMode('saveAs');
            } else if (metadata.id) {
              saveNow();
            } else {
              setProjectModalMode('save');
            }
            break;
          case 'b':
            e.preventDefault();
            setSidebarVisible(!sidebarVisible);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, metadata.id, saveNow, setSidebarVisible, sidebarVisible]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSave = async () => {
    if (metadata.id) {
      await saveNow();
    } else {
      setProjectModalMode('save');
    }
  };

  const fileMenuItems: MenuItem[] = [
    {
      label: 'New Project',
      icon: <FilePlus className="w-4 h-4" />,
      action: () => setProjectModalMode('new'),
      shortcut: 'Ctrl+N',
    },
    {
      label: 'Open Project',
      icon: <FolderOpen className="w-4 h-4" />,
      action: () => setProjectModalMode('open'),
      shortcut: 'Ctrl+O',
    },
    {
      label: 'Save Project',
      icon: <Save className="w-4 h-4" />,
      action: handleSave,
      shortcut: 'Ctrl+S',
    },
    {
      label: 'Save As...',
      icon: <FileText className="w-4 h-4" />,
      action: () => setProjectModalMode('saveAs'),
      shortcut: 'Ctrl+Shift+S',
    },
    { divider: true },
    {
      label: 'Import Media',
      icon: <Folder className="w-4 h-4" />,
      action: () => console.log('Import media'),
      shortcut: 'Ctrl+I',
    },
    {
      label: 'Export Video',
      icon: <Download className="w-4 h-4" />,
      action: () => console.log('Export video'),
      shortcut: 'Ctrl+E',
    },
    { divider: true },
    {
      label: 'Share Project',
      icon: <Share2 className="w-4 h-4" />,
      action: () => console.log('Share project'),
    },
  ];

  const editMenuItems: MenuItem[] = [
    {
      label: 'Undo',
      icon: <Undo2 className="w-4 h-4" />,
      action: () => console.log('Undo'),
      shortcut: 'Ctrl+Z',
    },
    {
      label: 'Redo',
      icon: <Redo2 className="w-4 h-4" />,
      action: () => console.log('Redo'),
      shortcut: 'Ctrl+Y',
    },
    { divider: true },
    {
      label: 'Cut',
      icon: <Scissors className="w-4 h-4" />,
      action: () => console.log('Cut'),
      shortcut: 'Ctrl+X',
    },
    {
      label: 'Copy',
      icon: <Copy className="w-4 h-4" />,
      action: () => console.log('Copy'),
      shortcut: 'Ctrl+C',
    },
    {
      label: 'Paste',
      icon: <ClipboardPaste className="w-4 h-4" />,
      action: () => console.log('Paste'),
      shortcut: 'Ctrl+V',
    },
  ];

  const viewMenuItems: MenuItem[] = [
    {
      label: sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar',
      icon: <Menu className="w-4 h-4" />,
      action: () => setSidebarVisible(!sidebarVisible),
      shortcut: 'Ctrl+B',
    },
    {
      label: propertiesVisible ? 'Hide Properties' : 'Show Properties',
      icon: <Settings className="w-4 h-4" />,
      action: () => setPropertiesVisible(!propertiesVisible),
      shortcut: 'Ctrl+P',
    },
    { divider: true },
    {
      label: 'Keyboard Shortcuts',
      icon: <Keyboard className="w-4 h-4" />,
      action: () => console.log('Show shortcuts'),
      shortcut: '?',
    },
  ];

  const helpMenuItems: MenuItem[] = [
    {
      label: 'Documentation',
      icon: <HelpCircle className="w-4 h-4" />,
      action: () => console.log('Open documentation'),
    },
    {
      label: 'Video Tutorials',
      icon: <Film className="w-4 h-4" />,
      action: () => console.log('Open tutorials'),
    },
    { divider: true },
    {
      label: 'Send Feedback',
      icon: <ImageIcon className="w-4 h-4" />,
      action: () => console.log('Send feedback'),
    },
    {
      label: 'About',
      icon: <FileText className="w-4 h-4" />,
      action: () => console.log('Show about'),
    },
  ];

  const userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      action: () => console.log('Open profile'),
    },
    {
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      action: () => console.log('Open settings'),
    },
    { divider: true },
    {
      label: 'Sign Out',
      icon: <Save className="w-4 h-4" />,
      action: () => console.log('Sign out'),
      danger: true,
    },
  ];

  return (
    <>
      <header className="h-16 bg-[var(--surface-elevated)] border-b border-[var(--border-primary)] flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-xl">
        {/* Left Section: Logo and Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => console.log('Home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-200">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[var(--text-primary)]">
                  {metadata.name || 'Video Editor Pro'}
                </h1>
                {hasUnsavedChanges && (
                  <Circle className="w-2 h-2 fill-[var(--warning)] text-[var(--warning)]" />
                )}
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">
                {metadata.id ? 'Saved' : 'Unsaved'} · Professional Editing Suite
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavMenu title="File" items={fileMenuItems} />
            <NavMenu title="Edit" items={editMenuItems} />
            <NavMenu title="View" items={viewMenuItems} />
            <NavMenu title="Help" items={helpMenuItems} />
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <IconButton
              icon={<Menu className="w-4 h-4" />}
              variant="ghost"
              size="sm"
              tooltip="Main Menu"
              onClick={() => console.log('Open mobile menu')}
            />
          </div>
        </div>

        {/* Center Section: Search */}
        <div className="flex-1 max-w-md mx-4 md:mx-8">
          {searchOpen ? (
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search files, effects, commands... (Ctrl+/)"
              leftIcon={<Search className="w-4 h-4" />}
              variant="default"
              size="md"
              fullWidth
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-4 h-4 mr-2" />
              Search (Ctrl+/)
            </Button>
          )}
        </div>

        {/* Right Section: Actions and User */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <div className="hidden sm:flex items-center gap-1">
            <IconButton
              icon={darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              variant="ghost"
              size="sm"
              tooltip={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              onClick={() => setDarkMode(!darkMode)}
            />
            <div className="relative">
              <IconButton
                icon={<Bell className="w-4 h-4" />}
                variant="ghost"
                size="sm"
                tooltip="Notifications"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--error)] text-[var(--text-inverse)] text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </div>
          </div>

          {/* Save Button */}
          <Button
            variant={hasUnsavedChanges ? 'primary' : 'secondary'}
            size="sm"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSave}
            className="hidden sm:flex"
          >
            {hasUnsavedChanges ? 'Save' : 'Saved'}
          </Button>

          {/* Export Button */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => console.log('Export video')}
            className="hidden sm:flex"
          >
            Export
          </Button>

          {/* Mobile Export */}
          <IconButton
            icon={<Download className="w-4 h-4" />}
            variant="primary"
            size="sm"
            tooltip="Export Video"
            onClick={() => console.log('Export video')}
            className="sm:hidden"
          />

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <IconButton
              icon={<User className="w-4 h-4" />}
              variant="secondary"
              size="sm"
              tooltip="User Menu"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            />
            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-1 min-w-[180px] bg-[var(--surface-elevated)] border border-[var(--border-primary)] rounded-lg shadow-[var(--shadow-lg)] z-50 overflow-hidden">
                {userMenuItems.map((item, index) => {
                  if (item.divider) {
                    return (
                      <div key={index} className="h-px bg-[var(--border-primary)] my-1" />
                    );
                  }

                  return (
                    <button
                      key={index}
                      className={`w-full px-3 py-2 text-sm flex items-center justify-between gap-3 transition-colors ${
                        item.danger
                          ? 'text-[var(--error)] hover:bg-[var(--error-bg)]'
                          : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                      }`}
                      onClick={() => {
                        item.action?.();
                        setUserMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 text-[var(--text-secondary)]">{item.icon}</div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.shortcut && (
                        <span className="text-xs px-1.5 py-0.5 bg-[var(--surface)] rounded text-[var(--text-tertiary)] font-mono">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Project Modal */}
      {projectModalMode && (
        <ProjectModal
          isOpen={!!projectModalMode}
          onClose={() => setProjectModalMode(null)}
          mode={projectModalMode}
        />
      )}
    </>
  );
};
