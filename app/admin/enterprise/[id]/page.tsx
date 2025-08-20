import dbConnect from '@/lib/mongodb'
import EnterpriseRequest from '@/models/EnterpriseRequest'

type Params = Promise<{ id: string }>

export default async function EnterpriseRequestDetail({ params }: { params: Params }) {
  const { id } = await params
  await dbConnect()
  const doc: any = await EnterpriseRequest.findById(id).lean()
  if (!doc) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold text-gray-900">Enterprise Request</h1>
        <p className="mt-2 text-gray-600">Not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Enterprise Request</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full ${doc.status === 'new' ? 'bg-blue-100 text-blue-700' : doc.status === 'in_review' ? 'bg-amber-100 text-amber-700' : doc.status === 'contacted' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{doc.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-medium text-gray-900 mb-2">Company</h2>
          <dl className="text-sm text-gray-700 space-y-2">
            <div>
              <dt className="text-gray-600">Company Name</dt>
              <dd className="text-black">{doc.companyName}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Industry</dt>
              <dd className="text-black">{doc.industry || '-'}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Requested</dt>
              <dd className="text-black">{new Date(doc.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-medium text-gray-900 mb-2">Contact</h2>
          <dl className="text-sm text-gray-700 space-y-2">
            <div>
              <dt className="text-gray-600">Contact Name</dt>
              <dd className="text-black">{doc.contactName}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Business Email</dt>
              <dd className="text-black">{doc.businessEmail}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Phone Number</dt>
              <dd className="text-black">{doc.phoneNumber}</dd>
            </div>
          </dl>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-medium text-gray-900 mb-2">Requirements</h2>
          <dl className="text-sm text-gray-700 space-y-2">
            <div>
              <dt className="text-gray-600">When Needed</dt>
              <dd className="text-black">{doc.whenNeeded}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Number of Searches</dt>
              <dd className="text-black">{doc.numberOfSearches}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Number of Users</dt>
              <dd className="text-black">{doc.numberOfUsers}</dd>
            </div>
          </dl>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-medium text-gray-900 mb-2">Message</h2>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{doc.message || '-'}</p>
        </div>
      </div>
    </div>
  )
}


