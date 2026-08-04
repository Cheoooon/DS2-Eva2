import { signIn, auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        action={async (formData) => {
          "use server"
          try {
            await signIn("credentials", formData)
          } catch (error) {
            console.error("Login error:", error)
          }
        }}
        className="p-8 border rounded shadow-md"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input name="email" type="email" placeholder="Email" className="block w-full p-2 mb-2 border" required />
        <input name="password" type="password" placeholder="Password" className="block w-full p-2 mb-2 border" required />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
      </form>
    </div>
  )
}
