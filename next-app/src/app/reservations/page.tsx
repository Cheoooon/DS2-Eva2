import { getReservationsByDate } from "@/lib/actions/reservation"
import { getTables } from "@/lib/actions/table"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/Card"
import ReservationForm from "@/components/ReservationForm"
import DateFilter from "@/components/DateFilter"

export default async function ReservationsPage(props: { searchParams: Promise<{ date?: string }> }) {
  const searchParams = await props.searchParams
  const dateStr = searchParams.date || new Date().toISOString().split('T')[0]
  const date = new Date(dateStr + 'T00:00:00')
  
  const session = await auth()
  if (!session) redirect("/login")
  const [reservations, tables] = await Promise.all([
    getReservationsByDate(date),
    getTables(),
  ])

  const activeTables = tables.filter((t) => t.active)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reservas</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Filtrar por fecha:</label>
        <DateFilter defaultValue={dateStr} />
      </div>

      {activeTables.length > 0 && (
        <Card className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Nueva Reserva</h2>
          <ReservationForm
            tables={activeTables}
            userId={session.user?.id ?? ""}
          />
        </Card>
      )}

      <h2 className="text-lg font-semibold mb-4">Reservas el {date.toLocaleDateString()}</h2>
      {reservations.length === 0 ? (
        <p className="text-slate-500">No hay reservas para esta fecha.</p>
      ) : (
        <div className="grid gap-4">
          {reservations.map((res) => (
            <Card key={res.id}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{res.user.email}</p>
                  <p className="text-sm text-slate-500">
                    Mesa #{res.table.id.slice(-4)} · Capacidad: {res.table.capacity}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  res.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                  res.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                  res.status === "COMPLETED" ? "bg-slate-100 text-slate-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {res.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {new Date(res.startTime).toLocaleTimeString()} — {new Date(res.endTime).toLocaleTimeString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
