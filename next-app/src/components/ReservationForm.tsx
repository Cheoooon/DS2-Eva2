"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { reservationSchema } from "@/lib/schemas"
import { createReservation } from "@/lib/actions/reservation"
import { getReservationsForTable } from "@/lib/actions/reservation-query"
import { TableSelector } from "./TableSelector"

interface TableOption {
  id: string
  name: string
  capacity: number
  active: boolean
}

export default function ReservationForm({ 
    tables, 
    userId, 
    initialDate, 
    initialTableId 
}: { 
    tables: TableOption[]; 
    userId: string; 
    initialDate?: string; 
    initialTableId?: string; 
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0])
  const [selectedTableId, setSelectedTableId] = useState(initialTableId || (tables[0]?.id ?? ""))
  const [selectedSlots, setSelectedSlots] = useState<number[]>([])
  const [reservedSlots, setReservedSlots] = useState<{ start: number; end: number }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { isSubmitting, errors }, reset, setValue } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: { 
        userId, 
        tableId: selectedTableId,
        date: selectedDate,
        customerName: "",
        occupants: 1,
        notes: "",
        startHour: 0,
        endHour: 0
    }
  })

  // Synchronize hidden fields with state
  useEffect(() => {
    setValue("tableId", selectedTableId);
    setValue("date", selectedDate);
  }, [selectedTableId, selectedDate, setValue]);

  useEffect(() => {
    const fetchReservations = async () => {
        const reservations = await getReservationsForTable(selectedTableId, new Date(selectedDate));
        setReservedSlots(reservations.map(r => ({ start: r.startHour, end: r.endHour })));
        setSelectedSlots([]);
    }
    fetchReservations();
  }, [selectedDate, selectedTableId]);

  const onSubmit = async (data: any) => {
    if (selectedSlots.length === 0) { 
        setError("Selecciona al menos una hora"); return; 
    }
    
    setError(null)
    setSuccess(false)
    
    try {
      const sortedSlots = [...selectedSlots].sort((a,b) => a - b);
      const startHour = sortedSlots[0];
      const endHour = sortedSlots[sortedSlots.length - 1] + 1;
      
      await createReservation({ ...data, startHour, endHour });
      
      setSuccess(true)
      setSelectedSlots([])
      reset()
      router.refresh()
    } catch (e: any) {
      console.error("DEBUG: Error en servidor:", e);
      setError(e.message)
    }
  }

  const onError = (errors: any) => {
    console.error("DEBUG: Errores de validación Zod:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
      {success && <p className="text-green-600 text-sm bg-green-50 p-2 rounded">Reserva creada con éxito.</p>}
      
      <input type="hidden" {...register("userId")} />
      <input type="hidden" {...register("tableId")} />
      <input type="hidden" {...register("date")} />
      
      <div>
        <label className="block text-sm font-medium">Mesa</label>
        <TableSelector 
            tables={tables} 
            value={selectedTableId} 
            onChange={setSelectedTableId} 
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Fecha</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Horas (Selecciona inicio y fin)</label>
        <div className="grid grid-cols-4 gap-2 mt-2">
            {Array.from({ length: 15 }, (_, i) => i + 8).map(hour => {
                const isReserved = reservedSlots.some(r => hour >= r.start && hour < r.end);
                return (
                    <button key={hour} type="button" disabled={isReserved} 
                        onClick={() => {
                            if (selectedSlots.includes(hour)) {
                                setSelectedSlots(selectedSlots.filter(s => s !== hour));
                            } else {
                                setSelectedSlots([...selectedSlots, hour]);
                            }
                        }}
                        className={`p-2 rounded ${isReserved ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : selectedSlots.includes(hour) ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-slate-50'}`}>
                        {hour}:00
                    </button>
                )
            })}
        </div>
      </div>
      <Input {...register("customerName")} placeholder="Nombre Cliente" />
      {errors.customerName && <p className="text-red-500 text-sm">{String(errors.customerName.message)}</p>}
      
      <Input {...register("occupants", { valueAsNumber: true })} type="number" placeholder="Personas" />
      {errors.occupants && <p className="text-red-500 text-sm">{String(errors.occupants.message)}</p>}
      
      <div>
        <label className="block text-sm font-medium">Notas</label>
        <textarea {...register("notes")} className="w-full px-3 py-2 border border-slate-300 rounded-lg" rows={3} placeholder="Notas adicionales..." />
      </div>
      
      <Button type="submit" disabled={isSubmitting}>Confirmar Reserva</Button>
    </form>
  )
}
