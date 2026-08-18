import React from 'react';

const LevelBadge = React.memo(function LevelBadge({
  level,
  size = 'md',
  className = '',
}) {
  const colors = {
    A1: { bg: 'var(--gray-100)', text: 'var(--gray-700)' },
    A2: { bg: 'var(--primary-50)', text: 'var(--primary-700)' },
    B1: { bg: '#fef3c7', text: '#92400e' },
    B2: { bg: '#fce7f3', text: '#9d174d' },
    C1: { bg: '#ede9fe', text: '#5b21b6' },
    C2: { bg: '#dbeafe', text: '#1e40af' },
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const colorSet = colors[level] || { bg: 'var(--gray-100)', text: 'var(--gray-600)' };

  return (
    <span
      className={`
        inline-flex items-center
        rounded-full font-semibold
        ${sizes[size] || sizes.md}
        ${className}
      `}
      style={{
        backgroundColor: colorSet.bg,
        color: colorSet.text,
      }}
    >
      {level}
    </span>
  );
});

export default LevelBadge;
