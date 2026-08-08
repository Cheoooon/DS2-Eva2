"use client"

import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { reservationSchema } from "@/lib/schemas"
import { createReservation } from "@/lib/actions/reservation"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface TableOption {
  id: string
  capacity: number
}

export default function ReservationForm({ tables, userId }: { tables: TableOption[]; userId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { 
        userId, 
        tableId: tables[0]?.id ?? "",
        startTime: new Date().toISOString().slice(0, 16),
        endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16)
    }
  })

  const setTimePreset = (type: 'lunch' | 'dinner') => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    if (type === 'lunch') {
        setValue("startTime", `${dateStr}T13:00`);
        setValue("endTime", `${dateStr}T15:00`);
    } else {
        setValue("startTime", `${dateStr}T20:00`);
        setValue("endTime", `${dateStr}T22:00`);
    }
  }

  const onSubmit = async (data: z.infer<typeof reservationSchema>) => {
    console.log("Submitting reservation:", data)
    setError(null)
    setSuccess(false)
    try {
      await createReservation(data)
      setSuccess(true)
      reset()
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido")
    }
  }

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
      <input type="hidden" {...register("userId")} />

      {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
      {success && <p className="text-green-600 text-sm bg-green-50 p-2 rounded">Reserva creada con éxito.</p>}

      <div className="flex gap-2">
        <Button type="button" className="bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={() => setTimePreset('lunch')}>Comida (13:00 - 15:00)</Button>
        <Button type="button" className="bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={() => setTimePreset('dinner')}>Cena (20:00 - 22:00)</Button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mesa</label>
        <select {...register("tableId")} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
          {tables.map(t => (
            <option key={t.id} value={t.id}>
              Mesa #{t.id.slice(-4)} — Capacidad: {t.capacity}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Inicio</label>
          <Input type="datetime-local" {...register("startTime")} />
          {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fin</label>
          <Input type="datetime-local" {...register("endTime")} />
          {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime.message as string}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Reservando..." : "Confirmar Reserva"}
      </Button>
    </form>
  )
}
