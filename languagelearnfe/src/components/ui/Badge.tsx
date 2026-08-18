import React from 'react'

type Variant = 'primary' | 'success' | 'warning' | 'error' | 'gray'
type Size = 'sm' | 'md' | 'lg'

interface BadgeProps {
  variant?: Variant
  size?: Size
  dot?: boolean
  className?: string
  children: React.ReactNode
}

const variantMap: Record<Variant, string> = {
  primary: '#DBEAFE,#1D4ED8',
  success: '#d1fae5,#059669',
  warning: '#fef3c7,#d97706',
  error: '#FECACA,#DC2626',
  gray: '#f1f5f9,#475569',
}

const sizeMap: Record<Size, { pad: string; fs: string; dot: string; h: string }> = {
  sm: { pad: '2px 8px', fs: '11px', dot: '6px', h: '6px' },
  md: { pad: '4px 10px', fs: '12px', dot: '8px', h: '8px' },
  lg: { pad: '5px 14px', fs: '13px', dot: '9px', h: '9px' },
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
  children,
}) => {
  const [bg, color] = variantMap[variant].split(',')
  const s = sizeMap[size]
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: s.pad,
        borderRadius: '9999px',
        fontSize: s.fs,
        fontWeight: 600,
        lineHeight: '1.4',
        backgroundColor: bg,
        color: color,
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: s.dot,
            height: s.h,
            borderRadius: '50%',
            backgroundColor: color,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  )
}

export default Badge
