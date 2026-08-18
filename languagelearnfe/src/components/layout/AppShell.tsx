import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { isHiddenLearningPath } from '@/lib/lms'
import { useLogout } from '@/lib/useLogout'

const PUBLIC_PATHS = new Set([
  '/',
  '/home',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/404',
])

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true
  return pathname === '/reset-password' || pathname.startsWith('/reset-password/')
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const mainRef = useRef<HTMLElement>(null)
  const pageKey = router.asPath
  const handleLogout = useLogout()

  useEffect(() => {
    mainRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [pageKey])

  useEffect(() => {
    if (isHiddenLearningPath(router.pathname)) {
      router.replace('/dashboard')
    }
  }, [router, router.pathname])

  if (isPublicPath(router.pathname)) {
    return (
      <main ref={mainRef} style={{ minHeight: '100vh' }} className="animate-fade-in">
        {children}
      </main>
    )
  }

  if (isHiddenLearningPath(router.pathname)) {
    return (
      <main ref={mainRef} style={{ minHeight: '100vh', background: 'var(--paper)' }} className="animate-fade-in">
        <p className="p-8 text-sm" style={{ color: 'var(--muted)' }}>Đang chuyển về tổng quan…</p>
      </main>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--paper, #f7f4ee)' }}>
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 md:ml-[260px]">
        <div className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-2 px-3 h-14" style={{
          background: 'var(--cue, #fff6e8)',
          borderBottom: '1px solid var(--line, #d8cebf)',
        }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'IBM Plex Mono, ui-monospace, monospace',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              border: '1px solid var(--ink)',
              color: 'var(--ink)',
              padding: '4px 6px',
              boxShadow: '2px 2px 0 var(--ink)',
            }}>cue</span>
            <span style={{ fontFamily: 'Literata, Georgia, serif', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>
              Ngọc Thảo IELTS
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/profile" className="text-sm" style={{ color: 'var(--moss)', textDecoration: 'none' }}>Hồ sơ</Link>
            <button type="button" onClick={handleLogout} className="btn btn-secondary btn-sm">
              Đăng xuất
            </button>
          </div>
        </div>

        <main
          ref={mainRef}
          className="flex-1 pb-20 md:pb-0"
          style={{ minHeight: 0 }}
          key={pageKey}
        >
          <div className="animate-fade-in" style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}

export default AppShell
