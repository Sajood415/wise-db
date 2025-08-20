"use client"

import { useEffect, useState } from "react"

export default function MyReportsPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/dashboard/recent-activity?limit=100', { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled) setItems(data.items || [])
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recent Activity</h1>
        <p className="text-gray-600 mt-1">All your recent activity in Wise DB</p>
      </div>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
        {loading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {items.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity.</p>
            )}
            {items.map((item) => (
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
        )}
      </section>
    </div>
  )
}


