import React from 'react'

type Variant = 'text' | 'rectangular' | 'circular'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  variant?: Variant
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%', height = 20, variant = 'text', className = '',
}) => {
  const borderRadius = variant === 'circular' ? '50%' : variant === 'text' ? '4px' : 'var(--radius-md, 10px)'

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--gray-200, #e2e8f0) 25%, var(--gray-100, #f1f5f9) 50%, var(--gray-200, #e2e8f0) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        flexShrink: 0,
      }} />
  )
}

export default Skeleton
