"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface TableOption {
  id: string
  name: string
  capacity: number
  active: boolean
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
          {tables.map((t) => (
            <div 
                key={t.id}
                className={`p-3 flex justify-between items-center cursor-pointer transition ${t.active ? 'hover:bg-blue-50' : 'bg-slate-50 cursor-not-allowed opacity-60'}`}
                onClick={() => {
                    if (t.active) {
                        onChange(t.id);
                        setIsOpen(false);
                    }
                }}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 text-sm">{t.name}</span>
                <span className="text-xs text-slate-600">Capacidad: {t.capacity} pax</span>
              </div>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${t.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {t.active ? "Disponible" : "Inactiva"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
