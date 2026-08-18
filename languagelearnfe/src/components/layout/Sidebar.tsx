import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/authSlice'
import { api } from '@/services/api'
import { Avatar } from '@/components/ui'

const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/vocabulary', label: 'Từ vựng', icon: 'M12 6.253v13' },
  { href: '/listening', label: 'Nghe', icon: 'M9 19V6l12-3v13' },
  { href: '/speaking', label: 'Nói', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  { href: '/flashcard', label: 'Flashcard', icon: 'M19 11H5' },
  { href: '/sentence', label: 'Ngữ pháp', icon: 'M11 5H6a2 2 0 00-2 2v11' },
  { href: '/quizzes', label: 'Quiz', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' },
  { href: '/reading', label: 'Đọc hiểu', icon: 'M12 6.253v13' },
]

export function Sidebar() {
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: '260px', zIndex: 40,
      background: 'var(--surface-primary, #fff)',
      borderRight: '1px solid var(--gray-200, #e2e8f0)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 12px',
    }}>
      <Link href="/dashboard" style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0 12px', marginBottom: '24px', textDecoration: 'none',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary-500, #3B82F6), #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '18px',
        }}>🌍</div>
        <span style={{
          fontSize: '16px', fontWeight: 700, color: 'var(--gray-900, #0f172a)',
          letterSpacing: '-0.025em',
        }}>LanguageLearn</span>
      </Link>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {ITEMS.map((item) => {
          const active = router.pathname === item.href || router.pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px', fontWeight: active ? 600 : 400,
                color: active ? 'var(--primary-600, #2563EB)' : 'var(--gray-600, #475569)',
                background: active ? 'var(--primary-50, #EFF6FF)' : 'transparent',
                transition: 'all 150ms ease',
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{
        borderTop: '1px solid var(--gray-200, #e2e8f0)',
        paddingTop: '12px', marginTop: 'auto',
      }}>
        <Link href="/profile" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '8px 12px', borderRadius: '10px',
          textDecoration: 'none', marginBottom: '4px',
        }}>
          <Avatar name="User" size="sm" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900, #0f172a)' }}>User</div>
            <div style={{ fontSize: '11px', color: 'var(--gray-500, #64748b)' }}>Xem hồ sơ</div>
          </div>
        </Link>
        <button
          onClick={async () => {
            try { await api.logout() } catch { /* still clear local */ }
            dispatch(logout())
            router.push('/login')
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: '8px 12px', borderRadius: '10px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: '13px', color: 'var(--error-500, #EF4444)',
            transition: 'background 150ms',
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
