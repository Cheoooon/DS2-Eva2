"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, Edit2, X, Check } from "lucide-react"
import { deleteUser } from "@/lib/actions/user"
import { useRouter } from "next/navigation"

export default function UserTable({ users }: { users: any[] }) {
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const router = useRouter()

    return (
        <table className="w-full border-collapse border border-slate-300">
            <thead>
                <tr className="bg-slate-100">
                    <th className="border p-2">Nombre</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Rol</th>
                    <th className="border p-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="border p-2">{user.name}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">{user.role}</td>
                        <td className="border p-2 text-center">
                            {confirmDeleteId === user.id ? (
                                <div className="flex justify-center gap-2">
                                    <button onClick={async () => {
                                        await deleteUser(user.id)
                                        setConfirmDeleteId(null)
                                        router.refresh()
                                    }} className="p-2 text-green-600 hover:text-green-700 transition">
                                        <Check size={18} />
                                    </button>
                                    <button onClick={() => setConfirmDeleteId(null)} className="p-2 text-red-600 hover:text-red-700 transition">
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-center gap-2">
                                    <Link href={`/admin/${user.id}/edit`} className="p-2 text-slate-500 hover:text-green-600 transition">
                                        <Edit2 size={18} />
                                    </Link>
                                    <button onClick={() => setConfirmDeleteId(user.id)} className="p-2 text-slate-500 hover:text-red-600 transition">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
