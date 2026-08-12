import { getReservationsByDate } from "@/lib/actions/reservation"
import { getTablesSorted } from "@/lib/actions/table"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/Card"
import ReservationForm from "@/components/ReservationForm"
import DateFilter from "@/components/DateFilter"

export default async function ReservationsPage(props: { searchParams: Promise<{ date?: string, time?: string, table?: string }> }) {
  const searchParams = await props.searchParams
  const dateStr = searchParams.date || new Date().toISOString().split('T')[0]
  const date = new Date(dateStr + 'T00:00:00')
  
  const session = await auth()
  if (!session) redirect("/login")
  
  const [reservations, tables] = await Promise.all([
    getReservationsByDate(date),
    getTablesSorted(),
  ])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reservas</h1>

      <Card className="mb-8 p-6 bg-slate-50">
        <h2 className="text-lg font-semibold mb-4">Nueva Reserva</h2>
        <ReservationForm
          tables={tables}
          userId={session.user?.id ?? ""}
          initialDate={searchParams.date}
          initialTableId={searchParams.table}
        />
      </Card>
    
      <h2 className="text-2xl font-bold mb-6">Historial de reservas </h2>
    
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Filtrar por fecha:</label>
        <DateFilter defaultValue={dateStr} />
      </div>
    
      <h2 className="text-lg font-semibold mb-4">Reservas el {date.toLocaleDateString()}</h2>
      {reservations.length === 0 ? (
        <p className="text-slate-500 mb-8">No hay reservas para esta fecha.</p>
      ) : (
        <div className="grid gap-4 mb-8">
          {reservations.map((res) => (
            <Card key={res.id}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{res.customerName}</p>
                  <p className="text-sm text-slate-500">
                    Mesa {res.table.name} · {res.occupants} personas
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100">
                  {res.status}
                </span>
                <p className="text-sm font-semibold">{res.startHour}:00 — {res.endHour}:00</p>
              </div>
              {res.notes && <p className="text-sm italic text-slate-400 mt-1">Notas: {res.notes}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
