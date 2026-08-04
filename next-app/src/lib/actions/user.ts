"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"
import { z } from "zod"

export async function getUsers() {
  return await prisma.user.findMany()
}

export async function updateUserRole(id: string, role: Role) {
  await prisma.user.update({
    where: { id },
    data: { role }
  })
  revalidatePath("/admin")
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id }
  })
  revalidatePath("/admin")
}
