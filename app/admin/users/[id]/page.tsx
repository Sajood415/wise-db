"use client"

import { useEffect, useState, use as usePromise } from 'react'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'

type AdminUser = {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'individual' | 'enterprise_admin' | 'enterprise_user' | 'sub_admin' | 'super_admin'
  isActive?: boolean
  subscription?: {
    type?: string
    status?: string
    packageName?: string | null
    searchesUsed?: number
    searchLimit?: number
  }
  createdAt?: string
}

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params)
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [entUsersLoading, setEntUsersLoading] = useState(false)
  const [entUsers, setEntUsers] = useState<any[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await fetch(`/api/admin/users/${id}`, { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load user')
        if (!cancelled) setUser(data.item)
      } catch (e: any) {
        if (!cancelled) showToast(e.message || 'Failed to load user', 'error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    let cancelled = false
    async function loadEnterpriseUsers() {
      if (!user || user.role !== 'enterprise_admin') return
      try {
        setEntUsersLoading(true)
        const res = await fetch(`/api/enterprise/users?createdBy=${user._id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load users')
        if (!cancelled) setEntUsers(data.items || [])
      } catch (e: any) {
        if (!cancelled) showToast(e.message || 'Failed to load users', 'error')
      } finally {
        if (!cancelled) setEntUsersLoading(false)
      }
    }
    loadEnterpriseUsers()
    return () => { cancelled = true }
  }, [user])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-white rounded-lg shadow p-6 animate-pulse" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">User</h1>
          <Link href="/admin/dashboard" className="text-sm text-blue-600 hover:underline">Back to dashboard</Link>
        </div>
        <div className="rounded-md border p-4 text-sm text-rose-700 bg-rose-50">User not found.</div>
      </div>
    )
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || '—'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
        <Link href="/admin/dashboard" className="text-sm text-blue-600 hover:underline">Back to dashboard</Link>
      </div>
      <p className="text-sm text-gray-600">{user.email}</p>

      <section className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-gray-500">Role</div>
            <div className="text-gray-900">{user.role}</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500">Status</div>
            <div className="text-gray-900">{user.isActive ? 'Enabled' : 'Disabled'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500">Joined</div>
            <div className="text-gray-900">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500">Last Updated</div>
            <div className="text-gray-900">{(user as any).updatedAt ? new Date((user as any).updatedAt).toLocaleString() : '-'}</div>
          </div>
        </div>
      </section>

      {user.role === 'enterprise_admin' && (
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Associated Enterprise Users</h3>
            <div className="text-sm text-gray-600">Total users: {entUsers.length}</div>
          </div>
          <div className="mt-4 border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 bg-gray-50">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Searches Used</th>
                  <th className="py-2 px-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {entUsersLoading && (
                  <tr><td className="py-3 px-3 text-gray-500" colSpan={4}>Loading users...</td></tr>
                )}
                {!entUsersLoading && entUsers.length === 0 && (
                  <tr><td className="py-3 px-3 text-gray-500" colSpan={4}>No users found.</td></tr>
                )}
                {!entUsersLoading && entUsers.map((u: any) => (
                  <tr key={u._id} className="border-t">
                    <td className="py-2 px-3 text-gray-900">{u.firstName} {u.lastName}</td>
                    <td className="py-2 px-3 text-gray-900">{u.email}</td>
                    <td className="py-2 px-3 text-gray-900">{typeof u.searchCount === 'number' ? u.searchCount : 0}</td>
                    <td className="py-2 px-3 text-gray-900">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
