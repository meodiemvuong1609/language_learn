import React from 'react'

interface LoadingStateProps {
  message?: string
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Đang tải...', className = '' }) => (
  <div className={className} style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '32px 24px', textAlign: 'center',
  }}>
    <div style={{
      width: '36px', height: '36px',
      border: '3px solid var(--primary-200, #BFDBFE)',
      borderTopColor: 'var(--stamp, #B42318)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--gray-500, #64748b)' }}>{message}</p>
  </div>
)

export default LoadingState
