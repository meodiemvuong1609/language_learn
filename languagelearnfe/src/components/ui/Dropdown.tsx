import React, { useState, useRef, useEffect } from 'react'

interface Item { key: string; label: string; icon?: React.ReactNode; danger?: boolean; disabled?: boolean; onClick?: () => void }

interface DropdownProps { trigger: React.ReactNode; items: Item[]; className?: string }

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, className = '' }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className={className} style={{ position: 'relative', display: 'inline-flex' }}>
      <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>{trigger}</div>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 40, minWidth: '200px',
            background: 'var(--surface-primary, #fff)',
            border: '1px solid var(--gray-200, #e2e8f0)',
            borderRadius: 'var(--radius-lg, 16px)',
            boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0/0.08))',
            padding: '6px',
            animation: 'scaleIn 0.15s ease-out',
          }}
        >
          {items.map((item) => (
            <button
              key={item.key}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => { item.onClick?.(); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '10px 14px',
                border: 'none', background: 'transparent', cursor: item.disabled ? 'not-allowed' : 'pointer',
                fontSize: '14px', fontWeight: 500,
                color: item.danger ? 'var(--error-500, #EF4444)' : 'var(--gray-700, #334155)',
                borderRadius: 'var(--radius-md, 10px)',
                opacity: item.disabled ? 0.4 : 1,
                transition: 'background 150ms',
              }}
            >
              {item.icon && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
