import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { isTeacher } from '@/lib/lms'

const ICONS = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  schedule: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  courses: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13',
  students: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  classes: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1',
}

export const BottomNav = () => {
  const router = useRouter()
  const user = useSelector((state: { auth?: { user?: { role?: string; is_teacher?: boolean } } }) => state.auth?.user)
  const items = [
    { href: '/dashboard', label: 'Home', icon: ICONS.dashboard },
    { href: '/schedule', label: 'Lịch', icon: ICONS.schedule },
    { href: '/classes', label: 'Lớp', icon: ICONS.classes },
    ...(isTeacher(user) ? [{ href: '/students', label: 'HS', icon: ICONS.students }] : [{ href: '/courses', label: 'Khóa', icon: ICONS.courses }]),
  ]

  return (
    <nav
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '64px', zIndex: 40,
        background: 'var(--cue, #fff6e8)',
        borderTop: '1px solid var(--line, #d8cebf)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '0 8px',
      }}
      className="md:hidden"
    >
      {items.map((item) => {
        const active = router.pathname === item.href || router.pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              padding: '8px 12px', textDecoration: 'none',
              color: active ? 'var(--stamp, #b42318)' : 'var(--muted, #6b645b)',
              fontSize: '11px', fontWeight: 500, transition: 'color 150ms', minWidth: '64px',
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default BottomNav
