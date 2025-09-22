'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

// Dashboard Header Component
const DashboardHeader = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const pathname = usePathname()
  const role = user?.role as string | undefined
  const homePath = role === 'super_admin'
    ? '/admin/dashboard'
    : role === 'sub_admin'
    ? '/manage'
    : role === 'enterprise_admin'
    ? '/enterprise/dashboard'
    : '/dashboard'

  const trialEndsAt = user?.subscription?.trialEndsAt ? new Date(user.subscription.trialEndsAt) : null
  const packageEndsAt = user?.subscription?.packageEndsAt ? new Date(user.subscription.packageEndsAt) : null
  const now = new Date()
  
  // Determine which expiration date to use (include enterprise packages)
  const expirationDate = (user?.subscription?.type === 'paid_package' || user?.subscription?.type === 'enterprise_package') ? packageEndsAt : trialEndsAt
  const msLeft = expirationDate ? (expirationDate.getTime() - now.getTime()) : null
  const daysLeft = typeof msLeft === 'number' ? Math.ceil(msLeft / (1000 * 60 * 60 * 24)) : null
  
  const trialActive = user?.subscription?.type === 'free_trial' && user?.subscription?.status === 'active'
  const packageActive = (user?.subscription?.type === 'paid_package' || user?.subscription?.type === 'enterprise_package') && user?.subscription?.status === 'active'
  const shouldShowPackageCapsule = (user?.role === 'individual' || user?.role === 'enterprise_admin' || user?.role === 'enterprise_user') && (trialActive || packageActive || !!user?.subscription)

  function formatDate(d?: Date | null) {
    if (!d) return ''
    try {
      return d.toLocaleDateString()
    } catch {
      return ''
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {pathname !== homePath && (
            <Link href={homePath} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span className="font-medium">{role === 'super_admin' ? 'Admin' : 'Dashboard'}</span>
            </Link>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Wise DB</span>
          </div>

          {shouldShowPackageCapsule && (
            <div className="hidden md:flex items-center ml-4">
              {expirationDate && typeof daysLeft === 'number' && daysLeft > 0 ? (
                <span className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border ${
                  daysLeft <= 3 
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : daysLeft <= 7
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  <span>
                    {trialActive ? 'Free trial' : (user?.packageName || 'Package')}: {daysLeft} day{daysLeft === 1 ? '' : 's'} left · Ends {formatDate(expirationDate)}
                  </span>
                </span>
              ) : expirationDate ? (
                <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-rose-50 text-rose-700 border-rose-200">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <span>{trialActive ? 'Free trial expired' : 'Package expired'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  <span>{user?.subscription?.type === 'enterprise_package' ? 'Enterprise Package' : (user?.packageName || 'Package')}: Active</span>
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {user?.role === 'individual' && (
              <Link href="/dashboard/payment" className="hidden md:inline-flex items-center text-sm font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                Upgrade Plan
              </Link>
            )}
          {user?.role === 'enterprise_admin' && (
            <>
              <Link href="/enterprise/dashboard/api" className="hidden md:inline-flex items-center text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
                API Access
              </Link>
              <Link href="/enterprise/dashboard/api" className="md:hidden inline-flex items-center text-sm font-semibold text-blue-700 underline">
                API Access
              </Link>
            </>
          )}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Mobile expiration notification */}
      {shouldShowPackageCapsule && (
        <div className="md:hidden px-6 py-2 border-b border-gray-200">
          {expirationDate && typeof daysLeft === 'number' && daysLeft > 0 ? (
            <div className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border ${
              daysLeft <= 3 
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : daysLeft <= 7
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              <span>
                {trialActive ? 'Trial' : (user?.packageName || 'Package')}: {daysLeft} day{daysLeft === 1 ? '' : 's'} left
              </span>
            </div>
          ) : expirationDate ? (
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-rose-50 text-rose-700 border-rose-200">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <span>{trialActive ? 'Trial expired' : 'Package expired'}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              <span>{user?.subscription?.type === 'enterprise_package' ? 'Enterprise Package' : (user?.packageName || 'Package')}: Active</span>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

// Sidebar removed per requirements

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onLogout={handleLogout} />
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}