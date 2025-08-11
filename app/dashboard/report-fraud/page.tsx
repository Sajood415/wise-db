import ReportFraudForm from '@/app/report-fraud/ReportFraudForm'

export const metadata = {
  title: 'Report Fraud — Dashboard',
  description: 'Submit a fraud report from your dashboard.',
}

export default function DashboardReportFraudPage() {
  return (
    <div className="-mt-2">
      <ReportFraudForm />
    </div>
  )
}


