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
import { Edit2, Power, Trash2 } from "lucide-react"
export default function TableManager({ tables }: { tables: any[] }) {
  const router = useRouter()
  const defaultName = `mesa-${tables.length + 1}`
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(tableSchema),
    defaultValues: { name: defaultName, capacity: 2 }
  })

  const onSubmit = async (data: z.infer<typeof tableSchema>) => {
    await createTable(data)
    reset()
    router.refresh()
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 grid grid-cols-2 gap-4">
        <Input {...register("name")} placeholder="Nombre (ej. mesa-1)" />
        <Input {...register("capacity")} type="number" placeholder="Capacidad" />
        <Button type="submit" className="col-span-2">Crear Mesa</Button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {tables.map((table: any) => (
        <div key={table.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">{table.name}</h3>
            <p className="text-sm text-slate-600">Capacidad: {table.capacity}</p>
            <span className={`text-xs px-2 py-1 rounded ${table.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {table.active ? "Activa" : "Inactiva"}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => {
               const newName = prompt("Nuevo nombre:", table.name);
               if (newName) updateTable(table.id, { name: newName });
            }} className="p-2 text-slate-500 hover:text-green-600 transition">
               <Edit2 size={18} />
            </button>
            <button onClick={() => updateTable(table.id, { active: !table.active })} className="p-2 text-slate-500 hover:text-blue-600 transition">
              <Power size={18} />
            </button>
            <button onClick={() => deleteTable(table.id)} className="p-2 text-slate-500 hover:text-red-600 transition">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}
