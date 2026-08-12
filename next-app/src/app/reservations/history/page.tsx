import { getReservations } from "@/lib/actions/reservation"
import { getTables } from "@/lib/actions/table"
import { STATUS_LABELS } from "@/lib/constants"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/Card"
import Link from "next/link"

export default async function ReservationHistoryPage(props: { searchParams: Promise<{ date?: string, sort?: string, tableId?: string }> }) {
  const searchParams = await props.searchParams
  const date = searchParams.date
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

      <div className="flex flex-wrap gap-4 mb-6">
        <Link href={`/reservations/history?date=${date || ''}&sort=${sort}`} className={`px-4 py-2 rounded ${!tableId ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Todas las mesas</Link>
        {tables.map(table => (
            <Link key={table.id} href={`/reservations/history?date=${date || ''}&sort=${sort}&tableId=${table.id}`} className={`px-4 py-2 rounded ${tableId === table.id ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>{table.name}</Link>
        ))}
      </div>
      <div className="flex gap-4 mb-6">
        <Link href={`/reservations/history?date=${date || ''}&tableId=${tableId || ''}&sort=asc`} className={`px-4 py-2 rounded ${sort === 'asc' ? 'bg-slate-200' : 'bg-slate-100'}`}>Más antiguas</Link>
        <Link href={`/reservations/history?date=${date || ''}&tableId=${tableId || ''}&sort=desc`} className={`px-4 py-2 rounded ${sort === 'desc' ? 'bg-slate-200' : 'bg-slate-100'}`}>Más recientes</Link>
      </div>

      <div className="grid gap-4">
        {reservations.map((res) => (
          <Card key={res.id}>
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="font-medium">{res.customerName}</p>
                <p className="text-sm text-slate-500">
                  {res.date} · {res.startHour}:00 — {res.endHour}:00 · Creada: {res.createdAt ? new Date(res.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    res.status === 'PENDING' ? 'bg-slate-100' :
                    res.status === 'IN_PROGRESS' ? 'bg-yellow-100' :
                    res.status === 'COMPLETED' ? 'bg-green-100' :
                    res.status === 'CANCELLED' ? 'bg-red-100' :
                    'bg-blue-100'
                }`}>
                    {STATUS_LABELS[res.status as keyof typeof STATUS_LABELS]}
                </span>
                <Link href={`/reservations/${res.id}/edit`} className="text-sm text-blue-600 hover:underline">Editar</Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
