import DashboardLayout from '../dashboard/layout'

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}