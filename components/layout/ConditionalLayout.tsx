"use client"

import { Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

function LayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const dashboardRoutes = [
    '/dashboard',
    '/admin',
    '/manage',
    '/search',
    '/searches',
    '/my-reports',
    '/subscription',
    '/enterprise/dashboard',
    '/reports', // Reports detail pages for logged-in users
  ]

  const isDashboardRoute = dashboardRoutes.some((route) => pathname.startsWith(route))

  if (isDashboardRoute) {
    return <>{children}</>
  }

  const hideForEnterpriseSuccess = pathname === '/enterprise' && searchParams.get('payment') === 'success'
  if (hideForEnterpriseSuccess) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="pt-[68px]">{children}</main>
      <Footer />
    </>
  )
}

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LayoutInner>{children}</LayoutInner>
    </Suspense>
  )
}