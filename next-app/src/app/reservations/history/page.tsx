import { getReservations } from "@/lib/actions/reservation"
import { getTables } from "@/lib/actions/table"
import { STATUS_LABELS } from "@/lib/constants"
import { FilterBar } from "@/components/FilterBar"
import { ReservationActions } from "@/components/ReservationActions"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/Card"
import Link from "next/link"

export default async function ReservationHistoryPage(props: { searchParams: Promise<{ date?: string, sort?: string, tableId?: string }> }) {
  const searchParams = await props.searchParams
  const date = searchParams.date || new Date().toISOString().split('T')[0]
  const tableId = searchParams.tableId
  const sort = (searchParams.sort === 'asc' || searchParams.sort === 'desc') ? searchParams.sort : 'desc'
  
  const session = await auth()
  if (!session) redirect("/login")
  
  const [reservations, tables] = await Promise.all([
      getReservations({ date, sort, tableId }),
      getTables()
  ])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/reservations" className="text-slate-500 hover:text-slate-800">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold">Historial de reservas</h1>
      </div>

      <FilterBar tables={tables} />


      {reservations.length > 0 ? (
        <div className="grid gap-4">
          {reservations.map((res) => (
            <Card key={res.id}>
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-lg">{res.customerName}</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          res.status === 'PENDING' ? 'bg-slate-100' :
                          res.status === 'IN_PROGRESS' ? 'bg-yellow-100' :
                          res.status === 'COMPLETED' ? 'bg-green-100' :
                          res.status === 'CANCELLED' ? 'bg-red-100' :
                          'bg-blue-100'
                      }`}>
                          {STATUS_LABELS[res.status as keyof typeof STATUS_LABELS]}
                      </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                      <p><span className="font-semibold">Mesa:</span> {res.table?.name || 'N/A'}</p>
                      <p><span className="font-semibold">Personas:</span> {res.occupants}</p>
                      <p><span className="font-semibold">Fecha:</span> {res.date}</p>
                      <p><span className="font-semibold">Horario:</span> {res.startHour}:00 — {res.endHour}:00</p>
                  </div>
                  
                  {res.notes && (
                      <p className="text-sm mt-3 bg-slate-50 p-2 rounded italic text-slate-600 border">
                          <span className="font-semibold block not-italic">Notas:</span>
                          {res.notes}
                      </p>
                  )}
                  
                  <p className="text-xs text-slate-400 mt-3">
                      Creada: {res.createdAt ? new Date(res.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  <ReservationActions reservation={res} isAdmin={session.user?.role === 'ADMIN'} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-slate-600">No se encontraron reservas con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  )
}
