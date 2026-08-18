import React, { useId } from 'react';

const Select = React.memo(function Select({
  value,
  onChange,
  options = [],
  placeholder = 'Chọn...',
  className = '',
  disabled = false,
  error,
  label,
  name,
  ...props
}) {
  const id = useId();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--gray-700)' }}>
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
        className={`
          w-full
          py-2.5 pl-3.5 pr-10
          bg-white
          border rounded-lg
          text-sm
          appearance-none
          cursor-pointer
          outline-none
          transition-all duration-150
          focus:ring-2 focus:ring-offset-0
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-200 focus:border-primary-400 focus:ring-primary-100'
          }
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '16px 12px',
          color: 'var(--gray-800)',
        }}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value ?? opt.id} value={opt.value ?? opt.id}>
            {opt.label ?? opt.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm" style={{ color: 'var(--error-500)' }}>{error}</p>
      )}
    </div>
  );
});

export default Select;
