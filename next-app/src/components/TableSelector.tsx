"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export interface TableOption {
  id: string
  name: string
  capacity: number
  active: boolean
  status?: "available" | "full" | "inactive" // <--- Nuevo parámetro
  statusLabel?: string                       // <--- Etiqueta personalizada opcional
}

export function TableSelector({ 
  tables, 
  value, 
  onChange 
}: { 
  tables: TableOption[]; 
  value: string; 
  onChange: (id: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedTable = tables.find(t => t.id === value)

  // Mapeo dinámico de colores y textos según el estado
  const getBadgeConfig = (t: TableOption) => {
    const status = t.status || (t.active ? "available" : "inactive")

    switch (status) {
      case "available":
        return {
          label: t.statusLabel || "Disponible",
          className: "bg-green-100 text-green-700 border-green-200"
        }
      case "full":
        return {
          label: t.statusLabel || "Sin cupo",
          className: "bg-amber-100 text-amber-800 border-amber-200"
        }
      case "inactive":
      default:
        return {
          label: t.statusLabel || "Inactiva",
          className: "bg-slate-100 text-slate-500 border-slate-200"
        }
    }
  }

  return (
    <div className="relative w-full">
      <div 
        className="w-full p-2 border rounded bg-white cursor-pointer flex justify-between items-center shadow-sm hover:border-blue-400 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {selectedTable ? selectedTable.name : "Selecciona una mesa..."}
          </span>
          {selectedTable && (
            <span className="text-xs text-slate-500">{selectedTable.capacity} personas</span>
          )}
        </div>
        <ChevronDown size={18} className="text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-60 overflow-auto divide-y divide-slate-100">
          {tables.map((t) => {
            const badge = getBadgeConfig(t)
            const isInactive = (t.status ? t.status === "inactive" : !t.active)

            return (
              <div 
                key={t.id}
                className={`p-3 flex justify-between items-center transition ${
                  isInactive 
                    ? 'bg-slate-50 cursor-not-allowed opacity-60' 
                    : 'cursor-pointer hover:bg-blue-50'
                }`}
                onClick={() => {
                  if (!isInactive) {
                    onChange(t.id);
                    setIsOpen(false);
                  }
                }}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 text-sm">{t.name}</span>
                  <span className="text-xs text-slate-600">Capacidad: {t.capacity} pax</span>
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${badge.className}`}>
                  {badge.label}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}