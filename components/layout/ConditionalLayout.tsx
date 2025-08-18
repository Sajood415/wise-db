'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Define routes that should NOT show the public header/footer
  const dashboardRoutes = [
    '/dashboard',
    '/admin',
    '/manage', 
    '/search',
    '/searches',
    '/my-reports',
    '/subscription'
  ]

  // Check if current path is a dashboard route
  const isDashboardRoute = dashboardRoutes.some(route => 
    pathname.startsWith(route)
  )

  // If it's a dashboard route, don't show header/footer
  if (isDashboardRoute) {
    return <>{children}</>
  }

  // For public routes, show header and footer
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  )
}