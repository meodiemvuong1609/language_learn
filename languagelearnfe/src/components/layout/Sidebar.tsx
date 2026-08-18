import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { Avatar } from '@/components/ui'
import { isTeacher } from '@/lib/lms'
import { useLogout } from '@/lib/useLogout'

const ICONS = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  schedule: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  courses: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  students: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  classes: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1',
}

function navItems(user?: { role?: string; is_teacher?: boolean } | null) {
  const items = [
    { href: '/dashboard', label: 'Tổng quan', icon: ICONS.dashboard },
    { href: '/schedule', label: 'Lịch học', icon: ICONS.schedule },
    { href: '/classes', label: 'Lớp học', icon: ICONS.classes },
    { href: '/courses', label: 'Khóa học', icon: ICONS.courses },
  ]
  if (isTeacher(user)) {
    items.push({ href: '/students', label: 'Học sinh', icon: ICONS.students })
  }
  return items
}

export function Sidebar() {
  const router = useRouter()
  const handleLogout = useLogout()
  const user = useSelector((state: { auth?: { user?: { full_name?: string; username?: string; role?: string; is_teacher?: boolean; status?: string } } }) => state.auth?.user)
  const displayName = user?.full_name || user?.username || 'Học viên'
  const roleLabel = isTeacher(user) ? 'Cô giáo' : user?.status === 'pending' ? 'Chờ duyệt' : 'Học viên'

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: '260px', zIndex: 40,
      background: 'var(--cue, #fff6e8)',
      borderRight: '1px solid var(--line, #d8cebf)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 12px',
    }}>
      <Link href="/dashboard" style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0 12px', marginBottom: '24px', textDecoration: 'none',
      }}>
        <div style={{
          fontFamily: 'IBM Plex Mono, ui-monospace, monospace',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          background: 'var(--cue, #fff6e8)',
          border: '1px solid var(--ink, #152238)',
          color: 'var(--ink, #152238)',
          padding: '6px 8px',
          boxShadow: '2px 2px 0 var(--ink, #152238)',
        }}>cue</div>
        <span style={{
          fontFamily: 'Literata, Georgia, serif',
          fontSize: '15px', fontWeight: 700, color: 'var(--ink, #152238)',
          letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>Ngọc Thảo IELTS</span>
      </Link>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems(user).map((item) => {
          const active = router.pathname === item.href || router.pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px',
                textDecoration: 'none',
                fontSize: '14px', fontWeight: active ? 600 : 400,
                color: active ? 'var(--stamp, #b42318)' : 'var(--muted, #6b645b)',
                background: active ? 'rgba(180, 35, 24, 0.08)' : 'transparent',
                borderLeft: active ? '2px solid var(--stamp, #b42318)' : '2px solid transparent',
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
        borderTop: '1px solid var(--line, #d8cebf)',
        paddingTop: '12px', marginTop: 'auto',
      }}>
        <Link href="/profile" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '8px 12px',
          textDecoration: 'none', marginBottom: '4px',
        }}>
          <Avatar name={displayName} size="sm" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink, #152238)' }}>{displayName}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted, #6b645b)' }}>{roleLabel}</div>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: '8px 12px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: '13px', color: 'var(--stamp, #b42318)',
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
