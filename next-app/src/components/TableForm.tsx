"use client"
import { useState } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { useRouter } from "next/navigation"

export default function TableForm({ initialData, action }: { initialData?: any, action: any }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  return (
    <form action={async (formData) => {
        setError(null)
        try {
            await action(formData)
            router.push("/tables")
        } catch (e: any) {
            setError(e.message)
        }
    }} className="flex flex-col gap-4 max-w-md mx-auto p-4 border rounded shadow bg-white">
        {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
        
        <div>
            <label className="text-sm font-medium">Nombre</label>
            <Input name="name" defaultValue={initialData?.name} placeholder="ej. mesa-1" required />
        </div>
        
        <div>
            <label className="text-sm font-medium">Capacidad</label>
            <Input name="capacity" type="number" defaultValue={initialData?.capacity} required />
        </div>
        
        <label className="flex items-center gap-2 text-sm font-medium">
            <input name="active" type="checkbox" defaultChecked={initialData?.active ?? true} className="h-4 w-4" />
            Mesa Activa
        </label>
        
        <div className="flex gap-2">
            <Button type="submit">Guardar</Button>
            <Button type="button" className="bg-slate-200 text-slate-900 hover:bg-slate-300" onClick={() => router.back()}>Cancelar</Button>
        </div>
    </form>
  )
}
