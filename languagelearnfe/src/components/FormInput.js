/**
 * Production-ready FormInput Component
 * Handles all states: default, focus, filled, error, disabled, loading
 * Prevents browser native validation and tooltips
 */
import { useState, useRef, useEffect, forwardRef } from 'react';

const FormInput = forwardRef(({
  label,
  type = 'text',
  value,
  onChange,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  error,
  touched,
  disabled = false,
  loading = false,
  placeholder,
  icon,
  required = false,
  className = '',
  helpText,
  autoComplete = 'off',
...rest
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const internalRef = useRef(null);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  
  const hasError = touched && error;
  const showSuccess = touched && !error && value && !loading;
  const isFilled = !!value && !focused;

  const handleFocus = (e) => {
    setFocused(true);
    onFocusProp?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlurProp?.(e);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Prevent browser autofill styling
  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.setAttribute('autocomplete', 'off');
      internalRef.current.setAttribute('data-form-type', 'other');
    }
  }, []);

  // Merge external ref with internal ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(internalRef.current);
      } else if (typeof ref === 'object' && ref.current !== undefined) {
        ref.current = internalRef.current;
      }
    }
  }, [ref]);

  return (
    <div className={`form-input-wrapper ${className}`}>
  {label && (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )}

      <div className="relative">
        {/* Icon (left) */}
        {icon && (
          <div 
            className="absolute left-0 top-0 bottom-0 pl-3.5 flex items-center pointer-events-none flex-shrink-0"
            style={{ zIndex: 2 }}
          >
            <span className="text-lg" style={{ color: hasError ? 'var(--error-500)' : 'var(--gray-400)' }}>
              {icon}
            </span>
          </div>
        )}

  {/* Input Field */}
  <input
    ref={internalRef}
    type={inputType}
    value={value || ''}
    onChange={onChange}
    onFocus={handleFocus}
    onBlur={handleBlur}
    disabled={disabled || loading}
    placeholder={placeholder}
    autoComplete={autoComplete}
    required={required}
    className={`
 input-base py-3
 ${icon ? 'pl-12' : 'pl-4'}
 ${isPassword || loading ? 'pr-12' : 'pr-4'}
      ${hasError ? 'input-error' : ''}
      ${showSuccess ? 'input-success' : ''}
      ${focused ? 'input-focused' : ''}
      ${disabled ? 'input-disabled' : ''}
    `}
    style={{
          border: `1.5px solid ${hasError ? 'var(--error-500)' : focused ? 'var(--primary-400)' : 'var(--gray-200)'}`,
    }}
     {...rest}
  />

        {/* Password Toggle or Loading or Success Icon */}
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2" style={{ borderColor: 'var(--primary-200)', borderTopColor: 'var(--primary-600)' }} />
          ) : isPassword ? (
            <button
              type="button"
              onClick={togglePassword}
              className="focus:outline-none transition-colors"
              style={{ color: 'var(--gray-400)' }}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l-3.293-3.293m0 0a3 3 0 104.243-4.243l3.293 3.293m-3.293-3.293l3.293 3.293M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          ) : showSuccess ? (
            <svg className="w-5 h-5" style={{ color: 'var(--success-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </div>
      </div>

      {/* Help Text or Error */}
      {(helpText || hasError) && (
        <div className="mt-2 flex items-center gap-1.5">
          {hasError && (
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--error-500)' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          <p className={`text-sm ${hasError ? '' : ''}`} style={{ color: hasError ? 'var(--error-500)' : 'var(--gray-500)' }}>
            {hasError ? error : helpText}
          </p>
        </div>
      )}
    </div>
  );
})

FormInput.displayName = 'FormInput';
export default FormInput;