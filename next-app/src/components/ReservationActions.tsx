"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit2, Trash2, RefreshCw } from "lucide-react"
import { Button } from "./ui/Button"
import { deleteReservation, updateReservationStatus } from "@/lib/actions/reservation"
import { STATUS_LABELS } from "@/lib/constants"
import { Status } from "../../prisma/generated/prisma/client"
import Link from "next/link"

interface ReservationActionsProps {
  reservation: {
    id: string;
    status: string;
  };
  isAdmin: boolean;
}

export function ReservationActions({ reservation, isAdmin }: ReservationActionsProps) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState<Status | null>(null)

  const handleStatusChange = async (newStatus: Status) => {
    try {
        await updateReservationStatus(reservation.id, newStatus)
        setConfirmStatus(null)
        router.refresh()
    } catch (e: any) {
        alert(e.message)
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <Link href={`/reservations/${reservation.id}/edit`} className="p-2 text-slate-500 hover:text-green-600 transition">
        <Edit2 size={18} />
      </Link>

      <div className="relative group">
        <button className="p-2 text-slate-500 hover:text-blue-600 transition">
            <RefreshCw size={18} />
        </button>
        <div className="absolute right-0 top-full hidden group-hover:flex flex-col bg-white border rounded shadow-lg z-20 w-40">
            {Object.entries(STATUS_LABELS)
                .filter(([key]) => key !== 'MOVED')
                .map(([key, label]) => (
                    <button 
                        key={key}
                        onClick={() => setConfirmStatus(key as Status)}
                        className="text-left px-4 py-2 hover:bg-slate-100 text-sm"
                    >
                        {label}
                    </button>
                ))
            }
        </div>
      </div>

      {isAdmin && (
        <button onClick={() => setConfirmDelete(true)} className="p-2 text-slate-500 hover:text-red-600 transition">
            <Trash2 size={18} />
        </button>
      )}

      {confirmStatus && (
          <div className="absolute right-0 top-0 z-30 bg-white p-3 rounded-lg border shadow-lg w-48 text-sm">
            <p className="mb-2">¿Confirmar estado: {STATUS_LABELS[confirmStatus]}?</p>
            <div className="flex gap-2">
                <Button onClick={() => setConfirmStatus(null)} className="bg-slate-200 text-xs py-1">X</Button>
                <Button onClick={() => handleStatusChange(confirmStatus)} className="bg-blue-600 text-xs py-1">✓</Button>
            </div>
          </div>
      )}

      {confirmDelete && (
          <div className="absolute right-0 top-0 z-30 bg-white p-3 rounded-lg border shadow-lg w-48 text-sm">
            <p className="mb-2">¿Eliminar reserva?</p>
            <div className="flex gap-2">
                <Button onClick={() => setConfirmDelete(false)} className="bg-slate-200 text-xs py-1">X</Button>
                <Button onClick={async () => {
                    try {
                        await deleteReservation(reservation.id)
                        setConfirmDelete(false)
                        router.refresh()
                    } catch (e: any) {
                        alert(e.message)
                    }
                }} className="bg-red-600 text-xs py-1">Eliminar</Button>
            </div>
          </div>
      )}
    </div>
  )
}
