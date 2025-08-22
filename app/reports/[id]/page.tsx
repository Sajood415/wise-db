import Link from 'next/link'
import connectToDatabase from '@/lib/mongodb'
import Fraud from '@/models/Fraud'
import mongoose from 'mongoose'
import { notFound } from 'next/navigation'

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id || !mongoose.Types.ObjectId.isValid(id)) notFound()
  await connectToDatabase()
  const raw = await Fraud.findById(id).lean()
  if (!raw || Array.isArray(raw)) notFound()
  const r = raw as any
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{r.title}</h1>
              <p className="text-sm text-gray-500 mt-1">Submitted: {new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full capitalize ${r.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : r.status === 'pending' ? 'bg-amber-50 text-amber-700' : r.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'}`}>{r.status}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div><span className="font-medium">Type:</span> {r.type}</div>
                <div><span className="font-medium">Loss:</span> {r.fraudsterDetails?.amount ? `${r.fraudsterDetails.amount} ${r.fraudsterDetails.currency || 'USD'}` : 'N/A'}</div>
                <div><span className="font-medium">Date:</span> {r.fraudsterDetails?.date ? new Date(r.fraudsterDetails.date).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.description}</p>
            </div>
          </div>

          {r.tags?.length ? (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {r.tags.map((t: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{t}</span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center gap-3">
            <Link href="/dashboard" className="btn-primary">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


