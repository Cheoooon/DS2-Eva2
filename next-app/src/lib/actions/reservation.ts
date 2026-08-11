"use server"

import { prisma, Status } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { reservationSchema } from "@/lib/schemas"

export async function createReservation(rawData: unknown) {
  console.log("DEBUG: rawData en createReservation:", JSON.stringify(rawData, null, 2));
  
  // Validamos con el schema
  const data = reservationSchema.parse(rawData);
  console.log("DEBUG: Datos parseados por Zod:", JSON.stringify(data, null, 2));


  const existing = await prisma.reservation.findFirst({
    where: {
      tableId: data.tableId,
      date: data.date,
      status: { not: Status.CANCELLED },
      startHour: { lt: data.endHour },
      endHour: { gt: data.startHour }
    }
  });

  if (existing) {
    throw new Error("Mesa no disponible en este horario.");
  }
  
  await prisma.reservation.create({ 
      data: {
          ...data
      } 
  });
  
  try { revalidatePath("/reservations"); } catch (e) { console.warn("revalidatePath failed"); }
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
  const dateStr = date.toISOString().split('T')[0];

  return await prisma.reservation.findMany({
    where: {
      date: dateStr,
      status: { not: Status.CANCELLED }
    },
    include: { user: true, table: true },
    orderBy: { startHour: 'asc' }
  })
}
