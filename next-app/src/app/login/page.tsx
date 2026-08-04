"use client"

import { useState } from "react"
import { loginAction } from "@/lib/actions/auth"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        action={async (formData) => {
          const result = await loginAction(formData)
          if (result) {
            setError(result)
          }
        }}
        className="p-8 border rounded shadow-md"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-2 p-2 bg-red-100 rounded">{error}</p>}
        <input name="email" type="email" placeholder="Email" className="block w-full p-2 mb-2 border" required />
        <input name="password" type="password" placeholder="Password" className="block w-full p-2 mb-2 border" required />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
      </form>
    </div>
  )
}
