'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

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
    suspiciousName?: string
    suspiciousCompany?: string
    amount?: number
    attemptedLoss?: number
    attemptedAmount?: number
    currency?: string
    date?: string
  }
  submittedBy?: string | {
    firstName?: string
    lastName?: string
    email: string
    phone?: string
  }
  guestSubmission?: {
    name: string
    email: string
    phone?: string
  }
  evidence?: {
    screenshots: string[]
    documents: string[]
    additionalInfo: string
  }
  location?: string
  tags: string[]
  reviewNotes?: string
  reviewedBy?: string | {
    firstName?: string
    lastName?: string
    email: string
    role?: string
  }
  reviewedAt?: string
  reportedAt: string
  createdAt: string
  updatedAt: string
}

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [report, setReport] = useState<FraudReport | null>(null)
  const [loading, setLoading] = useState(true)

  // Get return URL from query params or default to dashboard
  const returnUrl = searchParams.get('return') || '/dashboard'

  useEffect(() => {
    if (params.id) {
      loadReport()
    }
  }, [params.id])

  async function loadReport() {
    try {
      const res = await fetch(`/api/reports/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        // API returns { item: ... } but we expect report
        setReport(data.report || data.item)
      } else {
        router.push(returnUrl)
      }
    } catch (error) {
      router.push(returnUrl)
    } finally {
      setLoading(false)
    }
  }

  function formatCurrency(amount?: number, currency?: string) {
    if (typeof amount !== 'number') return 'N/A'
    try {
      return new Intl.NumberFormat(undefined, { 
        style: 'currency', 
        currency: currency || 'USD' 
      }).format(amount)
    } catch {
      return `${amount} ${currency || 'USD'}`
    }
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
      under_review: 'bg-blue-100 text-blue-700'
    }
    return classes[status as keyof typeof classes] || classes.pending
  }

  // Helper function to parse evidence fields
  function getEvidenceField(fieldName: string): string | null {
    if (!report?.evidence?.additionalInfo) return null
    
    const parts = report.evidence.additionalInfo.split(' | ')
    for (const part of parts) {
      if (part.startsWith(`${fieldName}: `)) {
        return part.substring(fieldName.length + 2)
      }
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow p-6 animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-gray-500">Report not found.</p>
            <Link href={returnUrl} className="mt-4 inline-block btn-primary">
              Back to Search Results
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Reported: {report.reportedAt ? new Date(report.reportedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusPill(report.status)}`}>
                {report.status}
              </span>
            </div>
          </div>

          {/* Review Banner */}
          {report.status !== 'pending' && (
            <div className={`rounded-lg border ${report.status === 'approved' ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'} p-4`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === 'approved' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                    {report.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                  <span className="text-sm text-gray-700">
                    {(() => {
                      const rb = report.reviewedBy
                      if (!rb) return 'by Reviewer'
                      if (typeof rb === 'string') return `by ${rb}`
                      const name = [rb.firstName, rb.lastName].filter(Boolean).join(' ') || rb.email
                      return `by ${name}`
                    })()}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {report.reviewedAt ? new Date(report.reviewedAt).toLocaleString() : ''}
                </div>
              </div>
              {report.status === 'rejected' && (
                <p className="mt-2 text-sm text-gray-800">
                  <span className="font-medium">Reason:</span> {report.reviewNotes || 'No notes provided'}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="mt-1 text-sm text-gray-900">{report.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{report.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="mt-1 text-sm text-gray-900">{getTypeLabel(report.type)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Severity</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{report.severity}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {report.tags && report.tags.length > 0 ? (
                      report.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No tags</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{report.location || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Fraudster Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraudster Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Suspicious Email</label>
                  <p className="mt-1 text-sm text-gray-900">{report.fraudsterDetails?.suspiciousEmail || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Suspicious Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{report.fraudsterDetails?.suspiciousPhone || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Suspicious Website</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {report.fraudsterDetails?.suspiciousWebsite ? (
                      <a href={report.fraudsterDetails.suspiciousWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {report.fraudsterDetails.suspiciousWebsite}
                      </a>
                    ) : 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Suspicious Name</label>
                  <p className="mt-1 text-sm text-gray-900">{report.fraudsterDetails?.suspiciousName || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Suspicious Company</label>
                  <p className="mt-1 text-sm text-gray-900">{report.fraudsterDetails?.suspiciousCompany || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(report.fraudsterDetails?.amount, report.fraudsterDetails?.currency)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Attempted Amount</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(report.fraudsterDetails?.attemptedAmount || report.fraudsterDetails?.attemptedLoss, report.fraudsterDetails?.currency)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <p className="mt-1 text-sm text-gray-900">{report.fraudsterDetails?.currency || 'USD'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {report.fraudsterDetails?.date ? new Date(report.fraudsterDetails.date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence & Documentation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence & Documentation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Websites/Social Media</label>
                <p className="mt-1 text-sm text-gray-900">{getEvidenceField('Websites/Social Media') || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Evidence Description</label>
                <p className="mt-1 text-sm text-gray-900">{getEvidenceField('Evidence Description') || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Attempted Loss</label>
                  <p className="mt-1 text-sm text-gray-900">{getEvidenceField('Attempted Loss') || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Methods</label>
                  <p className="mt-1 text-sm text-gray-900">{getEvidenceField('Payment Methods') || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Transaction Details</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{getEvidenceField('Transaction Details') || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Comments</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{getEvidenceField('Additional Comments') || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Screenshots</label>
                <div className="mt-1 space-y-2">
                  {report.evidence?.screenshots && report.evidence.screenshots.length > 0 ? (
                    report.evidence.screenshots.map((screenshot, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {screenshot.startsWith('data:') ? (
                          <button
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = screenshot
                              link.download = `screenshot-${index + 1}.png`
                              link.click()
                            }}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Screenshot {index + 1} (Download)
                          </button>
                        ) : (
                          <a href={screenshot} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            Screenshot {index + 1}
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No screenshots</p>
                  )}
                </div>
              </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Documents</label>
                <div className="mt-1 space-y-2">
                  {report.evidence?.documents && report.evidence.documents.length > 0 ? (
                    report.evidence.documents.map((docUrl, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {docUrl.startsWith('data:') ? (
                          <button
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = docUrl
                              link.download = `document-${index + 1}.pdf`
                              link.click()
                            }}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Document {index + 1} (Download)
                          </button>
                        ) : (
                          <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            Document {index + 1}
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No documents</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submitter Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitter Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {report.submittedBy ? 
                    (() => {
                      const user = report.submittedBy as any
                      if (typeof user === 'string') return user
                      const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
                      return name || user.email || 'Registered User'
                    })()
                    : (report.guestSubmission?.name || 'N/A')
                  }
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">
                  {report.submittedBy ? 
                    (() => {
                      const user = report.submittedBy as any
                      if (typeof user === 'string') return user
                      return user.email || 'N/A'
                    })()
                    : (report.guestSubmission?.email || 'N/A')
                  }
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">
                  {report.guestSubmission?.phone || 
                    (report.submittedBy ? 
                      (() => {
                        const user = report.submittedBy as any
                        if (typeof user === 'string') return 'N/A'
                        return user.phone || 'N/A'
                      })()
                      : 'N/A'
                    )
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Reported At</label>
                <p className="mt-1 text-sm text-gray-900">
                  {report.reportedAt ? new Date(report.reportedAt).toLocaleString() : 'N/A'}
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Created At</label>
                <p className="mt-1 text-sm text-gray-900">
                  {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Review Information */}
          {report.status !== 'pending' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Review Notes</label>
                  <p className="mt-1 text-sm text-gray-900">{report.reviewNotes || 'No notes provided'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reviewed At</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {report.reviewedAt ? new Date(report.reviewedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reviewed By</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {(() => {
                        const rb = report.reviewedBy
                        if (!rb) return 'N/A'
                        if (typeof rb === 'string') return rb
                        const name = [rb.firstName, rb.lastName].filter(Boolean).join(' ')
                        const role = rb.role?.replace('_', ' ')
                        return `${name || rb.email || 'Reviewer'}${role ? ` (${role})` : ''}`
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
