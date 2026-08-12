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
import { STATUS_LABELS } from "@/lib/constants"
import { z } from "zod"

type ReservationFormData = z.infer<typeof reservationSchema> & { status?: string };

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
  initialTime,
  initialData,
  onSubmit,
  buttonLabel = "Confirmar Reserva"
}: { 
  tables: TableOption[]; 
  userId: string; 
  initialDate?: string; 
  initialTableId?: string;
  initialTime?: string;
  initialData?: ReservationFormData & { id: string };
  onSubmit?: (data: ReservationFormData) => Promise<void>;
  buttonLabel?: string;
}) {
  const [selectedDate, setSelectedDate] = useState(
    initialData?.date || initialDate || new Date().toISOString().split('T')[0]
  )
  
  const [selectedTableId, setSelectedTableId] = useState(
    initialData?.tableId || initialTableId || ""
  )
  
  const [tablesReservations, setTablesReservations] = useState<
    Record<string, { start: number; end: number }[]>
  >({})
  
  const initialSelectionState = useMemo(() => {
    if (initialData) {
        return { start: initialData.startHour, end: initialData.endHour }
    }
    if (initialTime) {
      const hour = parseInt(initialTime.split(':')[0])
      if (!isNaN(hour) && AVAILABLE_HOURS.includes(hour)) {
        return { start: hour, end: hour + 1 }
      }
    }
    return null
  }, [initialTime, initialData])

  const [selection, setSelection] = useState<{ start: number; end: number } | null>(initialSelectionState)
  const [isRangeComplete, setIsRangeComplete] = useState(false)
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { isSubmitting, errors }, reset, setValue, getValues, setError: setFormError } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema) as any,
    defaultValues: initialData || { 
      userId, 
      tableId: selectedTableId,
      date: selectedDate,
      customerName: "",
      occupants: 1,
      notes: "",
      startHour: initialSelectionState?.start ?? 8,
      endHour: initialSelectionState?.end ?? 9
    }
  })

  // Sincronizar cambios de URL (Next.js Link/Router)
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

  // Cargar reservas de base de datos
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

  const reservedSlots = useMemo(() => {
    if (!selectedTableId) return []
    return tablesReservations[selectedTableId] || []
  }, [tablesReservations, selectedTableId])

  const isSlotReserved = (hour: number) => {
    // Si estamos editando, ignorar la reserva actual
    if (initialData && hour >= initialData.startHour && hour < initialData.endHour && selectedTableId === initialData.tableId) return false;
    return reservedSlots.some(r => hour >= r.start && hour < r.end)
  }

  const handleSlotClick = (hour: number) => {
    if (!selectedTableId || isSlotReserved(hour)) return;

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

  const onSubmitHandler = async (data: ReservationFormData) => {
    setError(null)
    setSuccess(false)

    if (!selectedTableId) {
        setError("Por favor selecciona una mesa.")
        return
    }

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
      if (onSubmit) {
          await onSubmit(data)
      } else {
          await createReservation(data)
          setSuccess(true)
          setSelection(null)
          setSelectedTableId("")
          setIsRangeComplete(false)
          
          reset({
            ...getValues(),
            customerName: "",
            occupants: 1,
            notes: "",
            startHour: 8,
            endHour: 9
          })
      }
      router.refresh()
    } catch (e: any) {
      console.error("Error en servidor:", e)
      setError(e.message || "Ocurrió un error al procesar la reserva.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
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
          onChange={(tableId) => {
            setSelectedTableId(tableId)
            setSelection(null)
            setIsRangeComplete(false)
          }} 
        />
      </div>

      {initialData && (
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select {...register("status")} className="w-full p-2 border rounded-lg">
            {Object.entries(STATUS_LABELS)
              .filter(([key]) => key !== 'MOVED')
              .map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
      )}

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
                disabled={reserved || !selectedTableId}
                onClick={() => handleSlotClick(hour)}
                className={`relative p-3 text-xs font-medium rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${
                  reserved || !selectedTableId
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
            <p className="text-slate-500">
              {selectedTableId 
                ? "Haz clic en un bloque para seleccionar el horario." 
                : "Selecciona una mesa para ver los horarios disponibles."}
            </p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Nombre del cliente</label>
        <Input {...register("customerName")} placeholder="Nombre Cliente" />
        {errors.customerName && <p className="text-red-500 text-sm mt-1">{String(errors.customerName.message)}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Cantidad de personas</label>
        <Input {...register("occupants", { valueAsNumber: true })} type="number" placeholder="Personas" />
        {errors.occupants && <p className="text-red-500 text-sm mt-1">{String(errors.occupants.message)}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Notas</label>
        <textarea {...register("notes")} className="w-full px-3 py-2 border border-slate-300 rounded-lg" rows={3} placeholder="Notas adicionales..." />
      </div>
      
      <Button type="submit" disabled={isSubmitting || !selection} className="w-full">
        {buttonLabel}
      </Button>
    </form>
  )
}
