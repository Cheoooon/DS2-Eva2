# Schema Design

## Models

### Table
- `id`: String (Primary Key, CUID)
- `name`: String (Default: "mesa-")
- `capacity`: Int
- `active`: Boolean (Default: true)
- `reservations`: Reservation[]
- `deletedAt`: DateTime?

### Reservation
- `id`: String (Primary Key, CUID)
- `userId`: String
- `tableId`: String
- `startTime`: DateTime
- `endTime`: DateTime
- `status`: Status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `customerName`: String
- `occupants`: Int
- `notes`: String?
- `deletedAt`: DateTime?

### User
- `id`: String (Primary Key, CUID)
- `email`: String (Unique)
- `role`: Role (CLIENT, STAFF, ADMIN)
- `password`: String
