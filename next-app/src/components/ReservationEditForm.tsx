"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { reservationSchema } from "@/lib/schemas"
import { STATUS_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { TableSelector } from "@/components/TableSelector"
import { useRouter } from "next/navigation"

interface Table {
    id: string;
    name: string;
    capacity: number;
    active: boolean;
}

const editReservationSchema = reservationSchema.extend({
    status: z.string()
})

export default function ReservationEditForm({ 
  initialData, 
  tables,
  onSubmit 
}: { 
  initialData: z.infer<typeof editReservationSchema> & { id: string };
  tables: Table[];
  onSubmit: (data: any) => Promise<void> 
}) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: zodResolver(editReservationSchema),
    defaultValues: { ...initialData, status: initialData.status as string }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("customerName")} placeholder="Nombre Cliente" />
      <Input {...register("occupants", { valueAsNumber: true })} type="number" placeholder="Personas" />
      <Input {...register("notes")} placeholder="Notas" />
      <TableSelector 
          tables={tables} 
          value={initialData.tableId} 
          onChange={(tableId) => setValue("tableId", tableId)} 
        />
      <select {...register("status")} className="w-full p-2 border rounded-lg">
        {Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>Guardar Cambios</Button>
        <Button type="button" className="bg-slate-200" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
