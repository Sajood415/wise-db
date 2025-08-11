import Link from 'next/link'

export const metadata = {
  title: 'Report Submitted — Dashboard',
  description: 'Your fraud report has been submitted and is pending review.'
}

export default async function DashboardReportSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="py-2">
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted</h1>
          <p className="text-gray-600 mb-6">Thank you. Your report has been received and will be reviewed by our team shortly.</p>

          <div className="flex items-center justify-center gap-3">
            <Link href="/dashboard/report-fraud" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Submit Another</Link>
            <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


