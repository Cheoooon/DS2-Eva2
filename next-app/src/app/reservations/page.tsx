import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/Card"
import ReservationForm from "@/components/ReservationForm"
import { getTablesSorted } from "@/lib/actions/table"
import Link from "next/link"

export default async function ReservationsPage(props: { searchParams: Promise<{ date?: string, time?: string, table?: string }> }) {
  const searchParams = await props.searchParams
  
  const session = await auth()
  if (!session) redirect("/login")
  
  const tables = await getTablesSorted()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservas</h1>
        <Link href="/reservations/history" className="text-blue-600 hover:underline">
          Ver historial completo
        </Link>
      </div>

      <Card className="mb-8 p-6 bg-slate-50">
        <h2 className="text-lg font-semibold mb-4">Nueva Reserva</h2>
        <ReservationForm
          tables={tables}
          userId={session.user?.id ?? ""}
          initialDate={searchParams.date}
          initialTableId={searchParams.table}
          initialTime={searchParams.time}
        />
      </Card>
    </div>
  )
}
