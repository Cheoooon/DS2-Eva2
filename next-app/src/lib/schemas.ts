import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const tableSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  capacity: z.coerce.number().int().min(1, "La capacidad debe ser al menos 1"),
});
export const reservationSchema = z.object({
  userId: z.string(),
  tableId: z.string(),
  date: z.string(),
  startHour: z.coerce.number().int(),
  endHour: z.coerce.number().int(),
  customerName: z.string().min(1, "Nombre requerido"),
  occupants: z.coerce.number().int().min(1, "Al menos 1 ocupante"),
  notes: z.string().optional(),
});
