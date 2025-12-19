import React, { useState, createContext, useContext, useRef, useEffect } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = '',
  orientation = 'horizontal',
  activationMode = 'automatic'
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const activeTab = controlledValue ?? internalValue;

  const setActiveTab = (value: string) => {
    if (controlledValue === undefined) {
      setInternalValue(value);
    }
    onValueChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, orientation }}>
      <div
        className={className}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'underline' | 'pills';
  size?: 'sm' | 'md' | 'lg';
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md'
}) => {
  const context = useContext(TabsContext);
  const orientation = context?.orientation || 'horizontal';

  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const triggers = Array.from(
        listElement.querySelectorAll('[role="tab"]:not([disabled])')
      ) as HTMLElement[];

      if (triggers.length === 0) return;

      const currentIndex = triggers.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
      let nextIndex = currentIndex;

      switch (e.key) {
        case orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp':
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
          break;
        case orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown':
          e.preventDefault();
          nextIndex = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = triggers.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== currentIndex) {
        triggers[nextIndex].focus();
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggers[nextIndex].click();
        }
      }
    };

    listElement.addEventListener('keydown', handleKeyDown);
    return () => listElement.removeEventListener('keydown', handleKeyDown);
  }, [orientation]);

  // Variant styles
  const variants = {
    default: `
      bg-[var(--surface)]
      border border-[var(--border-primary)]
      rounded-lg p-1
      ${orientation === 'horizontal' ? 'flex' : 'flex flex-col'}
      gap-1
    `,
    underline: `
      border-b border-[var(--border-primary)]
      ${orientation === 'horizontal' ? 'flex' : 'flex flex-col'}
      gap-4
      relative
      after:content-['']
      after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px
      after:bg-[var(--border-primary)]
    `,
    pills: `
      ${orientation === 'horizontal' ? 'flex' : 'flex flex-col'}
      gap-2
    `,
  };

  // Size configurations
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  disabled = false,
  className = '',
  icon,
  badge
}) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }

  const { activeTab, setActiveTab, orientation } = context;
  const isActive = activeTab === value;
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Find parent TabsList to determine variant
  const tabsList = triggerRef.current?.closest('[role="tablist"]');
  const variant = tabsList?.getAttribute('data-variant') as any;

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };

  // Variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'underline':
        return `
          relative
          border-b-2
          ${isActive
            ? 'border-[var(--primary)] text-[var(--text-primary)]'
            : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }
          transition-colors duration-200
          focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
          focus:outline-none
          ${orientation === 'horizontal' ? 'px-1 pb-3' : 'px-3 py-2'}
        `;
      case 'pills':
        return `
          px-4 py-2
          rounded-full
          ${isActive
            ? 'bg-[var(--primary)] text-[var(--text-inverse)] shadow-md'
            : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]'
          }
          transition-all duration-200
          focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
          focus:outline-none
          ${isActive && 'hover:bg-[var(--primary-light)]'}
        `;
      default:
        return `
          px-4 py-2
          rounded-md
          font-medium
          ${isActive
            ? 'bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-sm'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
          }
          transition-all duration-200
          focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]
          focus:outline-none
          min-h-[44px] // WCAG touch target
          flex items-center gap-2
        `;
    }
  };

  return (
    <button
      ref={triggerRef}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${value}-tabpanel`}
      disabled={disabled}
      onClick={handleClick}
      tabIndex={disabled ? -1 : 0}
      className={`
        ${getVariantStyles()}
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${className}
      `}
    >
      {/* Indicator for default variant */}
      {variant === 'default' && isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[var(--primary)] rounded-r" />
      )}

      {icon && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}

      <span className="truncate">
        {children}
      </span>

      {badge && (
        <span className="ml-2 min-w-[20px] h-5 px-1.5 bg-[var(--error)] text-[var(--text-inverse)] text-xs font-medium rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}

      {/* Underline indicator animation */}
      {variant === 'underline' && isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-t transform origin-left animate-in slide-in-from-left duration-200" />
      )}
    </button>
  );
};

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  forceMount?: boolean;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = '',
  forceMount = false
}) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }

  const { activeTab } = context;
  const isActive = activeTab === value;

  if (!forceMount && !isActive) return null;

  return (
    <div
      id={`${value}-tabpanel`}
      role="tabpanel"
      aria-labelledby={`${value}-tab`}
      hidden={!isActive && !forceMount}
      className={`
        ${className}
        ${isActive && 'animate-in fade-in slide-in-from-top-2 duration-300'}
        ${!isActive && !forceMount && 'hidden'}
      `}
      tabIndex={0}
    >
      {isActive ? children : forceMount ? (
        <div className="hidden">{children}</div>
      ) : null}
    </div>
  );
};
