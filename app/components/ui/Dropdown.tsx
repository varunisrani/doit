import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  searchable?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  disabled = false,
  className = '',
  size = 'md',
  variant = 'default',
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const dropdownId = React.useId();

  // Filter options based on search query
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && searchable) {
      inputRef.current?.focus();
    }
  }, [isOpen, searchable]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => {
            const next = prev + 1;
            return next < filteredOptions.length ? next : 0;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => {
            const next = prev - 1;
            return next >= 0 ? next : filteredOptions.length - 1;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchQuery('');
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, filteredOptions]);

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  // Size configurations
  const sizeClasses = {
    sm: {
      trigger: 'px-3 py-1.5 text-xs min-h-[36px] rounded-sm',
      option: 'px-3 py-1.5 text-xs min-h-[36px]',
    },
    md: {
      trigger: 'px-4 py-2 text-sm min-h-[44px] rounded-md',
      option: 'px-4 py-2 text-sm min-h-[44px]',
    },
    lg: {
      trigger: 'px-5 py-3 text-base min-h-[52px] rounded-lg',
      option: 'px-5 py-3 text-base min-h-[52px]',
    },
  };

  // Variant configurations
  const variantClasses = {
    default: {
      trigger: 'bg-[var(--surface)] border-[var(--border-primary)] hover:bg-[var(--surface-hover)]',
    },
    filled: {
      trigger: 'bg-[var(--surface-hover)] border-transparent hover:bg-[var(--surface)]',
    },
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={dropdownId}
          className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
        >
          {label}
        </label>
      )}

      {/* Dropdown Trigger */}
      <button
        id={dropdownId}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between
          border
          ${sizeClasses[size].trigger}
          ${variantClasses[variant].trigger}
          text-[var(--text-primary)]
          ${!selectedOption ? 'text-[var(--text-tertiary)]' : ''}
          placeholder-[var(--text-tertiary)]
          transition-all duration-200 ease-in-out
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--focus-ring)]
          focus:ring-offset-2
          focus:ring-offset-[var(--background)]
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:pointer-events-none
          ${!disabled && 'hover:border-[var(--border-secondary)]'}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-describedby={isOpen ? `${dropdownId}-listbox` : undefined}
      >
        <span className="flex-1 text-left truncate">
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={`
            w-4 h-4 text-[var(--text-tertiary)]
            transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div
          className={`
            absolute z-[var(--dropdown)] w-full mt-1
            bg-[var(--surface-elevated)]
            border border-[var(--border-primary)]
            rounded-lg
            shadow-[var(--shadow-lg)]
            max-h-60 overflow-hidden
            animate-in fade-in slide-in-from-top-1
            duration-200 ease-out
          `}
        >
          {searchable && (
            <div className="p-3 border-b border-[var(--border-primary)]">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(-1);
                }}
                placeholder="Search options..."
                className="
                  w-full px-3 py-1.5 text-sm
                  bg-[var(--surface)]
                  border border-[var(--border-primary)]
                  rounded text-[var(--text-primary)]
                  placeholder-[var(--text-tertiary)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
                "
              />
            </div>
          )}

          <ul
            ref={listRef}
            id={`${dropdownId}-listbox`}
            role="listbox"
            className="py-1 overflow-y-auto max-h-60"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-2 text-sm text-[var(--text-tertiary)]">
                {searchable ? 'No options found' : 'No options available'}
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    ${sizeClasses[size].option}
                    flex items-center justify-between
                    cursor-pointer
                    transition-colors duration-150
                    ${option.disabled
                      ? 'text-[var(--text-tertiary)] cursor-not-allowed opacity-50'
                      : option.value === value
                        ? 'bg-[var(--primary)] text-[var(--text-inverse)]'
                        : highlightedIndex === index
                          ? 'bg-[var(--surface-hover)] text-[var(--text-primary)]'
                          : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                    }
                  `}
                >
                  <span className="flex-1 flex items-center gap-2 truncate">
                    {option.icon}
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{option.label}</span>
                      {option.description && (
                        <span className="text-xs opacity-70 block truncate">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </span>
                  {option.value === value && (
                    <Check className="w-4 h-4 flex-shrink-0 ml-2" />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
