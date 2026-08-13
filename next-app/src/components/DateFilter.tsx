"use client"

import { useRouter, useSearchParams } from "next/navigation"

export function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const date = searchParams.get("date") || ""

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    
    if (newDate) {
      params.set("date", newDate)
    } else {
      params.delete("date")
    }
    
    router.push(`/reservations/history?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="date-filter" className="text-sm font-medium text-slate-700">Fecha:</label>
      <input
        id="date-filter"
        type="date"
        value={date}
        onChange={handleDateChange}
        className="px-3 py-2 border rounded text-sm"
      />
    </div>
  )
}
