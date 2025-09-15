import Link from 'next/link'

export const metadata = {
  title: 'Report Submitted — Wise DB',
  description: 'Your fraud report has been submitted and is pending review.'
}

export default async function ReportSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted</h1>
          <div className="text-gray-600 mb-6 space-y-4 text-left">
            <p>Thank you for taking the time to report the Fraud. We’ve received your fraud report, and we will review the details carefully.</p>
            <p>Your vigilance helps us keep our community safe and secure. If we need any additional information, we will reach out to you directly.</p>
            <p>Stay safe!</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link href="/report-fraud" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Submit Another</Link>
            <Link href="/" className="btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


