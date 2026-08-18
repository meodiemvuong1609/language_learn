import React from 'react'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: Size
  className?: string
}

const sizeMap: Record<Size, { w: number; h: number; fs: number }> = {
  xs: { w: 24, h: 24, fs: 10 },
  sm: { w: 32, h: 32, fs: 12 },
  md: { w: 40, h: 40, fs: 14 },
  lg: { w: 48, h: 48, fs: 16 },
  xl: { w: 56, h: 56, fs: 18 },
}

const PALETTE = [
  ['#DBEAFE', '#1D4ED8'], ['#d1fae5', '#059669'], ['#fef3c7', '#d97706'],
  ['#fce7f3', '#9d174d'], ['#ede9fe', '#5b21b6'], ['#ffe4e6', '#be123c'],
  ['#e0e7ff', '#3730a3'], ['#ccfbf1', '#115e59'],
]

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  const first = parts[0] || ''
  const last = parts[parts.length - 1] || ''
  return (first.charAt(0) + last.charAt(0)).toUpperCase()
}

function pickColor(name?: string): [string, string] {
  if (!name) return ['#DBEAFE', '#1D4ED8'] as [string, string]
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return PALETTE[Math.abs(h) % PALETTE.length] as [string, string]
}

export const Avatar: React.FC<AvatarProps> = ({
  src, alt = '', name = '', size = 'md', className = '',
}) => {
  const s = sizeMap[size]
  const [bg, fg] = pickColor(name)

  if (src) {
    return (
      <img
        src={src} alt={alt || name}
        className={className}
        style={{
          width: s.w, height: s.h,
          borderRadius: '9999px', objectFit: 'cover', flexShrink: 0,
        }}
      />
    )
  }

  return (
    <div
      className={className}
      style={{
        width: s.w, height: s.h,
        borderRadius: '9999px',
        backgroundColor: bg, color: fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: s.fs, lineHeight: 1,
        flexShrink: 0, userSelect: 'none',
      }}
      aria-label={name || ' Avatar'}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}

export default Avatar
