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
  fraudDetails?: { amount?: number; currency?: string }
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
  const [recent, setRecent] = useState<FraudItem[]>([])
  const [myReports, setMyReports] = useState<MyReportsResponse | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "my_reports" | "search">("overview")
  const { showToast } = useToast()

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
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        icon: "📚",
      },
      {
        label: "My Reports",
        value: overview?.mine.total ?? 0,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        icon: "🧾",
      },
      {
        label: "Searches (this month)",
        value: overview?.searches.thisMonth ?? 0,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        icon: "🔎",
      },
      {
        label: "Saved Searches",
        value: overview?.searches.saved ?? 0,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        icon: "⭐",
      },
    ]
  }, [overview])

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`w-9 h-9 ${s.iconBg} rounded-lg flex items-center justify-center`}>
                  <span className={`${s.iconColor} text-lg`}>{s.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
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
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{new Date(item.updatedAt).toLocaleDateString()}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.status === "approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : item.status === "rejected"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
      )}

      {/* My Recent Reports - visible in Overview and My Reports */}
      {(activeTab === "overview" || activeTab === "my_reports") && (
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">My Recent Reports</h3>
        <div className="mt-4 space-y-4">
          {myReports?.items?.length ? (
            myReports.items.map((r) => (
              <div key={r._id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{r.title}</p>
                  <div className="text-sm text-gray-600 flex items-center gap-3">
                    <span>
                      Financial Loss: {r.fraudDetails?.amount ? `${r.fraudDetails.amount} ${r.fraudDetails.currency || "USD"}` : "N/A"}
                    </span>
                    <span>Submitted: {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      r.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : r.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : r.status === "rejected"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {r.status}
                  </span>
                  <Link href={`/dashboard/reports/${r._id}`} className="text-sm text-blue-600 hover:underline">
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
          <h3 className="text-lg font-semibold text-gray-900">Search Database</h3>
          <p className="text-sm text-gray-500">Search UI will be added here.</p>
        </section>
      )}
    </div>
  )
}