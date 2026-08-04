"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"
export async function getUsers() {
  return await prisma.user.findMany({ where: { deletedAt: null } })
}


export async function updateUserRole(id: string, role: Role) {
  await prisma.user.update({
    where: { id },
    data: { role }
  })
export async function deleteUser(id: string) {
  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() }
  })
  revalidatePath("/admin")
}
