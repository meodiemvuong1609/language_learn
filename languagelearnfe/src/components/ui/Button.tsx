import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--primary-600,#2563EB)] text-white hover:bg-[var(--primary-700,#1D4ED8)] active:bg-[var(--primary-800,#1E40AF)]',
  secondary: 'bg-[var(--gray-100,#f1f5f9)] text-[var(--gray-700,#475569)] hover:bg-[var(--gray-200,#e2e8f0)] active:bg-[var(--gray-300,#cbd5e1)]',
  success: 'bg-[var(--success-500,#10b981)] text-white hover:bg-[var(--success-600,#059669)]',
  danger: 'bg-[var(--error-500,#EF4444)] text-white hover:bg-[var(--error-600,#DC2626)]',
  ghost: 'bg-transparent text-[var(--gray-600,#475569)] hover:bg-[var(--gray-100,#f1f5f9)] active:bg-[var(--gray-200,#e2e8f0)]',
};

const sizeClasses: Record<ButtonSize, { padding: string; minHeight: string; fontSize: string }> = {
  sm: { padding: '6px 14px', minHeight: '36px', fontSize: '13px' },
  md: { padding: '10px 20px', minHeight: '44px', fontSize: '14px' },
  lg: { padding: '14px 28px', minHeight: '48px', fontSize: '16px' },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const s = sizeClasses[size];
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: 'none',
      borderRadius: 'var(--radius-md, 10px)',
      fontWeight: 600,
      letterSpacing: '0.01em',
      cursor: 'pointer',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      padding: s.padding,
      minHeight: s.minHeight,
      fontSize: s.fontSize,
      width: fullWidth ? '100%' : undefined,
    };

    if (disabled || isLoading) {
      base.opacity = '0.5';
      base.cursor = 'not-allowed';
    }

    return (
      <button
        ref={ref}
        type={type}
        style={base}
        className={variantClasses[variant]}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span
            style={{
              width: '16px', height: '16px',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
        ) : leftIcon ? (
          <span style={{ display: 'inline-flex', flexShrink: 0 }}>{leftIcon}</span>
        ) : null}
        <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
        {!isLoading && rightIcon && (
          <span style={{ display: 'inline-flex', flexShrink: 0 }}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
