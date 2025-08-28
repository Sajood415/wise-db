import connectToDatabase from '@/lib/mongodb'
import Fraud from '@/models/Fraud'
import mongoose from 'mongoose'
import { notFound } from 'next/navigation'

export default async function DashboardReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id || !mongoose.Types.ObjectId.isValid(id)) notFound()
  await connectToDatabase()
  const raw = await Fraud.findById(id).lean()
  if (!raw || Array.isArray(raw)) notFound()
  const r = raw as any
  const attemptedInfo = typeof r?.evidence?.additionalInfo === 'string'
    ? (r.evidence.additionalInfo.split(' | ').find((p: string) => p.startsWith('Attempted Loss: ')) || '').slice('Attempted Loss: '.length)
    : ''

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{r.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Submitted: {new Date(r.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${r.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : r.status === 'pending' ? 'bg-amber-50 text-amber-700' : r.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'}`}>{r.status}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div><span className="font-medium">Type:</span> {r.type}</div>
            <div><span className="font-medium">Loss:</span> {r.fraudsterDetails?.amount ? `${r.fraudsterDetails.amount} ${r.fraudsterDetails.currency || 'USD'}` : 'N/A'}</div>
            <div><span className="font-medium">Attempted Loss:</span> {typeof (r.fraudsterDetails?.attemptedAmount ?? r.fraudsterDetails?.attemptedLoss) === 'number' ? `${(r.fraudsterDetails?.attemptedAmount ?? r.fraudsterDetails?.attemptedLoss)} ${r.fraudsterDetails?.currency || 'USD'}` : (attemptedInfo ? `${attemptedInfo} ${r.fraudsterDetails?.currency || 'USD'}` : 'N/A')}</div>
            <div><span className="font-medium">Date:</span> {r.fraudsterDetails?.date ? new Date(r.fraudsterDetails.date).toLocaleDateString() : 'N/A'}</div>
            <div><span className="font-medium">Severity:</span> {r.severity}</div>
            <div><span className="font-medium">Tags:</span> {r.tags?.length ? r.tags.join(', ') : '—'}</div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.description}</p>
        </section>
      </div>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Incident Details</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div><span className="font-medium">Suspicious Email:</span> {r.fraudsterDetails?.suspiciousEmail || '—'}</div>
          <div><span className="font-medium">Suspicious Phone:</span> {r.fraudsterDetails?.suspiciousPhone || '—'}</div>
          <div><span className="font-medium">Suspicious Website:</span> {r.fraudsterDetails?.suspiciousWebsite || '—'}</div>
          <div><span className="font-medium">Suspicious Name:</span> {r.fraudsterDetails?.suspiciousName || '—'}</div>
          <div><span className="font-medium">Suspicious Company:</span> {r.fraudsterDetails?.suspiciousCompany || '—'}</div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Reporter</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div><span className="font-medium">User:</span> {r.submittedBy ? 
              (() => {
                const user = r.submittedBy as any
                if (typeof user === 'string') return user
                const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
                return name || user.email || 'Registered User'
              })()
              : (r.guestSubmission?.name || 'Guest')
            }</div>
            {r.guestSubmission?.email ? (<div><span className="font-medium">Email:</span> {r.guestSubmission.email}</div>) : null}
            {r.guestSubmission?.phone ? (<div><span className="font-medium">Phone:</span> {r.guestSubmission.phone}</div>) : null}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div><span className="font-medium">Address:</span> {r.location || '—'}</div>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Evidence</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <div><span className="font-medium">Additional Info:</span> {r.evidence?.additionalInfo || '—'}</div>
          <div className="flex flex-wrap gap-2">
            {r.evidence?.screenshots?.map((u: string, i: number) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">Screenshot {i+1}</span>
            ))}
            {r.evidence?.documents?.map((u: string, i: number) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">Document {i+1}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Review</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <div><span className="font-medium">Reviewed By:</span> {r.reviewedBy ? String(r.reviewedBy) : '—'}</div>
          <div><span className="font-medium">Review Notes:</span> {r.reviewNotes || '—'}</div>
          <div><span className="font-medium">Reported At:</span> {r.reportedAt ? new Date(r.reportedAt).toLocaleString() : '—'}</div>
          <div><span className="font-medium">Reviewed At:</span> {r.reviewedAt ? new Date(r.reviewedAt).toLocaleString() : '—'}</div>
        </div>
      </section>
    </div>
  )
}


