"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { tableSchema } from "@/lib/schemas"
import { Card } from "./ui/Card"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { createTable, updateTable, deleteTable } from "@/lib/actions/table"

export default function TableManager({ tables }: { tables: any[] }) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof tableSchema>>({
    resolver: zodResolver(tableSchema)
  })

  const onSubmit = async (data: z.infer<typeof tableSchema>) => {
    await createTable(data)
    reset()
    router.refresh()
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Crear Mesa</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <Input {...register("capacity")} type="number" placeholder="Capacidad" />
        {errors.capacity && <p className="text-red-500">{errors.capacity.message}</p>}
        <Button type="submit">Crear</Button>
      </form>

      <h2 className="text-xl font-bold mt-4">Mesas</h2>
      {tables.map((table: any) => (
        <Card key={table.id} className="my-2">
          <p>Capacidad: {table.capacity}</p>
          <p>Estado: {table.active ? "Activa" : "Inactiva"}</p>
          <Button onClick={() => updateTable(table.id, { active: !table.active })}>Toggle</Button>
          <Button onClick={() => deleteTable(table.id)} className="ml-2 bg-red-500">Eliminar</Button>
        </Card>
      ))}
    </div>
  )
}
