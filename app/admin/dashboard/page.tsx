"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useToast } from "@/contexts/ToastContext"

type UrgentItem = {
  id: string
  title: string
  category: string
  amountLabel?: string
  dateLabel?: string
}

type EnterpriseRequest = {
  id: string
  company: string
  contactName: string
  category: string
  requestedAt: string
}

export default function AdminDashboardPage() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<"dashboard" | "fraud" | "enterprise" | "users" | "sub_admins">("users")
  const [loadingReports, setLoadingReports] = useState(false)
  const [reports, setReports] = useState<any[]>([])
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number }>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [filters, setFilters] = useState<{ status: string; type: string; q: string; severity: string; email: string; phone: string; minAmount: string; maxAmount: string }>({ status: "", type: "", q: "", severity: "", email: "", phone: "", minAmount: "", maxAmount: "" })
  const [reloadKey, setReloadKey] = useState(0)
  // Users tab state
  const [usersLoading, setUsersLoading] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [usersPage, setUsersPage] = useState(1)
  const [usersLimit, setUsersLimit] = useState(20)
  const [usersTotal, setUsersTotal] = useState(0)
  const [userFilters, setUserFilters] = useState<{ q: string; role: string; subscriptionStatus: string; isActive: string }>({ q: '', role: '', subscriptionStatus: '', isActive: '' })
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [userConfirmOpen, setUserConfirmOpen] = useState(false)
  const [userConfirmAction, setUserConfirmAction] = useState<"toggle" | "delete" | null>(null)
  const [userConfirmTarget, setUserConfirmTarget] = useState<any | null>(null)

  function AddSubAdmin({ onAdded }: { onAdded: () => void }) {
    const { showToast } = useToast()
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
    const [loading, setLoading] = useState(false)
    async function submit(e: React.FormEvent) {
      e.preventDefault()
      setLoading(true)
      try {
        const res = await fetch('/api/admin/sub-admins', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to create')
        showToast('Sub admin created', 'success')
        setOpen(false)
        setForm({ firstName: '', lastName: '', email: '', password: '' })
        onAdded()
      } catch (e: any) {
        showToast(e.message || 'Failed to create', 'error')
      } finally {
        setLoading(false)
      }
    }
    return (
      <>
        <button onClick={()=> setOpen(true)} className="px-4 py-2 rounded-md bg-gray-900 text-white">Add Sub Admin</button>
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Create Sub Admin</h4>
              <button aria-label="Close" onClick={()=> setOpen(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full border border-black text-black hover:bg-gray-50">✕</button>
              <form onSubmit={submit} className="space-y-3">
                <input value={form.firstName} onChange={(e)=> setForm(f=>({...f, firstName: e.target.value}))} placeholder="First name" className="w-full border rounded-md px-3 py-2 text-black" required />
                <input value={form.lastName} onChange={(e)=> setForm(f=>({...f, lastName: e.target.value}))} placeholder="Last name" className="w-full border rounded-md px-3 py-2 text-black" required />
                <input type="email" value={form.email} onChange={(e)=> setForm(f=>({...f, email: e.target.value}))} placeholder="Email" className="w-full border rounded-md px-3 py-2 text-black" required />
                <input type="password" value={form.password} onChange={(e)=> setForm(f=>({...f, password: e.target.value}))} placeholder="Password" className="w-full border rounded-md px-3 py-2 text-black" required />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={()=> setOpen(false)} className="px-4 py-2 rounded-md border border-black text-black">Cancel</button>
                  <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-gray-900 text-white disabled:opacity-60">{loading ? 'Creating...' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  }

  function SubAdminsList() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [total, setTotal] = useState(0)
    const [q, setQ] = useState('')
    const [isActive, setIsActive] = useState('')
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmAction, setConfirmAction] = useState<'toggle' | 'delete' | null>(null)
    const [confirmTarget, setConfirmTarget] = useState<any | null>(null)
    useEffect(() => {
      let cancelled = false
      async function load() {
        setLoading(true)
        try {
          const params = new URLSearchParams()
          params.set('page', String(page)); params.set('limit', String(limit))
          if (q) params.set('q', q)
          if (isActive) params.set('isActive', isActive)
          const res = await fetch(`/api/admin/sub-admins?${params.toString()}`, { cache: 'no-store' })
          const data = await res.json()
          if (!cancelled) {
            setItems(data.items || [])
            setTotal(data.pagination?.total || 0)
          }
        } catch (e: any) {
          if (!cancelled) showToast(e.message || 'Failed to load', 'error')
        } finally {
          if (!cancelled) setLoading(false)
        }
      }
      load()
      return () => { cancelled = true }
    }, [page, limit, q, isActive])

    return (
      <div className="space-y-4">
        <form onSubmit={(e)=>{ e.preventDefault(); setPage(1) }} className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-6">
            <label className="block text-xs text-gray-600 mb-1">Search</label>
            <input value={q} onChange={(e)=> setQ(e.target.value)} placeholder="Name or email" className="w-full border rounded-md px-3 py-2 text-sm text-black" />
          </div>
          <div className="lg:col-span-3">
            <label className="block text-xs text-gray-600 mb-1">Status</label>
            <select value={isActive} onChange={(e)=> setIsActive(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white">
              <option value="">All</option>
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div className="lg:col-span-3 flex items-end justify-end gap-3">
            <button type="button" onClick={()=>{ setQ(''); setIsActive(''); setPage(1) }} className="px-4 py-2 rounded-md border">Reset</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-gray-900 text-white">Apply</button>
          </div>
        </form>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading sub admins...</div>
        ) : (
          <div className="space-y-2">
            {items.length === 0 && (<div className="py-12 text-center text-gray-500">No sub admins found.</div>)}
            {items.map((u) => (
              <div key={u._id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900 truncate">{u.firstName} {u.lastName}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-white text-gray-700">sub_admin</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{u.isActive ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>{ setConfirmTarget(u); setConfirmAction('toggle'); setConfirmOpen(true) }} className={`inline-flex items-center justify-center px-3 h-9 rounded-md border ${u.isActive ? 'text-rose-700 border-rose-300 hover:bg-rose-50' : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'}`}>{u.isActive ? 'Disable' : 'Enable'}</button>
                    <button onClick={()=>{ setConfirmTarget(u); setConfirmAction('delete'); setConfirmOpen(true) }} className="inline-flex items-center justify-center px-3 h-9 rounded-md border text-rose-700 border-rose-300 hover:bg-rose-50">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-600">Page {page} of {Math.max(Math.ceil(total / limit), 1)} • Total {total}</p>
          <div className="flex items-center gap-2">
            <button onClick={()=> setPage(p=> Math.max(1, p-1))} disabled={page<=1} className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50">Previous</button>
            <button onClick={()=> setPage(p=> Math.min(Math.ceil(total/limit) || p, p+1))} disabled={page >= (Math.ceil(total/limit) || 1)} className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50">Next</button>
          </div>
        </div>

        {/* Confirmation dialog for sub admin actions */}
        {confirmOpen && confirmTarget && confirmAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 ${confirmAction==='delete' ? 'bg-rose-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mr-3`}>
                  <svg className={`w-5 h-5 ${confirmAction==='delete' ? 'text-rose-600' : 'text-blue-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13V4z"/></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {confirmAction === 'delete' ? 'Delete Sub Admin' : (confirmTarget.isActive ? 'Disable Sub Admin' : 'Enable Sub Admin')}
                </h3>
              </div>
              <p className="text-gray-700 mb-6">{confirmAction === 'delete' ? 'Are you sure you want to permanently delete this sub admin?' : 'Are you sure you want to change this sub admin\'s status?'}<br/>
                <span className="font-medium">{confirmTarget.firstName} {confirmTarget.lastName}</span> • {confirmTarget.email}
              </p>
              <div className="flex justify-end space-x-3">
                <button onClick={()=>{ setConfirmOpen(false); setConfirmTarget(null); setConfirmAction(null) }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={async()=>{
                  try {
                    if (confirmAction==='delete') {
                      const res = await fetch(`/api/admin/sub-admins/${confirmTarget._id}`, { method: 'DELETE' })
                      if (res.ok) setItems(prev=> prev.filter(x=> x._id !== confirmTarget._id))
                    } else if (confirmAction==='toggle') {
                      const res = await fetch(`/api/admin/sub-admins/${confirmTarget._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !confirmTarget.isActive }) })
                      if (res.ok) setItems(prev=> prev.map(x=> x._id===confirmTarget._id? { ...x, isActive: !confirmTarget.isActive }: x))
                    }
                  } finally {
                    setConfirmOpen(false); setConfirmTarget(null); setConfirmAction(null)
                  }
                }} className={`px-4 py-2 ${confirmAction==='delete' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-gray-900 hover:bg-black'} text-white rounded-lg transition-colors`}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Sample metrics (replace with API later)
  const [overview, setOverview] = useState<any>(null)

  const metrics = useMemo(() => {
    const formatCurrency = (val: number) => `$${(val ?? 0).toLocaleString()}`
    const trVal = overview?.totalReports?.value ?? 0
    const trChange = overview?.totalReports?.changePct
    const trSub = (typeof trChange === 'number') ? `${trChange >= 0 ? '+' : ''}${trChange.toFixed(1)}% from last month` : ''
    const prVal = overview?.pendingReviews?.value ?? 0
    const auVal = overview?.activeUsers?.value ?? 0
    const auChange = overview?.activeUsers?.changePct
    const auSub = (typeof auChange === 'number') ? `${auChange >= 0 ? '+' : ''}${auChange.toFixed(1)}% from last month` : ''
    const revVal = overview?.monthlyRevenue?.value ?? 0
    const revLabel = overview?.monthlyRevenue?.label || 'Enterprise + Subscriptions'
    return [
      { label: "Total Reports", value: String(trVal), sub: trSub, icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/><path d="M7 9h10M7 13h6"/></svg>
      ) },
      { label: "Pending Reviews", value: String(prVal), sub: "Requires attention", icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
      ) },
      { label: "Active Users", value: String(auVal), sub: auSub, icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      ) },
      { label: "Monthly Revenue", value: formatCurrency(revVal), sub: revLabel, icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3 3 0 0 1 0 6H6"/></svg>
      ) },
    ]
  }, [overview])

  const urgentItems: UrgentItem[] = [
    { id: "u1", title: "Fake Investment Platform - CryptoGains", category: "Investment Fraud", amountLabel: "$15,000", dateLabel: "2024-01-20" },
    { id: "u2", title: "Romance Scam - Dating App", category: "Romance Scam", amountLabel: "$8,000", dateLabel: "2024-01-18" },
  ]

  const enterpriseRequests: EnterpriseRequest[] = [
    { id: "e1", company: "SecureBank Corp", contactName: "Sarah Wilson", category: "Banking & Finance", requestedAt: "2024-01-18" },
  ]

  function handleUrgentAction(kind: "view" | "approve" | "reject", item: UrgentItem) {
    if (kind === "view") {
      showToast(`Opening report: ${item.title}`, "info")
      return
    }
    if (kind === "approve") {
      if (confirm("Approve this report?")) {
        showToast("Report approved", "success")
      }
      return
    }
    if (kind === "reject") {
      const reason = prompt("Provide rejection reason:")
      if (reason && reason.trim()) {
        showToast("Report rejected", "success")
      } else {
        showToast("Rejection cancelled", "info")
      }
    }
  }

  function handleEnterpriseAction(kind: "view" | "approve" | "reject", req: EnterpriseRequest) {
    if (kind === "view") {
      showToast(`Viewing request from ${req.company}`, "info")
      return
    }
    if (kind === "approve") {
      if (confirm("Approve enterprise access request?")) {
        showToast("Enterprise request approved", "success")
      }
      return
    }
    if (kind === "reject") {
      const reason = prompt("Provide rejection reason:")
      if (reason && reason.trim()) {
        showToast("Enterprise request rejected", "success")
      } else {
        showToast("Rejection cancelled", "info")
      }
    }
  }

  function safeFormatCurrency(amount?: number, code?: string): string | undefined {
    if (typeof amount !== 'number' || Number.isNaN(amount)) return undefined
    const cur = (code || 'USD').toUpperCase()
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(amount)
    } catch {
      try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount)
      } catch {
        return `$${amount.toFixed(2)}`
      }
    }
  }

  // Load users when Users tab active / filters change
  useEffect(() => {
    if (activeTab !== 'users') return
    let cancelled = false
    async function loadUsers() {
      try {
        setUsersLoading(true)
        const params = new URLSearchParams()
        params.set('page', String(usersPage))
        params.set('limit', String(usersLimit))
        if (userFilters.q) params.set('q', userFilters.q)
        if (userFilters.role) params.set('role', userFilters.role)
        if (userFilters.subscriptionStatus) params.set('subscriptionStatus', userFilters.subscriptionStatus)
        if (userFilters.isActive) params.set('isActive', userFilters.isActive)
        const res = await fetch(`/api/admin/users?${params.toString()}`, { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled) {
          setUsers(data.items || [])
          setUsersTotal(data.pagination?.total || 0)
        }
      } catch {
        if (!cancelled) setUsers([])
      } finally {
        if (!cancelled) setUsersLoading(false)
      }
    }
    loadUsers()
    return () => { cancelled = true }
  }, [activeTab, usersPage, usersLimit, userFilters.q, userFilters.role, userFilters.subscriptionStatus, userFilters.isActive])

  // Fetch admin overview metrics when on Dashboard tab
  useEffect(() => {
    if (activeTab !== 'dashboard') return
    let cancelled = false
    async function loadOverview() {
      try {
        const res = await fetch('/api/admin/overview', { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load overview')
        if (!cancelled) setOverview(data)
      } catch {
        // leave defaults
      }
    }
    loadOverview()
    return () => { cancelled = true }
  }, [activeTab])

  // Load fraud reports when on the Fraud tab or filters/pagination change
  useEffect(() => {
    if (activeTab !== "fraud") return
    let cancelled = false
    async function load() {
      setLoadingReports(true)
      try {
        const params = new URLSearchParams()
        params.set("page", String(pagination.page))
        params.set("limit", String(pagination.limit))
        if (filters.status) params.set("status", filters.status)
        if (filters.type) params.set("type", filters.type)
        if (filters.q) params.set("q", filters.q)
        if (filters.severity) params.set("severity", filters.severity)
        if (filters.email) params.set("email", filters.email)
        if (filters.phone) params.set("phone", filters.phone)
        const min = parseFloat(filters.minAmount)
        const max = parseFloat(filters.maxAmount)
        if (!Number.isNaN(min)) params.set("minAmount", String(min))
        if (!Number.isNaN(max)) params.set("maxAmount", String(max))
        const res = await fetch(`/api/manage/reports?${params.toString()}`, { cache: "no-store" })
        const data = await res.json()
        if (!cancelled) {
          setReports(data.reports || [])
          setPagination((p) => ({ ...p, total: data.pagination?.total || 0, totalPages: data.pagination?.totalPages || 0 }))
        }
      } catch (e) {
        if (!cancelled) showToast("Failed to load reports", "error")
      } finally {
        if (!cancelled) setLoadingReports(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [activeTab, pagination.page, pagination.limit, filters.status, filters.type, filters.q, filters.severity, filters.email, filters.phone, filters.minAmount, filters.maxAmount, reloadKey])

  async function triggerAction(id: string, kind: 'approve' | 'reject') {
    try {
      setActionLoading(id)
      let body: any = undefined
      if (kind === 'reject') {
        const reason = prompt('Provide rejection reason:')
        if (!reason || !reason.trim()) { setActionLoading(null); return }
        body = JSON.stringify({ reason: reason.trim() })
      }
      const res = await fetch(`/api/manage/reports/${id}/${kind}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `Failed to ${kind}`)
      showToast(`Report ${kind}ed`, 'success')
      // Optimistically update local list
      setReports(prev => prev.map(r => r._id === id ? { ...r, status: kind === 'approve' ? 'approved' : 'rejected', reviewedAt: new Date().toISOString() } : r))
      // Trigger a background refresh
      setReloadKey(k => k + 1)
    } catch (e: any) {
      showToast(e.message || 'Action failed', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Load admin overview metrics when entering dashboard tab */}
      {activeTab === 'dashboard' && null}
      {/* Segmented tabs (match user dashboard style) */}
      <div className="w-full bg-gray-100 rounded-md p-1">
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
              activeTab === "dashboard" ? "bg-white text-blue-700 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
              activeTab === "users" ? "bg-white text-blue-700 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab("fraud")}
            className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
              activeTab === "fraud" ? "bg-white text-blue-700 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Fraud Reports
          </button>
          <button
            onClick={() => setActiveTab("enterprise")}
            className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
              activeTab === "enterprise" ? "bg-white text-blue-700 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Enterprise Requests
          </button>
          <button
            onClick={() => setActiveTab("sub_admins")}
            className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
              activeTab === "sub_admins" ? "bg-white text-blue-700 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sub Admins
          </button>
        </div>
      </div>

      {activeTab === "dashboard" && (
        <>
          {/* Metric cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">{m.label}</p>
                  <div className="w-7 h-7 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center">{m.icon}</div>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">{m.value}</p>
                {m.sub ? (<p className="mt-1 text-xs text-emerald-600">{m.sub}</p>) : null}
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Actions */}
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                <h3 className="text-lg font-semibold text-gray-900">Urgent Actions Required</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">Items that need immediate attention</p>
              <div className="space-y-3">
                {urgentItems.map((it) => (
                  <div key={it.id} className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-medium text-gray-900">{it.title}</p>
                        <p className="text-xs text-rose-700">
                          {it.category}
                          {it.amountLabel ? ` • ${it.amountLabel}` : ""}
                          {it.dateLabel ? ` • ${it.dateLabel}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleUrgentAction("view", it)} className="inline-flex items-center justify-center w-9 h-9 rounded-md border bg-white text-gray-700 hover:bg-gray-50">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        </button>
                        <button onClick={() => handleUrgentAction("approve", it)} className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">✓</button>
                        <button onClick={() => handleUrgentAction("reject", it)} className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-rose-600 text-white hover:bg-rose-700">✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Enterprise Requests */}
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/></svg>
                <h3 className="text-lg font-semibold text-gray-900">Enterprise Requests</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">New API access requests from companies</p>
              <div className="space-y-3">
                {enterpriseRequests.map((req) => (
                  <div key={req.id} className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-medium text-gray-900">{req.company}</p>
                        <p className="text-xs text-gray-600">{req.contactName} • {req.category} • {req.requestedAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEnterpriseAction("view", req)} className="inline-flex items-center justify-center w-10 h-9 rounded-md border bg-white text-gray-700 hover:bg-gray-50">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20l9-5-9-5-9 5 9 5z"/><path d="M12 12l9-5-9-5-9 5 9 5z"/></svg>
                        </button>
                        <button onClick={() => handleEnterpriseAction("approve", req)} className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">✓</button>
                        <button onClick={() => handleEnterpriseAction("reject", req)} className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-rose-600 text-white hover:bg-rose-700">✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      {/* Sub Admins Tab */}
      {activeTab === "sub_admins" && (
        <section className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sub Admins</h3>
              <p className="text-sm text-gray-600">Add, enable/disable or delete sub admins</p>
            </div>
            <AddSubAdmin onAdded={()=> setUsersPage(1)} />
          </div>
          <SubAdminsList />
        </section>
      )}

      

      {/* Enterprise Requests Tab */}
      {activeTab === "enterprise" && (
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Enterprise Requests</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{enterpriseRequests.length} pending</span>
          </div>
          <div className="mt-4 space-y-3">
            {enterpriseRequests.map((req) => (
              <div key={req.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-medium text-gray-900">{req.company}</p>
                    <p className="text-xs text-gray-600">{req.contactName} • {req.category} • {req.requestedAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEnterpriseAction("view", req)} className="inline-flex items-center justify-center w-10 h-9 rounded-md border bg-white text-gray-700 hover:bg-gray-50">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20l9-5-9-5-9 5 9 5z"/><path d="M12 12l9-5-9-5-9 5 9 5z"/></svg>
                    </button>
                    <button onClick={() => handleEnterpriseAction("approve", req)} className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">✓</button>
                    <button onClick={() => handleEnterpriseAction("reject", req)} className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-rose-600 text-white hover:bg-rose-700">✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* User Management Tab */}
      {activeTab === "users" && (
        <section className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <p className="text-sm text-gray-600">Search, view, activate/deactivate, assign roles, or delete users</p>
          </div>

          {/* Filters - themed grid like Search UI */}
          <form onSubmit={(e)=>{ e.preventDefault(); setUsersPage(1) }} className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-4">
              <label className="block text-xs text-gray-600 mb-1">Search</label>
              <input value={userFilters.q} onChange={(e)=> setUserFilters(f=>({...f,q:e.target.value}))} placeholder="Search name or email" className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-xs text-gray-600 mb-1">Role</label>
              <select value={userFilters.role} onChange={(e)=> setUserFilters(f=>({...f,role:e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">All</option>
                <option value="individual">Individual</option>
                <option value="enterprise_admin">Enterprise Admin</option>
                <option value="enterprise_user">Enterprise User</option>
                <option value="sub_admin">Sub Admin</option>
              </select>
            </div>
            <div className="lg:col-span-3">
              <label className="block text-xs text-gray-600 mb-1">Subscription</label>
              <select value={userFilters.subscriptionStatus} onChange={(e)=> setUserFilters(f=>({...f,subscriptionStatus:e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Status</label>
              <select value={userFilters.isActive} onChange={(e)=> setUserFilters(f=>({...f,isActive:e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">All</option>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Rows per page</label>
              <select value={usersLimit} onChange={(e)=> setUsersLimit(Number(e.target.value))} className="w-full border rounded-md px-3 py-2 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="lg:col-span-3 flex items-end justify-end gap-3">
              <button type="button" onClick={()=>{ setUserFilters({ q:'', role:'', subscriptionStatus:'', isActive:'' }); setUsersPage(1); }} className="px-4 py-2 rounded-md border text-gray-700">Reset</button>
              <button type="submit" className="px-4 py-2 rounded-md bg-gray-900 text-white">Apply</button>
            </div>
          </form>

          {/* Users list */}
          {usersLoading ? (
            <div className="py-12 text-center text-gray-500">Loading users...</div>
          ) : (
            <div className="space-y-2">
              {users.length === 0 && (
                <div className="py-12 text-center text-gray-500">No users found.</div>
              )}
              {users.map((u) => (
                <div key={u._id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-gray-900 truncate">{u.firstName} {u.lastName}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full border bg-white text-gray-700">{u.role}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{u.isActive ? 'Enabled' : 'Disabled'}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.subscription?.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{u.subscription?.status}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`/admin/users/${u._id}`} className="inline-flex items-center gap-2 px-3 h-9 rounded-md border bg-white text-gray-700 hover:bg-gray-50" title="View">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        View
                      </a>
                      <button onClick={()=>{ setUserConfirmTarget(u); setUserConfirmAction('toggle'); setUserConfirmOpen(true) }} className={`inline-flex items-center justify-center px-3 h-9 rounded-md border ${u.isActive ? 'text-rose-700 border-rose-300 hover:bg-rose-50' : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'}`} title={u.isActive? 'Disable' : 'Enable'}>
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={()=>{ setUserConfirmTarget(u); setUserConfirmAction('delete'); setUserConfirmOpen(true) }} className="inline-flex items-center justify-center px-3 h-9 rounded-md border text-rose-700 border-rose-300 hover:bg-rose-50" title="Delete">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Users pagination */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-600">Page {usersPage} of {Math.max(Math.ceil(usersTotal / usersLimit), 1)} • Total {usersTotal}</p>
            <div className="flex items-center gap-2">
              <button onClick={()=> setUsersPage((p)=> Math.max(1, p-1))} disabled={usersPage<=1} className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50">Previous</button>
              <button onClick={()=> setUsersPage((p)=> Math.min(Math.ceil(usersTotal / usersLimit) || p, p+1))} disabled={usersPage >= (Math.ceil(usersTotal / usersLimit) || 1)} className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50">Next</button>
            </div>
          </div>

          {/* No modal; viewing opens dedicated page */}
        </section>
      )}

      {/* User enable/disable/delete confirmation dialog */}
      {userConfirmOpen && userConfirmTarget && userConfirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 ${userConfirmAction==='delete' ? 'bg-rose-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mr-3`}>
                <svg className={`w-5 h-5 ${userConfirmAction==='delete' ? 'text-rose-600' : 'text-blue-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13V4z"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {userConfirmAction === 'delete' ? 'Delete User' : (userConfirmTarget.isActive ? 'Disable User' : 'Enable User')}
              </h3>
            </div>
            <p className="text-gray-700 mb-6">{userConfirmAction === 'delete' ? 'Are you sure you want to permanently delete this user?' : 'Are you sure you want to change this user\'s status?'}<br/>
              <span className="font-medium">{userConfirmTarget.firstName} {userConfirmTarget.lastName}</span> • {userConfirmTarget.email}
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={()=>{ setUserConfirmOpen(false); setUserConfirmTarget(null); setUserConfirmAction(null) }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={async()=>{
                try {
                  if (userConfirmAction==='delete') {
                    const res = await fetch(`/api/admin/users/${userConfirmTarget._id}`, { method: 'DELETE' })
                    if (res.ok) setUsers(prev=> prev.filter(x=> x._id !== userConfirmTarget._id))
                  } else if (userConfirmAction==='toggle') {
                    const res = await fetch(`/api/admin/users/${userConfirmTarget._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !userConfirmTarget.isActive }) })
                    if (res.ok) setUsers(prev=> prev.map(x=> x._id===userConfirmTarget._id? { ...x, isActive: !userConfirmTarget.isActive }: x))
                  }
                } finally {
                  setUserConfirmOpen(false); setUserConfirmTarget(null); setUserConfirmAction(null)
                }
              }} className={`px-4 py-2 ${userConfirmAction==='delete' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-gray-900 hover:bg-black'} text-white rounded-lg transition-colors`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fraud Reports Tab - full management */}
      {activeTab === "fraud" && (
        <section className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Fraud Reports Management</h3>
              <p className="text-sm text-gray-600">Review, approve, or reject fraud reports submitted by users</p>
            </div>
          </div>

          {/* Filters - match user dashboard search UI */}
          <form
            onSubmit={(e)=>{ e.preventDefault(); setPagination(p=>({...p, page:1})) }}
            className="mt-2 grid grid-cols-1 lg:grid-cols-12 gap-3"
          >
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Status</label>
              <select value={filters.status} onChange={(e)=> setFilters(f=>({...f,status:e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">Any</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="under_review">Under Review</option>
              </select>
            </div>
            <div className="lg:col-span-3">
              <label className="block text-xs text-gray-600 mb-1">Keyword</label>
              <input value={filters.q} onChange={(e)=> setFilters(f=>({...f,q:e.target.value}))} placeholder="Title, description, tags..." className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Type of fraud</label>
              <select value={filters.type} onChange={(e)=> setFilters(f=>({...f,type:e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">Any</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="website">Website</option>
                <option value="identity">Identity</option>
                <option value="financial">Financial</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Risk level</label>
              <select value={filters.severity} onChange={(e)=> setFilters(f=>({...f,severity:e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">Any</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Email</label>
              <input value={filters.email} onChange={(e)=> setFilters(f=>({...f,email:e.target.value}))} placeholder="Email address" className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-xs text-gray-600 mb-1">Phone</label>
              <input value={filters.phone} onChange={(e)=> setFilters(f=>({...f,phone:e.target.value}))} placeholder="Phone number" className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Min amount</label>
              <input value={filters.minAmount} onChange={(e)=> setFilters(f=>({...f,minAmount:e.target.value.replace(/[^\d.]/g,'')}))} placeholder="0.00" className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Max amount</label>
              <input value={filters.maxAmount} onChange={(e)=> setFilters(f=>({...f,maxAmount:e.target.value.replace(/[^\d.]/g,'')}))} placeholder="1000.00" className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div className="lg:col-span-3 flex items-end justify-start gap-3">
              <button type="button" onClick={()=>{ setFilters({ status: "", type: "", q: "", severity: "", email: "", phone: "", minAmount: "", maxAmount: "" }); setPagination(p=>({...p, page:1 })) }} className="px-4 py-2 rounded-md border text-gray-700">Reset</button>
              <button type="submit" className="px-4 py-2 rounded-md bg-gray-900 text-white">Apply</button>
            </div>
            <div className="lg:col-span-2 flex items-end justify-end">
              <select value={pagination.limit} onChange={(e)=> setPagination(p=>({...p, page:1, limit: Number(e.target.value)}))} className="w-full border rounded-md px-3 py-2 text-sm bg-white text-black">
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>
          </form>

          {loadingReports ? (
            <div className="py-12 text-center text-gray-500">Loading reports...</div>
          ) : (
            <div className="space-y-3">
              {reports.length === 0 && (
                <div className="py-12 text-center text-gray-500">No reports found.</div>
              )}
              {reports.map((r) => {
                const locationLabel = [r?.location?.city, r?.location?.region, r?.location?.country].filter(Boolean).join(', ')
                const amount = r?.fraudDetails?.amount
                const currency = r?.fraudDetails?.currency
                const amountLabel = safeFormatCurrency(amount, currency)
                return (
                  <div key={r._id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900 truncate">{r.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : r.status === 'pending' ? 'bg-gray-100 text-gray-800' : r.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{r.status}</span>
                          {r.type && (<span className="text-xs px-2 py-0.5 rounded-full border bg-white text-gray-700">{r.type}</span>)}
                        </div>
                        <div className="mt-1 text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
                          {locationLabel && <span>Location: {locationLabel}</span>}
                          {amountLabel && <span>Loss: <span className="text-rose-600 font-medium">{amountLabel}</span></span>}
                          {r.guestSubmission?.email && <span>Submitter: {r.guestSubmission.name || 'Guest'} ({r.guestSubmission.email})</span>}
                        </div>
                        {r.description && (
                          <p className="mt-2 text-sm text-gray-700 line-clamp-2">{r.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/manage/reports/${r._id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-md border bg-white text-gray-700 hover:bg-gray-50" title="View / Edit">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        </Link>
                        {r.status === 'pending' && (
                          <>
                            <button onClick={() => triggerAction(r._id, 'approve')} disabled={actionLoading === r._id} className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60" title="Approve">✓</button>
                            <button onClick={() => triggerAction(r._id, 'reject')} disabled={actionLoading === r._id} className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60" title="Reject">✕</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-600">Page {pagination.page} of {Math.max(pagination.totalPages, 1)} • Total {pagination.total}</p>
            <div className="flex items-center gap-2">
              <button onClick={()=> setPagination(p=>({...p, page: Math.max(1, p.page - 1)}))} disabled={pagination.page <= 1} className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50">Previous</button>
              <button onClick={()=> setPagination(p=>({...p, page: Math.min(p.totalPages || p.page, p.page + 1)}))} disabled={pagination.page >= (pagination.totalPages || 1)} className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}


