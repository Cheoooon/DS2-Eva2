"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createTable(data: { capacity: number }) {
  await prisma.table.create({ data })
  revalidatePath("/tables")
}

export async function getTables() {
  return await prisma.table.findMany()
}

export async function updateTable(id: string, data: { capacity?: number; active?: boolean }) {
  await prisma.table.update({ where: { id }, data })
  revalidatePath("/tables")
}

export async function deleteTable(id: string) {
  await prisma.table.delete({ where: { id } })
  revalidatePath("/tables")
}
