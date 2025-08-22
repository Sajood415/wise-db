'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'

type FraudReport = {
  _id: string
  title: string
  description: string
  type: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  severity: 'low' | 'medium' | 'high' | 'critical'
  fraudsterDetails?: {
    suspiciousEmail?: string
    suspiciousPhone?: string
    suspiciousWebsite?: string
    amount?: number
    currency?: string
  }
  submittedBy?: string
  guestSubmission?: {
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

type DashboardStats = {
  pendingReviews: number
  verifiedToday: number
  totalReviewed: number
}

export default function SubAdminHome() {
  const [reports, setReports] = useState<FraudReport[]>([])
  const [stats, setStats] = useState<DashboardStats>({ pendingReviews: 0, verifiedToday: 0, totalReviewed: 0 })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [selectedReport, setSelectedReport] = useState<FraudReport | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null)
  const { showToast } = useToast()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [reportsRes, statsRes] = await Promise.all([
        fetch('/api/manage/reports'),
        fetch('/api/manage/stats')
      ])
      
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json()
        setReports(reportsData.reports || [])
      }
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      showToast('Failed to load reports', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function refreshData() {
    try {
      setRefreshing(true)
      await loadData()
    } finally {
      setRefreshing(false)
    }
  }

  async function handleAction(reportId: string, action: 'approve' | 'reject', reason?: string) {
    setActionLoading(reportId)
    try {
      const res = await fetch(`/api/manage/reports/${reportId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      
      if (res.ok) {
        showToast(`Report ${action}d successfully`, 'success')
        await refreshData()
      } else {
        const error = await res.json()
        showToast(error.message || `Failed to ${action} report`, 'error')
      }
    } catch (error) {
      showToast(`Failed to ${action} report`, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  function openConfirmDialog(report: FraudReport, action: 'approve' | 'reject') {
    setSelectedReport(report)
    setPendingAction(action)
    if (action === 'reject') {
      setShowRejectDialog(true)
    } else {
      setShowConfirmDialog(true)
    }
  }

  function handleConfirmAction() {
    if (!selectedReport || !pendingAction) return

    if (pendingAction === 'approve') {
      handleAction(selectedReport._id, 'approve')
      setShowConfirmDialog(false)
    } else if (pendingAction === 'reject') {
      if (!rejectReason.trim()) {
        showToast('Please provide a reason for rejection', 'error')
        return
      }
      handleAction(selectedReport._id, 'reject', rejectReason.trim())
      setShowRejectDialog(false)
      setRejectReason('')
    }

    setSelectedReport(null)
    setPendingAction(null)
  }

  function handleCancelAction() {
    setShowConfirmDialog(false)
    setShowRejectDialog(false)
    setSelectedReport(null)
    setPendingAction(null)
    setRejectReason('')
  }

  function getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      email: 'Email Fraud',
      phone: 'Phone Fraud', 
      website: 'Website Fraud',
      identity: 'Identity Theft',
      financial: 'Financial Fraud',
      other: 'Other'
    }
    return labels[type] || type
  }

  function getStatusPill(status: string) {
    const classes = {
      pending: 'bg-gray-100 text-gray-800',
      approved: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-rose-100 text-rose-700',
      verified: 'bg-gray-900 text-white',
      under_review: 'bg-blue-100 text-blue-700'
    }
    return classes[status as keyof typeof classes] || classes.pending
  }

  function getSubmitterName(report: FraudReport): string {
    if (report.submittedBy) {
      return 'Registered User' // We could fetch user details if needed
    }
    return report.guestSubmission?.name || 'Guest User'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-lg shadow p-6 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fraud Reports for Review</h1>
        <p className="text-gray-600 mt-2">Review and verify fraud reports submitted by users.</p>
      </div>

      {/* Stats Cards */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
              <p className="text-xs text-emerald-600 mt-1">Awaiting verification</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Verified Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verifiedToday}</p>
              <p className="text-xs text-emerald-600 mt-1">Reports processed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reviewed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReviewed}</p>
              <p className="text-xs text-emerald-600 mt-1">This month</p>
            </div>
          </div>
        </div>
        </div>
        {refreshing && (
          <div className="absolute inset-0 bg-white/60 rounded-lg flex items-center justify-center z-10">
            <svg className="animate-spin h-6 w-6 text-gray-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="ml-2 text-sm text-gray-700">Updating...</span>
          </div>
        )}
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow relative">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Fraud Reports for Review</h3>
          <p className="text-sm text-gray-500">Review and verify fraud reports submitted by users.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{report.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getSubmitterName(report)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getTypeLabel(report.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusPill(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/manage/reports/${report._id}`}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        title="View"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => openConfirmDialog(report, 'approve')}
                            disabled={actionLoading === report._id}
                            className="w-8 h-8 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => openConfirmDialog(report, 'reject')}
                            disabled={actionLoading === report._id}
                            className="w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-200 flex items-center justify-center transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {reports.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No fraud reports found.</p>
          </div>
        )}
        {refreshing && (
          <div className="absolute inset-0 bg-white/60 rounded-lg flex items-center justify-center z-10">
            <svg className="animate-spin h-6 w-6 text-gray-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="ml-2 text-sm text-gray-700">Updating...</span>
          </div>
        )}
      </div>

      {/* Approve Confirmation Dialog */}
      {showConfirmDialog && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Approval</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve the report "{selectedReport.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelAction}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={actionLoading === selectedReport._id}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {actionLoading === selectedReport._id ? 'Approving...' : 'Approve Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      {showRejectDialog && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Reject Report</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject the report "{selectedReport.title}"? This action cannot be undone.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection <span className="text-rose-600">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
                placeholder="Please provide a reason for rejecting this report..."
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelAction}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={actionLoading === selectedReport._id || !rejectReason.trim()}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {actionLoading === selectedReport._id ? 'Rejecting...' : 'Reject Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


