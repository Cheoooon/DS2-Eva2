"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { reservationSchema } from "@/lib/schemas"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { TableSelector } from "@/components/TableSelector"
import { useRouter } from "next/navigation"

const StatusOptions = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'MOVED'] as const;
type StatusType = typeof StatusOptions[number];

interface Table {
    id: string;
    name: string;
    capacity: number;
    active: boolean;
}

const editReservationSchema = reservationSchema.extend({
    status: z.enum(StatusOptions)
})

export default function ReservationEditForm({ 
  initialData, 
  tables,
  onSubmit 
}: { 
  initialData: z.infer<typeof editReservationSchema> & { id: string };
  tables: Table[];
  onSubmit: (data: z.infer<typeof editReservationSchema>) => Promise<void> 
}) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: zodResolver(editReservationSchema),
    defaultValues: initialData
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
        {StatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>Guardar Cambios</Button>
        <Button type="button" className="bg-slate-200" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
