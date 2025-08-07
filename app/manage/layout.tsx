import DashboardLayout from '../dashboard/layout'

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}