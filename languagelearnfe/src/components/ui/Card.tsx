import React from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  footer?: React.ReactNode
  className?: string
  children: React.ReactNode
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  title, subtitle, footer, className = '', children, hoverable = false, padding = 'md',
}) => {
  const padMap = { none: '0', sm: '16px', md: '24px', lg: '32px' }
  const pad = padMap[padding]
  return (
    <div
      className={className}
      style={{
        background: 'var(--surface-primary, #fff)',
        borderRadius: 'var(--radius-lg, 16px)',
        border: '1px solid var(--gray-100, #f1f5f9)',
        boxShadow: 'var(--shadow-md, 0 4px 6px -1px rgb(0 0 0/0.07))',
        transition: 'box-shadow 250ms cubic-bezier(0.4,0,0.2,1), transform 250ms ease',
        padding: '0',
        overflow: 'hidden',
      }}
    >
      {(title || subtitle) && (
        <div style={{ padding: pad === '0' ? '24px' : `${pad} ${pad} 0`, borderBottom: padding === 'none' ? 'none' : undefined }}>
          {title && <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-900, #0f172a)', margin: 0, lineHeight: 1.4 }}>{title}</h3>}
          {subtitle && <p style={{ fontSize: '14px', color: 'var(--gray-500, #64748b)', margin: '4px 0 0', lineHeight: 1.5 }}>{subtitle}</p>}
        </div>
      )}
      <div style={{ padding: pad === '0' ? '0' : padding === 'none' ? '24px' : pad }}>{children}</div>
      {footer && (
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--gray-100, #f1f5f9)',
          background: 'var(--surface-secondary, #f8fafc)',
        }}>{footer}</div>
      )}
    </div>
  )
}

export default Card
