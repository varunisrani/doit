import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalId = React.useId();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      // Focus management
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  // Size configurations
  const sizeClasses = {
    sm: 'max-w-md w-full mx-4',
    md: 'max-w-lg w-full mx-4',
    lg: 'max-w-2xl w-full mx-4',
    xl: 'max-w-4xl w-full mx-4',
    full: 'w-full h-full mx-4 max-h-[90vh]'
  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Focus trap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[var(--modal)] flex items-center justify-center p-4"
      style={{
        background: 'var(--backdrop-overlay)',
        backdropFilter: 'var(--backdrop-blur)',
      }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${modalId}-title` : undefined}
      aria-describedby={description ? `${modalId}-description` : undefined}
    >
      <div
        ref={modalRef}
        className={`
          ${sizeClasses[size]}
          bg-[var(--surface-elevated)]
          border border-[var(--border-primary)]
          rounded-xl
          shadow-[var(--shadow-xl)]
          transform transition-all duration-300 ease-out
          animate-in fade-in zoom-in-95
          ${className}
        `}
        onKeyDown={handleKeyDown}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]">
            <div className="flex-1 min-w-0">
              {title && (
                <h2
                  id={`${modalId}-title`}
                  className="text-lg font-semibold text-[var(--text-primary)] truncate"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={`${modalId}-description`}
                  className="text-sm text-[var(--text-secondary)] mt-1"
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="ml-4 p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--surface-elevated)]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div
          className={`
            px-6 py-4
            ${title || showCloseButton ? 'max-h-[calc(90vh-8rem)]' : 'max-h-[calc(90vh-4rem)]'}
            overflow-y-auto
            scrollbar-thin
            scrollbar-track-[var(--surface)]
            scrollbar-thumb-[var(--border-secondary)]
            scrollbar-thumb-rounded
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
  position?: 'left' | 'center' | 'right';
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = '',
  position = 'right'
}) => {
  const positionClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-6 py-4
        border-t border-[var(--border-primary)]
        bg-[var(--surface)]
        ${positionClasses[position]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
