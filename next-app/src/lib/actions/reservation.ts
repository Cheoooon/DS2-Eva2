"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Status } from "@prisma/client"

export async function createReservation(data: { 
  userId: string, 
  tableId: string, 
  startTime: Date, 
  endTime: Date 
}) {
  const existing = await prisma.reservation.findFirst({
    where: {
      tableId: data.tableId,
      status: { not: Status.CANCELLED },
      startTime: { lt: data.endTime },
      endTime: { gt: data.startTime }
    }
  });

  if (existing) {
    throw new Error("Mesa no disponible en este horario.");
  }

  await prisma.reservation.create({ data })
  revalidatePath("/reservations")
}

export async function getReservations() {
  return await prisma.reservation.findMany({
    include: { user: true, table: true }
  })
}

export async function updateReservationStatus(id: string, status: Status) {
  await prisma.reservation.update({ 
    where: { id }, 
    data: { status } 
  })
  revalidatePath("/reservations")
}
