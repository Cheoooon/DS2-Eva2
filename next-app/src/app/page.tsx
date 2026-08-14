import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { DashboardDateSelector } from "@/components/DashboardDateSelector"
import TimelineView from "@/components/TimelineView"
import { getDashboardData } from "@/lib/actions/dashboard"

export default async function DashboardPage(props: { searchParams: Promise<{ date?: string }> }) {
  const searchParams = await props.searchParams
  const session = await auth()
  if (!session) redirect("/login")

  const now = new Date()
  const dateStr = searchParams.date || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
  const today = new Date(dateStr)
  const dashboardData = await getDashboardData(today)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Panel Principal</h1>
      <p className="mb-6 text-slate-600">Bienvenido, {session.user?.name || session.user?.email}</p>
      
      <DashboardDateSelector />
      
      <TimelineView data={dashboardData} isAdmin={session.user?.role === 'ADMIN'} date={today} />
      <div className="mt-8 text-center">
        <Link href={`/reservations/history?date=${dateStr}`} className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-4">
          Ver historial de reservas para este día
        </Link>
      </div>
    </div>
  )
}
