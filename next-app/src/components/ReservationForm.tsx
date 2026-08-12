"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { reservationSchema } from "@/lib/schemas"
import { createReservation } from "@/lib/actions/reservation"
import { getReservationsForTable } from "@/lib/actions/reservation-query"
import { TableSelector } from "./TableSelector"
import { z } from "zod"

type ReservationFormData = z.infer<typeof reservationSchema>

export interface TableOption {
  id: string
  name: string
  capacity: number
  active: boolean
  statusLabel?: string
  status?: "available" | "full" | "inactive"
}

const AVAILABLE_HOURS = Array.from({ length: 15 }, (_, i) => i + 8)

export default function ReservationForm({ 
  tables, 
  userId, 
  initialDate, 
  initialTableId,
  initialTime
}: { 
  tables: TableOption[]; 
  userId: string; 
  initialDate?: string; 
  initialTableId?: string;
  initialTime?: string;
}) {
  const [selectedDate, setSelectedDate] = useState(
    initialDate || new Date().toISOString().split('T')[0]
  )
  const [selectedTableId, setSelectedTableId] = useState(
    initialTableId || (tables[0]?.id ?? "")
  )
  
  const [tablesReservations, setTablesReservations] = useState<
    Record<string, { start: number; end: number }[]>
  >({})
  
  const initialSelectionState = useMemo(() => {
    if (initialTime) {
      const hour = parseInt(initialTime.split(':')[0])
      if (!isNaN(hour) && AVAILABLE_HOURS.includes(hour)) {
        return { start: hour, end: hour + 1 }
      }
    }
    return { start: 8, end: 9 }
  }, [initialTime])

  const [selection, setSelection] = useState<{ start: number; end: number } | null>(initialSelectionState)
  const [isRangeComplete, setIsRangeComplete] = useState(false)
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { isSubmitting, errors }, reset, setValue, getValues, setError: setFormError } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { 
      userId, 
      tableId: selectedTableId,
      date: selectedDate,
      customerName: "",
      occupants: 1,
      notes: "",
      startHour: initialSelectionState.start,
      endHour: initialSelectionState.end
    } as any
  })

  // 1. Sincronizar cambios de URL (Next.js Link/Router)
  useEffect(() => {
    if (initialDate) setSelectedDate(initialDate);
    if (initialTableId) setSelectedTableId(initialTableId);
    
    if (initialTime) {
      const hour = parseInt(initialTime.split(':')[0]);
      if (!isNaN(hour) && AVAILABLE_HOURS.includes(hour)) {
        setSelection({ start: hour, end: hour + 1 });
        setValue("startHour", hour);
        setValue("endHour", hour + 1);
      }
    }
  }, [initialDate, initialTableId, initialTime, setValue]);

  useEffect(() => {
    setValue("tableId", selectedTableId)
    setValue("date", selectedDate)
  }, [selectedTableId, selectedDate, setValue])

  // 2. Cargar reservas de base de datos (YA NO LIMPIA LA SELECCIÓN AQUÍ)
  useEffect(() => {
    const fetchAllReservations = async () => {
      if (!selectedDate) return;
      try {
        const dateObj = new Date(`${selectedDate}T00:00:00`)
        const activeTables = tables.filter(t => t.active)

        const results = await Promise.all(
          activeTables.map(async (table) => {
            const res = await getReservationsForTable(table.id, dateObj)
            return {
              tableId: table.id,
              reservations: res.map(r => ({ start: r.startHour, end: r.endHour }))
            }
          })
        )

        const resMap: Record<string, { start: number; end: number }[]> = {}
        results.forEach(item => {
          resMap[item.tableId] = item.reservations
        })
        setTablesReservations(resMap)
      } catch (err) {
        console.error("Error al obtener reservas por fecha:", err)
      }
    }

    fetchAllReservations()
  }, [selectedDate, tables])

  const sortedTables = useMemo(() => {
    return [...tables].map((table) => {
      if (!table.active) {
        return { ...table, status: "inactive" as const, priority: 3 }
      }

      const reservations = tablesReservations[table.id] || []
      const occupiedHoursCount = AVAILABLE_HOURS.filter(hour => 
        reservations.some(r => hour >= r.start && hour < r.end)
      ).length

      const isFull = occupiedHoursCount >= AVAILABLE_HOURS.length

      if (isFull) {
        return { ...table, status: "full" as const, priority: 2 }
      }

      return { ...table, status: "available" as const, priority: 1 }
    }).sort((a, b) => a.priority - b.priority)
  }, [tables, tablesReservations])

  const currentTable = useMemo(() => 
    sortedTables.find(t => t.id === selectedTableId), 
  [sortedTables, selectedTableId])

  useEffect(() => {
    if (sortedTables.length > 0) {
      const tableExists = sortedTables.some(t => t.id === selectedTableId)
      if (!tableExists) {
        setSelectedTableId(sortedTables[0].id)
      }
    }
  }, [sortedTables, selectedTableId])

  const reservedSlots = useMemo(() => {
    return tablesReservations[selectedTableId] || []
  }, [tablesReservations, selectedTableId])

  const isSlotReserved = (hour: number) => {
    return reservedSlots.some(r => hour >= r.start && hour < r.end)
  }

  // 3. Protección anti-solapamiento: Si la selección choca con la BD recién cargada, se borra.
  useEffect(() => {
    if (selection) {
        const hasConflict = reservedSlots.some(r => 
            (selection.start >= r.start && selection.start < r.end) || 
            (selection.end > r.start && selection.end <= r.end)
        )
        if (hasConflict) {
            setSelection(null)
            setIsRangeComplete(false)
        }
    }
  }, [reservedSlots, selection])

  const handleSlotClick = (hour: number) => {
    if (isSlotReserved(hour)) return;

    if (!selection || isRangeComplete) {
      const newRange = { start: hour, end: hour + 1 }
      setSelection(newRange)
      setIsRangeComplete(false)
      setValue("startHour", newRange.start)
      setValue("endHour", newRange.end)
    } else {
      const newStart = Math.min(selection.start, hour)
      const newEnd = Math.max(selection.start + 1, hour + 1)

      const hasReservedInBetween = AVAILABLE_HOURS.some(
        (h) => h >= newStart && h < newEnd && isSlotReserved(h)
      )

      if (hasReservedInBetween) {
        const resetRange = { start: hour, end: hour + 1 }
        setSelection(resetRange)
        setIsRangeComplete(false)
        setValue("startHour", resetRange.start)
        setValue("endHour", resetRange.end)
      } else {
        const completeRange = { start: newStart, end: newEnd }
        setSelection(completeRange)
        setIsRangeComplete(true)
        setValue("startHour", completeRange.start)
        setValue("endHour", completeRange.end)
      }
    }
  }

  const onSubmit = async (data: ReservationFormData) => {
    setError(null)
    setSuccess(false)

    if (!selection) {
        setError("Por favor selecciona un horario.")
        return
    }

    if (currentTable && data.occupants > currentTable.capacity) {
        setFormError("occupants", {
          type: "manual",
          message: `La capacidad máxima es de ${currentTable.capacity} personas.`
        })
        return
    }

    try {
      await createReservation(data)
      setSuccess(true)
      setSelection(null)
      setIsRangeComplete(false)
      
      reset({
        ...getValues(),
        customerName: "",
        occupants: 1,
        notes: "",
        startHour: 8,
        endHour: 9
      })
      router.refresh()
    } catch (e: any) {
      console.error("Error en servidor:", e)
      setError(e.message || "Ocurrió un error al crear la reserva.")
    }
  }

  const handleTableChange = (tableId: string) => {
    setSelectedTableId(tableId)
    setSelection(null)
    setIsRangeComplete(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
      {success && <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">Reserva creada con éxito.</p>}
      
      <input type="hidden" {...register("userId")} />
      <input type="hidden" {...register("tableId")} />
      <input type="hidden" {...register("date")} />
      <input type="hidden" {...register("startHour", { valueAsNumber: true })} />
      <input type="hidden" {...register("endHour", { valueAsNumber: true })} />

      <div>
        <label className="block text-sm font-medium mb-1">Fecha</label>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => {
            // AQUÍ se limpia la selección al cambiar manualmente la fecha
            setSelectedDate(e.target.value)
            setSelection(null)
            setIsRangeComplete(false)
          }} 
          className="w-full p-2 border rounded-lg" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mesa</label>
        <TableSelector 
          tables={sortedTables} 
          value={selectedTableId} 
          onChange={handleTableChange} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Selecciona Horario</label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {AVAILABLE_HOURS.map((hour) => {
            const reserved = isSlotReserved(hour)
            const isSelected = selection && hour >= selection.start && hour < selection.end

            return (
              <button
                key={hour}
                type="button"
                disabled={reserved}
                onClick={() => handleSlotClick(hour)}
                className={`relative p-3 text-xs font-medium rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${
                  reserved
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through"
                    : isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-md scale-[1.02]"
                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <span>{hour}:00 - {hour + 1}:00</span>
                {reserved && (
                  <span className="absolute bottom-1 right-1 text-[9px] font-normal text-slate-400 bg-slate-50 px-1 rounded">
                    Ocupado
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
          {selection ? (
            <p>
              <strong className="text-slate-900">Selección:</strong> {selection.start}:00 a {selection.end}:00{" "}
              <span className="text-slate-500 font-normal">
                ({selection.end - selection.start} {selection.end - selection.start === 1 ? 'hora' : 'horas'})
              </span>
            </p>
          ) : (
            <p className="text-slate-500">Haz clic en un bloque para seleccionar el horario.</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Cantidad de personas {" "}
          {currentTable && (
            <span className="text-slate-500 font-normal text-xs">
              (Máx: {currentTable.capacity})
            </span>
          )}
        </label>
        <Input 
          {...register("occupants", { valueAsNumber: true })} 
          type="number" 
          min="1"
          max={currentTable?.capacity}
          placeholder="Personas" 
        />
        {errors.occupants && <p className="text-red-500 text-sm mt-1">{String(errors.occupants.message)}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Nombre del cliente</label>
        <Input {...register("customerName")} placeholder="Nombre Cliente" />
        {errors.customerName && <p className="text-red-500 text-sm mt-1">{String(errors.customerName.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notas</label>
        <textarea {...register("notes")} className="w-full px-3 py-2 border border-slate-300 rounded-lg" rows={3} placeholder="Notas adicionales..." />
      </div>
      
      <Button type="submit" disabled={isSubmitting || !selection} className="w-full">
        Confirmar Reserva
      </Button>
    </form>
  )
}