import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { login } from '../store/authSlice';
import FormInput from './FormInput';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const formRef = useRef(null);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && focusedField) {
      // Error will be cleared by Redux on next action
    }
  }, [error, focusedField]);

  // Icons for inputs
  const userIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const lockIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  // Auto-scroll to focused input on mobile
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
    setTimeout(() => {
      if (fieldName === 'username' && usernameRef.current) {
        usernameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (fieldName === 'password' && passwordRef.current) {
        passwordRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFocusedField(null);
    const payload = { username, password };

    try {
      const response = await dispatch(login(payload)).unwrap();
      if (response) {
        Cookies.set('token', response, { expires: 7 });
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-canvas p-4 relative overflow-hidden">
      <div className="w-full max-w-md animate-fade-in-up relative z-10">
        <div className="text-center mb-8">
          <p className="inline-block font-plex text-[11px] tracking-[0.14em] uppercase border border-ink text-ink px-2 py-1 mb-4" style={{ boxShadow: '2px 2px 0 var(--ink)' }}>
            cue
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Ngọc Thảo IELTS
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            Luyện IELTS online · THPT và sinh viên
          </p>
        </div>

        <div className="rounded-none border p-6 md:p-8" style={{ background: 'var(--surface-primary)', borderColor: 'var(--line)' }}>
          <h2 className="text-2xl font-bold mb-1">Chào mừng trở lại</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Đăng nhập để tiếp tục luyện thi</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <FormInput
              ref={usernameRef}
              label="Tên đăng nhập"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => handleFocus('username')}
              onBlur={handleBlur}
              required
              placeholder="Nhập tên đăng nhập"
              icon={userIcon}
              autoComplete="username"
            />

            {/* Password */}
            <FormInput
              ref={passwordRef}
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              required
              placeholder="Nhập mật khẩu"
              icon={lockIcon}
            />

            {/* Error */}
            {error && (
              <div className="animate-fade-in bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-semibold text-moss hover:underline">
              Đăng ký ngay
            </Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-3">
            <Link href="/forgot-password" className="text-moss hover:underline">
              Quên mật khẩu?
            </Link>
          </p>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--muted)' }}>
          <Link href="/" className="hover:underline">← Trang giới thiệu</Link>
          {' · '}© {new Date().getFullYear()} Ngọc Thảo IELTS
        </p>
      </div>
    </div>
  );
}
