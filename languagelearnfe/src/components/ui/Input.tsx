import React, { forwardRef } from 'react'

type InputSize = 'sm' | 'md' | 'lg'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  size?: InputSize
  fullWidth?: boolean
}

const inputSizeStyles: Record<InputSize, { padding: string, fontSize: string, minHeight: string }> = {
  sm: { padding: '8px 12px', fontSize: '14px', minHeight: '38px' },
  md: { padding: '10px 14px', fontSize: '15px', minHeight: '44px' },
  lg: { padding: '12px 16px', fontSize: '16px', minHeight: '50px' },
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, size = 'md', fullWidth = false, className = '', id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const s = inputSizeStyles[size]
    const showError = Boolean(error)
    const borderColor = showError ? 'var(--error-500, #EF4444)' : 'var(--gray-200, #e2e8f0)'
    const focusRing = showError ? 'rgba(239,68,68,0.15)' : 'rgba(37,99,235,0.12)'
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: fullWidth ? '100%' : undefined }}>
        {label && (
          <label htmlFor={inputId} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700, #475569)', lineHeight: 1.4 }}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {leftIcon && (
            <span style={{ position: 'absolute', left: '14px', display: 'flex', color: 'var(--gray-400, #94a3b8)', pointerEvents: 'none' }}>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            style={{
              width: '100%',
              border: '1.5px solid ' + borderColor,
              borderRadius: 'var(--radius-md, 10px)',
              padding: leftIcon ? '10px 14px 10px 42px' : '10px 14px',
              fontSize: s.fontSize,
              lineHeight: 1.5,
              color: 'var(--gray-800, #1e293b)',
              backgroundColor: 'var(--surface-primary, #fff)',
              outline: 'none',
              transition: 'border-color 150ms, box-shadow 150ms',
              minHeight: s.minHeight,
            }}
            aria-invalid={showError}
            aria-describedby={showError ? inputId + '-error' : hint ? inputId + '-hint' : undefined}
            className={className}
            {...props}
          />
          {rightIcon && (
            <span style={{ position: 'absolute', right: '14px', display: 'flex', color: 'var(--gray-400, #94a3b8)', pointerEvents: 'none' }}>
              {rightIcon}
            </span>
          )}
          {showError && (
            <span style={{ position: 'absolute', right: '14px', display: 'flex', color: 'var(--error-500, #EF4444)' }}>
              <svg width='18' height='18' viewBox='0 0 20 20' fill='currentColor' style={{ flexShrink: 0 }}>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
              </svg>
            </span>
          )}
        </div>
        {showError && (
          <p id={inputId + '-error'} style={{ fontSize: '13px', color: 'var(--error-500, #EF4444)', lineHeight: 1.4 }} role='alert'>
            {error}
          </p>
        )}
        {!showError && hint && (
          <p id={inputId + '-hint'} style={{ fontSize: '13px', color: 'var(--gray-500, #64748b)', lineHeight: 1.4 }}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
