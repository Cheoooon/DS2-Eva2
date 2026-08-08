"use client"

import { useRouter } from "next/navigation"

export default function DateFilter({ defaultValue }: { defaultValue: string }) {
  const router = useRouter()
  return (
    <input 
        type="date" 
        defaultValue={defaultValue}
        className="border border-slate-300 rounded p-2"
        onChange={(e) => router.push(`/reservations?date=${e.target.value}`)}
    />
  )
}
