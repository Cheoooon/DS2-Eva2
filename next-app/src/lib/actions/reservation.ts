"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Status } from "@prisma/client"
import { z } from "zod"

export const reservationSchema = z.object({
  userId: z.string().cuid(),
  tableId: z.string().cuid(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
})

export async function createReservation(rawData: unknown) {
  const data = reservationSchema.parse(rawData)

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
