import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const ITEMS = [
  { href: '/dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/vocabulary', label: 'Vocab', icon: 'M12 6.253v13' },
  { href: '/listening', label: 'Listen', icon: 'M9 19V6l12-3v13' },
  { href: '/speaking', label: 'Speak', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  { href: '/flashcard', label: 'Cards', icon: 'M19 11H5' },
  { href: '/quizzes', label: 'Quiz', icon: 'M9 5H7a2 2 0 00-2 2v12' },
]

export const BottomNav = () => {
  const router = useRouter()

  return (
    <nav
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '64px', zIndex: 40,
        background: 'var(--surface-primary, #fff)',
        borderTop: '1px solid var(--gray-200, #e2e8f0)',
        display: 'none', alignItems: 'center', justifyContent: 'space-around',
        padding: '0 8px',
      }}
      className="md:hidden"
    >
      {ITEMS.map((item) => {
        const active = router.pathname === item.href || router.pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              padding: '8px 12px', textDecoration: 'none',
              color: active ? 'var(--primary-600, #2563EB)' : 'var(--gray-500, #64748b)',
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
