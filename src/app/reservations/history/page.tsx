import { getReservationsHistory } from "@/lib/actions/reservation-history"
import { Card } from "@/components/ui/Card"
import Link from "next/link"

export default async function HistoryPage(props: {
  searchParams: Promise<{ date?: string; sort?: 'asc' | 'desc' }>
}) {
  const searchParams = await props.searchParams
  const date = searchParams.date
  const sort = searchParams.sort || 'desc'
  
  const reservations = await getReservationsHistory({ date, sort })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Historial de Reservas</h1>
      
      <div className="flex gap-4 mb-6">
        <Link href={`/reservations/history?sort=${sort === 'asc' ? 'desc' : 'asc'}`} className="text-blue-600">
          Ordenar por fecha {sort === 'asc' ? '↓' : '↑'}
        </Link>
        <Link href="/reservations" className="text-slate-600">Volver a Reservas</Link>
      </div>

      <div className="grid gap-4">
        {reservations.map((res) => (
          <Card key={res.id}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{res.customerName}</p>
                <p className="text-sm text-slate-500">
                  Mesa {res.table.name} · {res.date} · {res.startHour}:00
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
