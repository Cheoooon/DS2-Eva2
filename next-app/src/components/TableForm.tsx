"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { tableSchema } from "@/lib/schemas"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { useRouter } from "next/navigation"

export default function TableForm({ 
  initialData, 
  onSubmit 
}: { 
  initialData?: { name: string; capacity: number; active?: boolean };
  onSubmit: (data: z.infer<typeof tableSchema>) => Promise<void>
}) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(tableSchema),
    defaultValues: initialData || { name: "", capacity: 2, active: true }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("name")} placeholder="Nombre (ej. mesa-1)" />
      {errors.name && <p className="text-red-500 text-sm">{String(errors.name.message)}</p>}
      <Input {...register("capacity", { valueAsNumber: true })} type="number" placeholder="Capacidad" />
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("active")} className="h-4 w-4" />
        Activa
      </label>
      {errors.active && <p className="text-red-500 text-sm">{String(errors.active.message)}</p>}
      {errors.capacity && <p className="text-red-500 text-sm">{String(errors.capacity.message)}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>Guardar</Button>
        <Button type="button" className="bg-slate-200 text-slate-900 hover:bg-slate-300" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
