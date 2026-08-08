import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const tableSchema = z.object({
  capacity: z.coerce.number().int().min(1, "La capacidad debe ser al menos 1"),
});

export const reservationSchema = z.object({
  userId: z.string(),
  tableId: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});
