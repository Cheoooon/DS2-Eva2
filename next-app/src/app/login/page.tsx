import { signIn } from "@/lib/auth"

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <form
        action={async (formData) => {
          "use server"
          await signIn("credentials", formData)
        }}
        className="p-8 border rounded shadow-md"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input name="email" type="email" placeholder="Email" className="block w-full p-2 mb-2 border" />
        <input name="password" type="password" placeholder="Password" className="block w-full p-2 mb-2 border" />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
      </form>
    </div>
  )
}
