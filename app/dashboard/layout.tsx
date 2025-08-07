'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Dashboard Header Component
const DashboardHeader = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Wise DB</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
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
    </header>
  )
}

// Dashboard Sidebar Component
const DashboardSidebar = ({ user }: { user: any }) => {
  const router = useRouter()
  
  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: '📊' }
    ]
    
    switch (user?.role) {
      case 'super_admin':
        return [
          ...baseItems,
          { name: 'User Management', href: '/admin/users', icon: '👥' },
          { name: 'Fraud Management', href: '/admin/frauds', icon: '🛡️' },
          { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
          { name: 'Settings', href: '/admin/settings', icon: '⚙️' }
        ]
      
      case 'sub_admin':
        return [
          ...baseItems,
          { name: 'Review Frauds', href: '/manage/frauds', icon: '🔍' },
          { name: 'Reports', href: '/manage/reports', icon: '📋' }
        ]
      
      case 'enterprise_admin':
        return [
          ...baseItems,
          { name: 'Team Management', href: '/enterprise/team', icon: '👥' },
          { name: 'Search History', href: '/enterprise/searches', icon: '🔍' },
          { name: 'Analytics', href: '/enterprise/analytics', icon: '📈' },
          { name: 'Settings', href: '/enterprise/settings', icon: '⚙️' }
        ]
      
      case 'enterprise_user':
        return [
          ...baseItems,
          { name: 'Search Database', href: '/search', icon: '🔍' },
          { name: 'My Searches', href: '/searches', icon: '📋' }
        ]
      
      case 'individual':
      case 'paid_individual':
        return [
          ...baseItems,
          { name: 'Search Database', href: '/search', icon: '🔍' },
          { name: 'Report Fraud', href: '/report-fraud', icon: '⚠️' },
          { name: 'My Reports', href: '/my-reports', icon: '📋' },
          { name: 'Subscription', href: '/subscription', icon: '💳' }
        ]
      
      default:
        return baseItems
    }
  }

  const menuItems = getMenuItems()

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.href)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

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
      <div className="flex">
        <DashboardSidebar user={user} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}