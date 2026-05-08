import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="ml-64 flex min-h-screen flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
