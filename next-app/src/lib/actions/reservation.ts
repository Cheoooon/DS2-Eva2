"use server"

import { prisma, Status } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { reservationSchema } from "@/lib/schemas"

export async function createReservation(rawData: unknown) {
  console.log("createReservation rawData:", JSON.stringify(rawData, null, 2))
  const data = reservationSchema.parse(rawData)
  console.log("createReservation parsed data:", JSON.stringify(data, null, 2))

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
export async function getReservationsByDate(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.reservation.findMany({
    where: {
      startTime: { gte: startOfDay, lte: endOfDay },
      status: { not: Status.CANCELLED }
    },
    include: { user: true, table: true },
    orderBy: { startTime: 'asc' }
  })
}
