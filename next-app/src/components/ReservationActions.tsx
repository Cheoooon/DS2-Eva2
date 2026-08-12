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
  const [showStatusModal, setShowStatusModal] = useState(false)

  const handleStatusChange = async (newStatus: Status) => {
    try {
        await updateReservationStatus(reservation.id, newStatus)
        setShowStatusModal(false)
        router.refresh()
    } catch (e: any) {
        alert(e.message)
    }
  }

  const getStatusColor = (key: string, isCurrent: boolean) => {
      if (isCurrent) return "text-white ";
      return "text-slate-900 ";
  }

  return (
    <div className="relative flex items-center gap-2">
      <Link href={`/reservations/${reservation.id}/edit`} className="p-2 text-slate-500 hover:text-green-600 transition">
        <Edit2 size={18} />
      </Link>

      <button onClick={() => setShowStatusModal(true)} className="p-2 text-slate-500 hover:text-blue-600 transition">
          <RefreshCw size={18} />
      </button>

      {isAdmin && (
        <button onClick={() => setConfirmDelete(true)} className="p-2 text-slate-500 hover:text-red-600 transition">
            <Trash2 size={18} />
        </button>
      )}

      {showStatusModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Cambiar estado</h3>
                <div className="flex flex-col gap-2">
                    {Object.entries(STATUS_LABELS)
                        .filter(([key]) => key !== 'MOVED')
                        .map(([key, label]) => {
                            const isCurrent = key === reservation.status;
                            const colorClass = 
                                key === 'PENDING' ? (isCurrent ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200') :
                                key === 'IN_PROGRESS' ? (isCurrent ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200') :
                                key === 'COMPLETED' ? (isCurrent ? 'bg-green-600 text-white' : 'bg-green-100 text-green-900 hover:bg-green-200') :
                                key === 'CANCELLED' ? (isCurrent ? 'bg-red-600 text-white' : 'bg-red-100 text-red-900 hover:bg-red-200') :
                                (isCurrent ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900 hover:bg-blue-200');

                            return (
                                <Button 
                                    key={key}
                                    onClick={() => handleStatusChange(key as Status)}
                                    className={colorClass}
                                >
                                    {label}
                                </Button>
                            )
                        })
                    }
                    <Button onClick={() => setShowStatusModal(false)} className="bg-slate-200 text-slate-800 hover:bg-slate-300 mt-2">Cancelar</Button>
                </div>
            </div>
          </div>
      )}

      {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">¿Eliminar reserva?</h3>
                <div className="flex gap-2">
                    <Button onClick={() => setConfirmDelete(false)} className="bg-slate-200 text-slate-800 hover:bg-slate-300">Cancelar</Button>
                    <Button onClick={async () => {
                        try {
                            await deleteReservation(reservation.id)
                            setConfirmDelete(false)
                            router.refresh()
                        } catch (e: any) {
                            alert(e.message)
                        }
                    }} className="bg-red-600 text-white hover:bg-red-700">Eliminar</Button>
                </div>
            </div>
          </div>
      )}
    </div>
  )
}
