"use client"

import { signOut } from "@/lib/auth"

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Cerrar sesión
    </button>
  )
}
