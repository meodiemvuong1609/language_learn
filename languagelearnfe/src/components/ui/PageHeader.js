import React from 'react';

const PageHeader = React.memo(function PageHeader({
  title,
  subtitle,
  action,
  badge,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 animate-fade-in ${className}`}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--gray-900)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm" style={{ color: 'var(--gray-500)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {(action || badge) && (
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          {badge}
          {action}
        </div>
      )}
    </div>
  );
});

export default PageHeader;
