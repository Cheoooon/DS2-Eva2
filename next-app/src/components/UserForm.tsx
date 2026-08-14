"use client"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { useRouter } from "next/navigation"

import { useState } from "react"

export default function UserForm({ initialData, action }: { initialData?: any, action: any }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  return (
    <form action={async (formData) => {
        setError(null)
        try {
            await action(formData)
            router.push("/admin")
        } catch (e: any) {
            setError(e.message)
        }
    }} className="flex flex-col gap-4 max-w-md mx-auto p-4 border rounded shadow bg-white">
        {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
        <div>
            <label className="text-sm font-medium">Nombre</label>
            <Input name="name" defaultValue={initialData?.name} required />
        </div>
        <div>
            <label className="text-sm font-medium">Email</label>
            <Input name="email" defaultValue={initialData?.email} type="email" required />
        </div>
        { !initialData && (
        <div>
            <label className="text-sm font-medium">Contraseña</label>
            <Input name="password" type="password" required minLength={6} />
        </div>
        )}
        <div>
            <label className="text-sm font-medium">Rol</label>
            <select name="role" defaultValue={initialData?.role || "STAFF"} className="border p-2 w-full rounded text-sm">
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
        </div>
        <Button type="submit">Guardar</Button>
    </form>
  )
}
