"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createTable(data: { name: string; capacity: number }) {
  const table = await prisma.table.create({ data })
  console.log("Table created:", table)
  revalidatePath("/tables")
}

export async function getTables() {
  return await prisma.table.findMany()
}

export async function updateTable(id: string, data: { name?: string; capacity?: number; active?: boolean }) {
  await prisma.table.update({ where: { id }, data })
  revalidatePath("/tables")
}

export async function deleteTable(id: string) {
  await prisma.table.delete({ where: { id } })
  revalidatePath("/tables")
}
export async function getTablesSorted() {
  return await prisma.table.findMany({
    orderBy: [{ active: 'desc' }, { name: 'asc' }]
  })
}
