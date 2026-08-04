"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getSystemConfig() {
  return await prisma.systemConfig.upsert({
    where: { id: "config" },
    update: {},
    create: { id: "config" },
  })
}

export async function updateSystemConfig(data: { cancellationWindow: number; notificationRetention: number }) {
  await prisma.systemConfig.update({
    where: { id: "config" },
    data,
  })
  revalidatePath("/admin/config")
}
