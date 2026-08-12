"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit2, Power, Trash2, X, Check } from "lucide-react"
import { type Table, type Reservation } from "../../prisma/generated/prisma/client"
import { updateTable, deleteTable } from "@/lib/actions/table"
import { Button } from "./ui/Button"

type TableWithReservations = Table & { reservations: Reservation[] }

export default function TableManager({ tables }: { tables: TableWithReservations[] }) {
  const router = useRouter()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmActiveId, setConfirmActiveId] = useState<string | null>(null)

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => router.push("/tables/new")}>Nueva Mesa</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {tables.map((table: TableWithReservations) => (
        <div key={table.id} className="relative bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">{table.name}</h3>
            <p className="text-sm text-slate-600">Capacidad: {table.capacity}</p>
            <span className={`text-xs px-2 py-1 rounded ${table.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {table.active ? "Activa" : "Inactiva"}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push(`/tables/${table.id}/edit`)} className="p-2 text-slate-500 hover:text-green-600 transition">
               <Edit2 size={18} />
            </button>
            <button onClick={() => setConfirmActiveId(table.id)} className="p-2 text-slate-500 hover:text-blue-600 transition">
              <Power size={18} />
            </button>
            {confirmActiveId === table.id && (
                <div className="absolute inset-0 bg-white/95 z-10 p-4 flex flex-col items-center justify-center rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-slate-800 mb-3 text-center">
                    ¿Desea {table.active ? "desactivar" : "activar"} la mesa {table.name}?
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => setConfirmActiveId(null)} className="bg-slate-200 text-slate-800 hover:bg-slate-300 text-xs py-1 px-3">Cancelar</Button>
                    <Button 
                      onClick={async () => {
                        try {
                            await updateTable(table.id, { active: !table.active })
                            setConfirmActiveId(null)
                            router.refresh()
                        } catch (e: any) {
                            alert(e.message)
                        }
                    }} 
                      className="bg-blue-600 text-white hover:bg-blue-700 text-xs py-1 px-3"
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
            )}
            {table.reservations.every(r => r.status === 'MOVED') && (
              confirmDeleteId === table.id ? (
                <div className="absolute inset-0 bg-white/95 z-10 p-4 flex flex-col items-center justify-center rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-slate-800 mb-3 text-center">
                    ¿Desea eliminar la mesa {table.name}?
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setConfirmDeleteId(null)} 
                      className="bg-slate-200 text-slate-800 hover:bg-slate-300 text-xs py-1 px-3"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={async () => {
                        try {
                            await deleteTable(table.id)
                            setConfirmDeleteId(null)
                            router.refresh()
                        } catch (e: any) {
                            alert(e.message)
                        }
                    }} 
                      className="bg-red-600 text-white hover:bg-red-700 text-xs py-1 px-3"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setConfirmDeleteId(table.id)} className="p-2 text-slate-500 hover:text-red-600 transition">
                  <Trash2 size={18} />
                </button>
              )
            )}
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}
