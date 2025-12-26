'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  reviewedBy?: string
  reviewedAt?: string
  reportedAt: string
  createdAt: string
  updatedAt: string
}

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const [report, setReport] = useState<FraudReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (params.id) {
      loadReport()
    }
  }, [params.id])

  async function loadReport() {
    try {
      const res = await fetch(`/api/manage/reports/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setReport(data.report)
        setFormData(data.report)
      } else {
        showToast('Failed to load report', 'error')
        router.push('/manage')
      }
    } catch (error) {
      showToast('Failed to load report', 'error')
      router.push('/manage')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      const res = await fetch(`/api/manage/reports/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        showToast('Report updated successfully', 'success')
        setEditing(false)
        loadReport() // Reload to get updated data
      } else {
        const error = await res.json()
        showToast(error.message || 'Failed to update report', 'error')
      }
    } catch (error) {
      showToast('Failed to update report', 'error')
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

  function handleArrayInputChange(field: string, value: string) {
    const items = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData({
      ...formData,
      [field]: items
    })
  }

  function handleEvidenceArrayChange(field: 'screenshots' | 'documents', value: string) {
    const items = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData({
      ...formData,
      evidence: {
        ...formData.evidence,
        [field]: items
      }
    })
  }

  // Helper functions to parse and update evidence fields
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

  function updateEvidenceField(fieldName: string, value: string) {
    if (!formData.evidence) {
      formData.evidence = { additionalInfo: '' }
    }
    
    const currentInfo = formData.evidence.additionalInfo || ''
    const parts = currentInfo.split(' | ').filter((part: string) => !part.startsWith(`${fieldName}: `))
    
    if (value.trim()) {
      parts.push(`${fieldName}: ${value}`)
    }
    
    const newInfo = parts.join(' | ')
    setFormData({
      ...formData,
      evidence: {
        ...formData.evidence,
        additionalInfo: newInfo
      }
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Report not found.</p>
      </div>
    )
  }

  const isEditable = report.status === 'pending'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusPill(report.status)}`}>{report.status}</span>
          <button
            onClick={() => setEditing(!editing)}
            disabled={!isEditable}
            className={`px-4 py-2 rounded-lg transition-colors ${isEditable ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            {editing ? 'Cancel Edit' : 'Edit Report'}
          </button>
        </div>
      </div>

      {/* Review Banner (top of page, above Basic Information and Fraud Details) */}
      {report.status !== 'pending' && (
        <div className={`rounded-lg border ${report.status === 'approved' ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'} p-4`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === 'approved' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                {report.status === 'approved' ? 'Approved' : 'Rejected'}
              </span>
              <span className="text-sm text-gray-700">
                {(() => {
                  const anyReport: any = report
                  const rb = anyReport.reviewedBy
                  const name = rb && typeof rb !== 'string' ? [rb.firstName, rb.lastName].filter(Boolean).join(' ') || rb.email : rb || 'Reviewer'
                  return `by ${name}`
                })()}
              </span>
            </div>
            <div className="text-xs text-gray-600">{report.reviewedAt ? new Date(report.reviewedAt).toLocaleString() : ''}</div>
          </div>
          {report.status === 'rejected' && (
            <p className="mt-2 text-sm text-gray-800"><span className="font-medium">Reason:</span> {report.reviewNotes || 'No notes provided'}</p>
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
              {editing ? (
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{report.title}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              {editing ? (
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{report.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                {editing ? (
                  <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="email">Email Fraud</option>
                    <option value="phone">Phone Fraud</option>
                    <option value="website">Website Fraud</option>
                    <option value="identity">Identity Theft</option>
                    <option value="financial">Financial Fraud</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{getTypeLabel(report.type)}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Severity</label>
                {editing ? (
                  <select
                    value={formData.severity || ''}
                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 capitalize">{report.severity}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="tag1, tag2, tag3"
                />
              ) : (
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
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: e.target.value
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter full address"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{report.location || 'N/A'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Fraudster Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraudster Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Suspicious Email</label>
              {editing ? (
                <input
                  type="email"
                  value={formData.fraudsterDetails?.suspiciousEmail || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    fraudsterDetails: {...formData.fraudsterDetails, suspiciousEmail: e.target.value}
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{report.fraudsterDetails?.suspiciousEmail || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Suspicious Phone</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.fraudsterDetails?.suspiciousPhone || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    fraudsterDetails: {...formData.fraudsterDetails, suspiciousPhone: e.target.value}
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{report.fraudsterDetails?.suspiciousPhone || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Suspicious Website</label>
              {editing ? (
                <input
                  type="url"
                  value={formData.fraudsterDetails?.suspiciousWebsite || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    fraudsterDetails: {...formData.fraudsterDetails, suspiciousWebsite: e.target.value}
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{report.fraudsterDetails?.suspiciousWebsite || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Suspicious Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.fraudsterDetails?.suspiciousName || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    fraudsterDetails: {...formData.fraudsterDetails, suspiciousName: e.target.value}
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{report.fraudsterDetails?.suspiciousName || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Suspicious Company</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.fraudsterDetails?.suspiciousCompany || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    fraudsterDetails: {...formData.fraudsterDetails, suspiciousCompany: e.target.value}
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{report.fraudsterDetails?.suspiciousCompany || 'N/A'}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                {editing ? (
                  <input
                    type="number"
                                      value={formData.fraudsterDetails?.amount || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    fraudsterDetails: {...formData.fraudsterDetails, amount: parseFloat(e.target.value) || 0}
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{formatCurrency(report.fraudsterDetails?.amount, report.fraudsterDetails?.currency)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Attempted Amount</label>
              {editing ? (
                <input
                  type="number"
                  value={formData.fraudsterDetails?.attemptedAmount || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    fraudsterDetails: {...formData.fraudsterDetails, attemptedAmount: parseFloat(e.target.value) || 0}
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{formatCurrency(report.fraudsterDetails?.attemptedAmount, report.fraudsterDetails?.currency)}</p>
              )}
            </div>
              
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              {editing ? (
                <select
                  value={formData.fraudsterDetails?.currency || 'USD'}
                  onChange={(e) => setFormData({
                    ...formData, 
                    fraudsterDetails: {...formData.fraudsterDetails, currency: e.target.value}
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{report.fraudsterDetails?.currency || 'USD'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              {editing ? (
                <input
                  type="date"
                  value={formData.fraudsterDetails?.date ? new Date(formData.fraudsterDetails.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    fraudsterDetails: {...formData.fraudsterDetails, date: e.target.value}
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {report.fraudsterDetails?.date ? new Date(report.fraudsterDetails.date).toLocaleDateString() : 'N/A'}
                </p>
              )}
            </div>
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
            {editing ? (
              <input
                type="text"
                value={getEvidenceField('Websites/Social Media') || ''}
                onChange={(e) => updateEvidenceField('Websites/Social Media', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter websites or social media links"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{getEvidenceField('Websites/Social Media') || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Evidence Description</label>
            {editing ? (
              <textarea
                value={getEvidenceField('Evidence Description') || ''}
                onChange={(e) => updateEvidenceField('Evidence Description', e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Describe the evidence"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{getEvidenceField('Evidence Description') || 'N/A'}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Attempted Loss</label>
              {editing ? (
                <input
                  type="number"
                  value={getEvidenceField('Attempted Loss') || ''}
                  onChange={(e) => updateEvidenceField('Attempted Loss', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter amount"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{getEvidenceField('Attempted Loss') || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Methods</label>
              {editing ? (
                <input
                  type="text"
                  value={getEvidenceField('Payment Methods') || ''}
                  onChange={(e) => updateEvidenceField('Payment Methods', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter payment methods used"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{getEvidenceField('Payment Methods') || 'N/A'}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Details</label>
            {editing ? (
              <textarea
                value={getEvidenceField('Transaction Details') || ''}
                onChange={(e) => updateEvidenceField('Transaction Details', e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter transaction details"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{getEvidenceField('Transaction Details') || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Comments</label>
            {editing ? (
              <textarea
                value={getEvidenceField('Additional Comments') || ''}
                onChange={(e) => updateEvidenceField('Additional Comments', e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter additional comments"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{getEvidenceField('Additional Comments') || 'N/A'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Screenshots</label>
            {editing ? (
              <div className="mt-1 space-y-2">
                {formData.evidence?.screenshots?.map((screenshot: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={screenshot}
                      onChange={(e) => {
                        const newScreenshots = [...(formData.evidence?.screenshots || [])]
                        newScreenshots[index] = e.target.value
                        setFormData({
                          ...formData,
                          evidence: {...formData.evidence, screenshots: newScreenshots}
                        })
                      }}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Enter screenshot URL or base64 data"
                    />
                    <button
                      type="button"
                                             onClick={() => {
                         const newScreenshots = formData.evidence?.screenshots?.filter((_: string, i: number) => i !== index) || []
                         setFormData({
                           ...formData,
                           evidence: {...formData.evidence, screenshots: newScreenshots}
                         })
                       }}
                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newScreenshots = [...(formData.evidence?.screenshots || []), '']
                    setFormData({
                      ...formData,
                      evidence: {...formData.evidence, screenshots: newScreenshots}
                    })
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-blue-300 rounded"
                >
                  + Add Screenshot
                </button>
              </div>
            ) : (
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
                            const link = document.createElement('a');
                            link.href = screenshot;
                            link.download = `screenshot-${index + 1}.png`;
                            link.click();
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
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Documents</label>
            {editing ? (
              <div className="mt-1 space-y-2">
                {formData.evidence?.documents?.map((document: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={document}
                      onChange={(e) => {
                        const newDocuments = [...(formData.evidence?.documents || [])]
                        newDocuments[index] = e.target.value
                        setFormData({
                          ...formData,
                          evidence: {...formData.evidence, documents: newDocuments}
                        })
                      }}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Enter document URL or base64 data"
                    />
                    <button
                      type="button"
                                             onClick={() => {
                         const newDocuments = formData.evidence?.documents?.filter((_: string, i: number) => i !== index) || []
                         setFormData({
                           ...formData,
                           evidence: {...formData.evidence, documents: newDocuments}
                         })
                       }}
                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newDocuments = [...(formData.evidence?.documents || []), '']
                    setFormData({
                      ...formData,
                      evidence: {...formData.evidence, documents: newDocuments}
                    })
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-blue-300 rounded"
                >
                  + Add Document
                </button>
              </div>
            ) : (
              <div className="mt-1 space-y-2">
                {report.evidence?.documents && report.evidence.documents.length > 0 ? (
                  report.evidence.documents.map((document, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {document.startsWith('data:') ? (
                        <button
                          onClick={() => {
                            const link = window.document.createElement('a');
                            link.href = document;
                            link.download = `document-${index + 1}.pdf`;
                            link.click();
                          }}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Document {index + 1} (Download)
                        </button>
                      ) : (
                        <a href={document} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          Document {index + 1}
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No documents</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submitter Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitter Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            {editing ? (
              <input
                type="text"
                value={formData.guestSubmission?.name || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  guestSubmission: {...formData.guestSubmission, name: e.target.value}
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            ) : (
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
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            {editing ? (
              <input
                type="email"
                value={formData.guestSubmission?.email || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  guestSubmission: {...formData.guestSubmission, email: e.target.value}
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            ) : (
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
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            {editing ? (
              <input
                type="text"
                value={formData.guestSubmission?.phone || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  guestSubmission: {...formData.guestSubmission, phone: e.target.value}
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            ) : (
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
            )}
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

      {/* Review Information (detailed card) */}
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
                    const anyReport: any = report
                    const rb = anyReport.reviewedBy
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

      {/* Action Buttons */}
      {editing && (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
}
