import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getReservationsByDate } from "@/lib/actions/reservation"
import { Card } from "@/components/ui/Card"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const today = new Date()
  const todaysReservations = await getReservationsByDate(today)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Panel Principal</h1>
      <p className="mb-6 text-slate-600">Bienvenido, {session.user?.name || session.user?.email}</p>
      
      <h2 className="text-xl font-semibold mb-4">Reservas de Hoy ({today.toLocaleDateString()})</h2>
      {todaysReservations.length === 0 ? (
        <p className="text-slate-500">No hay reservas para hoy.</p>
      ) : (
        <div className="grid gap-4">
          {todaysReservations.map((res) => (
            <Card key={res.id} className="p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{res.user.name || res.user.email}</span>
                <span className="text-sm text-slate-600 font-mono">
                  {new Date(res.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(res.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <div className="text-sm text-slate-500">Mesa #{res.table.id.slice(-4)}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
