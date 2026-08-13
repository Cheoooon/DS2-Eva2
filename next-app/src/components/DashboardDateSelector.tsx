"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function DashboardDateSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Obtener fecha de la URL o usar hoy en formato YYYY-MM-DD
  const dateStr = searchParams.get("date") || new Date().toISOString().split('T')[0]
  
  const changeDate = (days: number) => {
    const d = new Date(dateStr + 'T00:00:00')
    d.setDate(d.getDate() + days)
    const dateFormatted = d.toISOString().split('T')[0]
    router.push(`/?date=${dateFormatted}`)
  }

  // Formatear para mostrar
  const displayDate = new Date(dateStr + 'T00:00:00').toLocaleDateString("es-ES", { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  })

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 w-full">
      <button 
        onClick={() => changeDate(-1)}
        className="p-2 hover:bg-slate-100 rounded-full transition"
        aria-label="Día anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="flex flex-col items-center justify-center gap-1">
        <span className="font-semibold text-lg text-center capitalize">
          {displayDate}
        </span>
      </div>

      <button 
        onClick={() => changeDate(1)}
        className="p-2 hover:bg-slate-100 rounded-full transition"
        aria-label="Día siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}
