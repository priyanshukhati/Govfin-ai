import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="min-h-screen bg-gray-50/50">

      <Sidebar />

      <div className="flex min-h-screen flex-col lg:ml-64">

        {/* MOBILE TOP SPACING */}
        <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          {children}
        </main>

      </div>
    </div>
  )
}
