import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardDateSelector } from "@/components/DashboardDateSelector"
import TimelineView from "@/components/TimelineView"
import { getDashboardData } from "@/lib/actions/dashboard"

export default async function DashboardPage(props: { searchParams: Promise<{ date?: string }> }) {
  const searchParams = await props.searchParams
  const session = await auth()
  if (!session) redirect("/login")

  const dateStr = searchParams.date || new Date().toISOString().split('T')[0]
  const today = new Date(dateStr)
  const dashboardData = await getDashboardData(today)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Panel Principal</h1>
      <DashboardDateSelector />

      <h2 className="text-xl font-semibold mb-4">Ocupación de Mesas ({today.toLocaleDateString()})</h2>


      <TimelineView data={dashboardData} isAdmin={session.user?.role === 'ADMIN'} date={today} />
    </div>
  )
}
