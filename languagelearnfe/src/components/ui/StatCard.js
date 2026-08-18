import React from 'react';

const StatCard = React.memo(function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendLabel,
  className = '',
}) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold" style={{ color: 'var(--gray-900)' }}>{value}</span>
            {unit && (
              <span className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>{unit}</span>
            )}
          </div>
          {trend !== undefined && (
            <p className="mt-2 text-sm" style={{ color: trend >= 0 ? 'var(--success-500)' : 'var(--error-500)' }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel || 'so với tuần trước'}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
});

export default StatCard;
