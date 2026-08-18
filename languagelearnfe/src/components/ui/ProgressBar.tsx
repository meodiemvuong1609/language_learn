import React from 'react'

type Size = 'sm' | 'md' | 'lg'
type Variant = 'primary' | 'success' | 'warning' | 'danger'

interface ProgressBarProps {
  value: number
  max?: number
  size?: Size
  variant?: Variant
  showLabel?: boolean
  className?: string
}

const sizeMap: Record<Size, { h: number; fs: number }> = {
  sm: { h: 4, fs: 11 },
  md: { h: 8, fs: 12 },
  lg: { h: 12, fs: 13 },
}

const variantColor: Record<Variant, string> = {
  primary: 'var(--stamp, #B42318)',
  success: 'var(--success-500, #10b981)',
  warning: 'var(--accent-500, #f59e0b)',
  danger: 'var(--error-500, #EF4444)',
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0, max = 100, size = 'md', variant = 'primary',
  showLabel = false, className = '',
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const s = sizeMap[size]
  return (
    <div className={className} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}
      style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        flex: 1, height: s.h,
        background: 'var(--gray-200, #e2e8f0)',
        borderRadius: '9999px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: variantColor[variant],
          borderRadius: '9999px',
          transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
      {showLabel && (
        <span style={{ fontSize: s.fs, fontWeight: 500, color: 'var(--gray-600, #475569)', minWidth: '40px', textAlign: 'right' }}>
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}

export default ProgressBar
