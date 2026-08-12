import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDashboardData } from "@/lib/actions/dashboard"
import TimelineView from "@/components/TimelineView"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const today = new Date()
  const dashboardData = await getDashboardData(today)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Panel Principal</h1>
      <p className="mb-6 text-slate-600">Bienvenido, {session.user?.name || session.user?.email}</p>
      
      <h2 className="text-xl font-semibold mb-4">Ocupación de Mesas ({today.toLocaleDateString()})</h2>
      
      <TimelineView data={dashboardData} isAdmin={session.user?.role === 'ADMIN'} />
    </div>
  )
}
