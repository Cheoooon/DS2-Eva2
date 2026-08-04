import { logoutAction } from "@/lib/actions/logout"

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button 
        type="submit"
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </form>
  )
}
