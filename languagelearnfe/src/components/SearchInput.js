/**
 * Reusable SearchInput Component
 * Features:
 * - Properly centered icon and text
 * - Consistent with Design System
 * - Accessible and responsive
 */
import { useState, useRef, useEffect } from 'react';

const SearchInput = ({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className = "",
  debounceMs = 300,
  onClear,
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const debounceTimer = useRef(null);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Debounce the actual onChange callback
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onChange?.(newValue);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    onClear?.();
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon - properly centered */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none h-full">
        <svg
          className="w-5 h-5 flex-shrink-0"
          style={{ color: 'var(--gray-400)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        // Proper height, padding, and vertical alignment
        className="input w-full pl-11 pr-10 h-12 leading-5"
        style={{ lineHeight: '1.5' }}
      />

      {/* Clear Button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center hover:text-gray-600 transition-colors h-full"
          aria-label="Clear search"
        >
          <svg
            className="w-5 h-5"
            style={{ color: 'var(--gray-400)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
