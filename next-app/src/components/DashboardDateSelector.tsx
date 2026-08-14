"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function DashboardDateSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isMounted, setIsMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  // Obtener la fecha seleccionada de la URL de forma segura
  const dateParam = searchParams.get("date")
  
  // Si no hay parámetro, calculamos la fecha pero sin depender de horas/milisegundos
  const currentDate = dateParam
    ? new Date(parseInt(dateParam.split('-')[0]), parseInt(dateParam.split('-')[1]) - 1, parseInt(dateParam.split('-')[2]))
    : new Date()

  useEffect(() => {
    setIsMounted(true)
    setCurrentTime(new Date())

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const changeDate = (days: number) => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + days)
    
    // Formato YYYY-MM-DD
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    
    router.push(`/?date=${year}-${month}-${day}`)
  }

  // Comprobar si la fecha seleccionada es el día de hoy
  const isToday = isMounted && currentDate.toDateString() === new Date().toDateString()

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 w-full">
      <button 
        onClick={() => changeDate(-1)}
        className="p-2 hover:bg-slate-100 rounded-full transition"
        aria-label="Día anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="flex items-center justify-center gap-4">
        <span className="font-semibold text-lg capitalize">
          {/* suppressHydrationWarning evita avisos si hay leves diferencias de locale entre Node y Browser */}
          <span suppressHydrationWarning>
            {currentDate.toLocaleDateString("es-ES", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </span>
        </span>

        {isToday && currentTime && (
          <div className="text-blue-700 text-sm font-medium font-mono border-l pl-4">
            {currentTime.toLocaleTimeString("es-ES", { 
              hour: "2-digit", 
              minute: "2-digit", 
              second: "2-digit" 
            })}
          </div>
        )}
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