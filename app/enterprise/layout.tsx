export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Public layout for Enterprise landing/forms (no auth wrapper)
  return <>{children}</>
}