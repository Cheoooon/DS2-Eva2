"use client"

import { useRouter, useSearchParams } from "next/navigation"

export function FilterBar({ tables }: { tables: { id: string; name: string }[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const date = searchParams.get("date") || new Date().toISOString().split('T')[0]
  const tableId = searchParams.get("tableId") || ""
  const sort = searchParams.get("sort") || "desc"

  const updateParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    router.push(`/reservations/history?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-slate-50 rounded-lg border">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500">Fecha</label>
        <input type="date" value={date} onChange={(e) => updateParams({ date: e.target.value })} className="px-3 py-2 border rounded text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500">Mesa</label>
        <select value={tableId} onChange={(e) => updateParams({ tableId: e.target.value })} className="px-3 py-2 border rounded text-sm">
          <option value="">Todas las mesas</option>
          {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500">Orden</label>
        <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })} className="px-3 py-2 border rounded text-sm">
          <option value="desc">Más recientes primero</option>
          <option value="asc">Más antiguas primero</option>
        </select>
      </div>
    </div>
  )
}
