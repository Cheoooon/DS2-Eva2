import { getReservations } from "@/lib/actions/reservation"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/Card"
import Link from "next/link"

export default async function ReservationHistoryPage(props: { searchParams: Promise<{ date?: string, sort?: string }> }) {
  const searchParams = await props.searchParams
  const date = searchParams.date
  const sort = (searchParams.sort === 'asc' || searchParams.sort === 'desc') ? searchParams.sort : 'desc'
  
  const session = await auth()
  if (!session) redirect("/login")
  
  const reservations = await getReservations({ date, sort })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/reservations" className="text-slate-500 hover:text-slate-800">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold">Historial de reservas</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <Link href={`/reservations/history?date=${date || ''}&sort=${sort}`} className={`px-4 py-2 rounded ${!date ? 'bg-slate-200' : 'bg-slate-100'}`}>Todas</Link>
        <Link href={`/reservations/history?date=${date || ''}&sort=asc`} className={`px-4 py-2 rounded ${sort === 'asc' ? 'bg-slate-200' : 'bg-slate-100'}`}>Más antiguas</Link>
        <Link href={`/reservations/history?date=${date || ''}&sort=desc`} className={`px-4 py-2 rounded ${sort === 'desc' ? 'bg-slate-200' : 'bg-slate-100'}`}>Más recientes</Link>
      </div>

      <div className="grid gap-4">
        {reservations.map((res) => (
          <Card key={res.id}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{res.customerName}</p>
                <p className="text-sm text-slate-500">
                  {res.date} · {res.startHour}:00 — {res.endHour}:00 · Creada: {res.createdAt ? new Date(res.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100">
                {res.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
