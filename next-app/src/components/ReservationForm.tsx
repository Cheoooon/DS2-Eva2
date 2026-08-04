"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { reservationSchema } from "@/lib/actions/reservation"
import { createReservation } from "@/lib/actions/reservation"

const formSchema = reservationSchema

export default function ReservationForm({ tableId, userId }: { tableId: string, userId: string }) {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { userId, tableId }
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await createReservation(data)
      alert("Reserva exitosa")
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message)
      } else {
        alert("Error desconocido")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow">
      <input type="hidden" {...register("userId")} />
      <input type="hidden" {...register("tableId")} />
      
      <div className="mb-4">
        <label>Inicio:</label>
        <input type="datetime-local" {...register("startTime")} className="block border p-1" />
        {errors.startTime && <p className="text-red-500">{errors.startTime.message}</p>}
      </div>

      <div className="mb-4">
        <label>Fin:</label>
        <input type="datetime-local" {...register("endTime")} className="block border p-1" />
        {errors.endTime && <p className="text-red-500">{errors.endTime.message}</p>}
      </div>

      <button type="submit" className="p-2 bg-blue-500 text-white rounded">Reservar</button>
    </form>
  )
}
