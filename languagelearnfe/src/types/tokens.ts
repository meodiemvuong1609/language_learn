export const colors = {
  primary: {
    50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD',
    400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8',
    800: '#1E40AF', 900: '#1E3A8A',
  },
  secondary: {
    300: '#C4B5FD', 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9',
  },
  accent: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
  success: { 50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981', 600: '#059669' },
  error: {
    50: '#FEE2E2', 100: '#FECACA', 200: '#FCA5A5', 300: '#F87171',
    400: '#F87171', 500: '#EF4444', 600: '#DC2626',
  },
  gray: {
    50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
    400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
    800: '#1e293b', 900: '#0f172a',
  },
  background: '#ffffff',
  foreground: '#1e293b',
};

export const typography = {
  fontFamily: { sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' },
  fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' },
  lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.625', loose: '2' },
};

export const spacing = { 0:'0', 1:'4px', 2:'8px', 3:'12px', 4:'16px', 5:'20px', 6:'24px', 8:'32px', 10:'40px', 12:'48px', 16:'64px', 20:'80px', 24:'96px' };

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.15)',
};

export const radius = { none:'0', sm:'6px', md:'10px', lg:'16px', xl:'24px', full:'9999px' };
export const transition = { fast:'150ms cubic-bezier(0.4,0,0.2,1)', base:'250ms cubic-bezier(0.4,0,0.2,1)', slow:'350ms cubic-bezier(0.4,0,0.2,1)' };
export const zIndex = { dropdown:40, modal:50, toast:60, tooltip:70 };
export const breakpoints = { sm:'640px', md:'768px', lg:'1024px', xl:'1280px' };

export const tokens = { colors, typography, spacing, shadows, radius, transition, zIndex, breakpoints };
export default tokens;
