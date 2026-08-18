import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/404']

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const mainRef = useRef<HTMLElement>(null)
  const pageKey = router.asPath
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    mainRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [pageKey])

  const isPublic = PUBLIC_PATHS.some((p) =>
    router.pathname === p || router.pathname.startsWith(p.replace(/\/$/, ''))
  )

  if (isPublic) {
    return (
      <main ref={mainRef} style={{ minHeight: '100vh' }} className="animate-fade-in">
        {children}
      </main>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-50, #f8fafc)' }}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main
        ref={mainRef}
        className="flex-1 md:ml-[260px] pb-20 md:pb-0"
        style={{ minHeight: '100vh' }}
        key={pageKey}
      >
        <div className="animate-fade-in" style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}

export default AppShell
