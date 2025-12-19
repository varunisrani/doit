import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-700'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? 'text-white' : 'text-zinc-500'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg max-h-60 overflow-auto">
          <ul role="listbox" className="py-1">
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => !option.disabled && handleSelect(option.value)}
                className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between ${
                  option.disabled
                    ? 'text-zinc-600 cursor-not-allowed'
                    : option.value === value
                    ? 'bg-blue-600 text-white'
                    : 'text-white hover:bg-zinc-700'
                }`}
              >
                <span>{option.label}</span>
                {option.value === value && <Check className="w-4 h-4" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
