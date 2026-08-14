"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function UserFilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    router.push(`/admin?${params.toString()}`)
  }

  return (
    <div className="flex gap-4 mb-6 p-4 bg-slate-50 rounded-lg items-center">
      <input 
        placeholder="Nombre" 
        defaultValue={searchParams.get("name") || ""}
        onChange={(e) => updateParams({ name: e.target.value })}
        className="border p-2 rounded text-sm" 
      />
      <input 
        placeholder="Email" 
        defaultValue={searchParams.get("email") || ""}
        onChange={(e) => updateParams({ email: e.target.value })}
        className="border p-2 rounded text-sm" 
      />
      <select 
        defaultValue={searchParams.get("role") || ""}
        onChange={(e) => updateParams({ role: e.target.value })}
        className="border p-2 rounded text-sm"
      >
        <option value="">Todos los roles</option>
        <option value="ADMIN">ADMIN</option>
        <option value="STAFF">STAFF</option>
      </select>
    </div>
  )
}
