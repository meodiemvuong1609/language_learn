import React, { useEffect, useCallback } from 'react'

type Size = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: Size
}

const sizeWidth: Record<Size, string> = { sm: '400px', md: '560px', lg: '720px', xl: '960px' }

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = 'md' }) => {
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }, [onClose])

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        padding: '24px',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        style={{
          width: '100%',
          maxWidth: sizeWidth[size],
          maxHeight: '90vh',
          background: 'var(--surface-primary, #fff)',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: 'var(--shadow-2xl, 0 25px 50px -12px rgb(0 0 0/0.15))',
          overflow: 'auto',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px', borderBottom: '1px solid var(--gray-100, #f1f5f9)',
          }}>
            <h2 id="modal-title" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--gray-900, #0f172a)', margin: 0 }}>{title}</h2>
            <button
              onClick={onClose}
              style={{
                width: '32px', height: '32px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', background: 'transparent', cursor: 'pointer',
                borderRadius: 'var(--radius-md, 10px)',
                color: 'var(--gray-500, #64748b)',
              }}
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
