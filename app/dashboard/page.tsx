"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useToast } from '@/contexts/ToastContext'

type OverviewResponse = {
  totals: { totalReports: number; approvedReports: number; pendingReports: number; rejectedReports: number }
  mine: { total: number; approved: number; pending: number; rejected: number }
  searches: { thisMonth: number; saved: number }
}

  type FraudItem = {
  _id: string
  title: string
  status: "pending" | "approved" | "rejected" | "under_review"
  type: string
    description?: string
  fraudDetails?: { amount?: number; currency?: string }
    tags?: string[]
  createdAt: string
  updatedAt: string
}

type MyReportsResponse = {
  items: FraudItem[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<OverviewResponse | null>(null)
  const [recent, setRecent] = useState<any[]>([])
  const [myReports, setMyReports] = useState<MyReportsResponse | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "my_reports" | "search">("overview")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchForm, setSearchForm] = useState({ q: "", type: "", status: "", country: "", minAmount: "", maxAmount: "" })
  const [searchResults, setSearchResults] = useState<FraudItem[] | null>(null)
  const [searchMeta, setSearchMeta] = useState<{ source: 'real' | 'dummy'; searchesUsed: number; searchLimit: number } | null>(null)
  const { showToast } = useToast()

  function formatCurrency(amount?: number, code?: string) {
    if (typeof amount !== 'number' || Number.isNaN(amount)) return '$0'
    const cur = (code || 'USD').toUpperCase()
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(amount)
    } catch {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount)
    }
  }

  function getCategoryLabel(item: FraudItem): string {
    const tag = (item.tags && item.tags[0]) ? item.tags[0] : ''
    if (tag) return tag.charAt(0).toUpperCase() + tag.slice(1)
    const map: Record<string,string> = {
      email: 'Email Fraud',
      phone: 'Phone Fraud',
      website: 'Website Fraud',
      identity: 'Identity Fraud',
      financial: 'Financial Fraud',
      other: 'Other'
    }
    return map[item.type] || 'Fraud'
  }

  function statusPillClasses(status: FraudItem['status']): string {
    switch (status) {
      case 'approved':
        return 'bg-gray-900 text-white'
      case 'pending':
        return 'bg-gray-200 text-gray-800'
      case 'rejected':
        return 'bg-rose-600 text-white'
      default:
        return 'bg-blue-100 text-blue-700'
    }
  }

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const [o, r, m] = await Promise.all([
          fetch("/api/dashboard/overview").then((res) => res.json()),
          fetch("/api/dashboard/recent-activity?limit=5").then((res) => res.json()),
          fetch("/api/dashboard/my-reports?page=1&pageSize=5").then((res) => res.json()),
        ])
        if (!isMounted) return
        setOverview(o)
        setRecent(r.items || [])
        setMyReports(m)
      } catch (err) {
        console.error("Failed to load dashboard data", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const stats = useMemo(() => {
    return [
      {
        label: "Total Reports",
        value: overview?.totals.totalReports ?? 0,
        sub: "In database",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        icon: "📚",
      },
      {
        label: "My Reports",
        value: overview?.mine.total ?? 0,
        sub: "Submitted by you",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        icon: "🧾",
      },
      {
        label: "Searches",
        value: (overview as any)?.searches?.used ?? 0,
        sub: "",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        icon: "🔎",
      },
    ]
  }, [overview])

  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSearchLoading(true)
    setSearchResults(null)
    try {
      const payload: any = {
        q: searchForm.q || undefined,
        type: searchForm.type || undefined,
        status: searchForm.status || undefined,
        country: searchForm.country || undefined,
      }
      const min = Number(searchForm.minAmount)
      const max = Number(searchForm.maxAmount)
      if (!Number.isNaN(min)) payload.minAmount = min
      if (!Number.isNaN(max)) payload.maxAmount = max
      const res = await fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Search failed')
      setSearchResults(data.items || [])
      setSearchMeta({ source: data.source, searchesUsed: data.searchesUsed, searchLimit: data.searchLimit })
    } catch (err: any) {
      showToast(err.message || 'Search failed', 'error')
    } finally {
      setSearchLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-lg shadow p-6 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-2">Here’s what’s happening with your fraud reports and searches.</p>
      </div>

      {/* Tabs - full width, expanded, 3 segments */}
      <div className="w-full bg-gray-100 rounded-md p-1">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
              activeTab === "overview"
                ? "bg-white text-blue-700 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("my_reports")}
            className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
              activeTab === "my_reports"
                ? "bg-white text-blue-700 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Reports
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
              activeTab === "search"
                ? "bg-white text-blue-700 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Search Database
          </button>
        </div>
      </div>

      {/* Stat cards - only for Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`w-9 h-9 ${s.iconBg} rounded-lg flex items-center justify-center`}>
                  <span className={`${s.iconColor} text-lg`}>{s.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  {('sub' in s) && (s as any).sub !== undefined && (
                    <p className="text-xs text-emerald-600 mt-1">{(s as any).sub}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions + Recent Activity */}
      {activeTab === "overview" && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-500 mb-4">Common tasks and shortcuts</p>
          <div className="space-y-3">
            <Link href="/dashboard/report-fraud" className="w-full inline-flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 bg-gray-900 text-white hover:bg-gray-800 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6"/>
              </svg>
              <span className="font-medium">Report New Fraud</span>
            </Link>
            <button onClick={() => setActiveTab('search')} className="w-full flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 text-gray-900 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span className="font-medium">Search Database</span>
            </button>
            <button onClick={() => showToast('Export will be available soon', 'info')} className="w-full flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 text-gray-900 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span className="font-medium">Export My Data</span>
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Link href="/my-reports" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {recent.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity yet.</p>
            )}
            {recent.map((item) => (
              <div key={item._id} className="border rounded-md p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {item.type === 'search' ? `Search: ${item.title}` : item.title}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(item.updatedAt).toLocaleDateString()}</p>
                </div>
                {item.type === 'search' ? (
                  <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'real' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span>
                ) : (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700'
                      : item.status === 'pending'
                      ? 'bg-amber-50 text-amber-700'
                      : item.status === 'rejected'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>{item.status}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      )}

       {/* My Reports list in Overview and My Reports tab */}
      {(activeTab === "overview" || activeTab === "my_reports") && (
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">My Recent Reports</h3>
        <div className="mt-4 space-y-3">
          {myReports?.items?.length ? (
            myReports.items.map((r) => (
              <div key={r._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 truncate">{r.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusPillClasses(r.status)}`}>{r.status}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-white text-gray-700">{getCategoryLabel(r)}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      <span>
                        Loss: <span className="text-rose-600 font-medium">{formatCurrency(r.fraudDetails?.amount as number, r.fraudDetails?.currency)}</span>
                      </span>
                      <span className="mx-2">•</span>
                      <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/reports/${r._id}`} className="ml-4 inline-flex items-center gap-1 text-sm text-gray-700 border rounded px-3 py-1.5 hover:bg-gray-50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    View
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">You have not submitted any reports yet.</p>
          )}
        </div>
      </section>
      )}

      {/* Search Database - simple placeholder */}
      {activeTab === "search" && (
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Search Database</h3>
          </div>
          <form onSubmit={handleSearchSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <input value={searchForm.q} onChange={(e)=>setSearchForm(s=>({...s,q:e.target.value}))} placeholder="Keyword" className="border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500" />
            <select value={searchForm.type} onChange={(e)=>setSearchForm(s=>({...s,type:e.target.value}))} className="border rounded-md px-3 py-2 text-sm text-black bg-white">
              <option value="">Type</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="website">Website</option>
              <option value="identity">Identity</option>
              <option value="financial">Financial</option>
              <option value="other">Other</option>
            </select>
            <select value={searchForm.status} onChange={(e)=>setSearchForm(s=>({...s,status:e.target.value}))} className="border rounded-md px-3 py-2 text-sm text-black bg-white">
              <option value="">Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="under_review">Under review</option>
            </select>
            <input value={searchForm.country} onChange={(e)=>setSearchForm(s=>({...s,country:e.target.value}))} placeholder="Country" className="border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500" />
            <input value={searchForm.minAmount} onChange={(e)=>setSearchForm(s=>({...s,minAmount:e.target.value.replace(/[^\d.]/g,'')}))} placeholder="Min Amount" className="border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500" />
            <input value={searchForm.maxAmount} onChange={(e)=>setSearchForm(s=>({...s,maxAmount:e.target.value.replace(/[^\d.]/g,'')}))} placeholder="Max Amount" className="border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500" />
            <div className="col-span-1 md:col-span-3 lg:col-span-6 flex justify-end gap-3 mt-1">
              <button type="button" onClick={()=>{setSearchForm({q:"",type:"",status:"",country:"",minAmount:"",maxAmount:""}); setSearchResults(null);}} className="px-4 py-2 rounded-md border text-gray-700">Reset</button>
              <button type="submit" disabled={searchLoading} className="px-4 py-2 rounded-md bg-gray-900 text-white disabled:opacity-60">{searchLoading? 'Searching...' : 'Search'}</button>
            </div>
          </form>

          <div className="mt-6">
            {!searchResults && (
              <p className="text-sm text-gray-500">Enter filters and click Search to see results.</p>
            )}
            {searchResults && searchResults.length === 0 && (
              <p className="text-sm text-gray-500">No results found.</p>
            )}
            {searchResults && searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map((r)=> (
                  <div key={r._id} className="border rounded-md p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{r.title}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Verified</span>
                        </div>
                        <div className="text-xs text-gray-600 flex items-center gap-4">
                          <span>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</span>
                          <span>{formatCurrency(r.fraudDetails?.amount as number, r.fraudDetails?.currency)}</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">{r.type}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{r.description}</p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 bg-rose-50/60 border border-rose-200 rounded p-3">
                      <div className="flex items-center gap-2 text-rose-700">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4"/><path d="M2 12h4"/><path d="M12 2v4"/><path d="M12 22v-4"/><path d="M7.8 7.8l-2.8-2.8"/><path d="M16.2 16.2l2.8 2.8"/><path d="M7.8 16.2l-2.8 2.8"/><path d="M16.2 7.8l2.8-2.8"/></svg>
                        <span className="font-medium">Scammer Contact Information</span>
                      </div>
                      <div className="flex items-center gap-2 text-rose-700"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.66 12.66 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.66 12.66 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>{(r as any).contact?.phone || 'N/A'}</div>
                      <div className="flex items-center gap-2 text-rose-700"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/></svg>{(r as any).contact?.email || 'N/A'}</div>
                      <div className="flex items-center gap-2 text-rose-700 md:col-span-3"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>{(r as any).contact?.website || 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}