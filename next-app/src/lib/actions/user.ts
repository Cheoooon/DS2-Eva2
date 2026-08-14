"use server"

import { prisma, Role } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

import bcrypt from "bcryptjs"

export async function createUser(formData: FormData) {
  const email = formData.get("email") as string
  const name = formData.get("name") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as Role

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { email, name, password: hashedPassword, role }
  })
  revalidatePath("/admin")
}

export async function getUsers() {
  return await prisma.user.findMany({ where: { deletedAt: null } })
}

export async function updateUserRole(id: string, role: Role) {
  await prisma.user.update({
    where: { id },
    data: { role }
  })
  revalidatePath("/admin")
}

export async function deleteUser(id: string) {
  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() }
  })
  revalidatePath("/admin")
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({ where: { id } })
}

export async function updateUser(id: string, data: { name: string; email: string; role: Role }) {
  await prisma.user.update({
    where: { id },
    data
  })
  revalidatePath("/admin")
}
