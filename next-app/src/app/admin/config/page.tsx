import { getSystemConfig, updateSystemConfig } from "@/lib/actions/config"
import { Button } from "@/components/ui/Button"
import ConfigForm from "@/components/ConfigForm"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminConfigPage() {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") redirect("/dashboard")

  const config = await getSystemConfig()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Configuración del Sistema</h1>
      <ConfigForm config={config} />
    </div>
  )
}
