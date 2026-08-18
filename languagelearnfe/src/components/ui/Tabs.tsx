import React from 'react'

interface TabItem { key: string; label: string; icon?: React.ReactNode; disabled?: boolean }

interface TabsProps {
  items: TabItem[]
  activeKey?: string
  onChange?: (key: string) => void
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ items, activeKey, onChange, className = '' }) => {
  return (
    <div className={className} style={{ borderBottom: '1px solid var(--gray-200, #e2e8f0)', display: 'flex', gap: '4px' }} role="tablist">
      {items.map((item) => {
        const active = item.key === activeKey
        return (
          <button
            key={item.key}
            role="tab"
            aria-selected={active}
            disabled={item.disabled}
            onClick={() => !item.disabled && onChange?.(item.key)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 16px',
              border: 'none', background: 'transparent', cursor: item.disabled ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: active ? 600 : 400,
              color: active ? 'var(--stamp, #b42318)' : 'var(--muted, #6b645b)',
              borderBottom: active ? '2px solid var(--stamp, #b42318)' : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'color 150ms, border-color 150ms',
              opacity: item.disabled ? 0.4 : 1,
            }}
          >
            {item.icon && <span style={{ display: 'inline-flex' }}>{item.icon}</span>}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
