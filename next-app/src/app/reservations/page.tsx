import { getReservations } from "@/lib/actions/reservation"

export default async function ReservationsPage() {
  const reservations = await getReservations()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>
      <div className="grid gap-4">
        {reservations.map((res) => (
          <div key={res.id} className="p-4 border rounded shadow">
            <p>Usuario: {res.user.email}</p>
            <p>Mesa: {res.tableId}</p>
            <p>Inicio: {res.startTime.toLocaleString()}</p>
            <p>Estado: {res.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
