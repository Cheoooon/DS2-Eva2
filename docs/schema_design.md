# Database Schema (Prisma)

```prisma
model User {
  id    String @id @default(uuid())
  role  Role   @default(CLIENT)
  reservations Reservation[]
}

enum Role { CLIENT, STAFF, ADMIN }

model Table {
  id       String @id @default(uuid())
  capacity Int
  active   Boolean @default(true)
}

model Reservation {
  id        String   @id @default(uuid())
  userId    String
  tableId   String
  startTime DateTime
  endTime   DateTime
  status    Status   @default(PENDING)
}

enum Status { PENDING, CONFIRMED, CANCELLED, COMPLETED }
```
