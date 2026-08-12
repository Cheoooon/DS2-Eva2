import { getReservationById, updateReservation } from "@/lib/actions/reservation"
import { getTables } from "@/lib/actions/table"
import ReservationForm from "@/components/ReservationForm"
import { redirect, notFound } from "next/navigation"
import { z } from "zod"
import { reservationSchema } from "@/lib/schemas"
import { Status } from "@/lib/prisma"

const editReservationSchema = reservationSchema.extend({
    status: z.nativeEnum(Status)
})

export default async function EditReservationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const [reservation, tables] = await Promise.all([
      getReservationById(params.id),
      getTables()
  ])
  
  if (!reservation) notFound()

  async function onSubmit(data: any) {
    "use server"
    await updateReservation(params.id, data)
    redirect("/reservations/history")
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Reserva: {reservation.customerName}</h1>
      <ReservationForm 
        userId={reservation.userId}
        tables={tables}
        initialData={{ ...reservation, status: reservation.status as any, notes: reservation.notes || undefined } as any}
        onSubmit={onSubmit}
        buttonLabel="Guardar Cambios"
      />
    </div>
  )
}
