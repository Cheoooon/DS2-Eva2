"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createTable(data: { name: string; capacity: number }) {
  const table = await prisma.table.create({ data })
  console.log("Table created:", table)
  revalidatePath("/tables")
}

export async function getTables() {
  return await prisma.table.findMany({
    include: { reservations: true }
  })
}
export async function getTableById(id: string) {
  return await prisma.table.findUnique({ where: { id } })
}

export async function updateTable(id: string, data: { name?: string; capacity?: number; active?: boolean }) {
  if (data.active === false) {
    const tableWithReservations = await prisma.reservation.findFirst({
      where: { tableId: id, status: { not: 'CANCELLED' } }
    })
    if (tableWithReservations) {
      throw new Error("No se puede desactivar una mesa con reservas activas.")
    }
  }
  await prisma.table.update({ where: { id }, data })
  revalidatePath("/tables")
}

export async function deleteTable(id: string) {
  // Solo permitir borrar si todas las reservaciones son MOVED
  const activeReservation = await prisma.reservation.findFirst({
    where: {
      tableId: id,
      status: { not: 'MOVED' }
    }
  })
  if (activeReservation) {
    throw new Error("No se puede borrar una mesa con reservas asociadas que no estén en estado 'Cambiado de mesa' (MOVED).")
  }

  // Borrar primero las reservaciones MOVED asociadas
  await prisma.reservation.deleteMany({
    where: { tableId: id, status: 'MOVED' }
  })

  await prisma.table.delete({ where: { id } })
  revalidatePath("/tables")
}
export async function getTablesSorted() {
  return await prisma.table.findMany({
    orderBy: [{ active: 'desc' }, { name: 'asc' }]
  })
}
