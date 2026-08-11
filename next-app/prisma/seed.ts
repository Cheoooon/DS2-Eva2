import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);
  console.log("Password hash:", passwordHash);

  await prisma.user.create({
    data: { 
      email: "admin@sabor.com", 
      name: "Admin", 
      role: "ADMIN", 
      password: passwordHash 
    },
  });

  await prisma.user.create({
    data: { 
      email: "staff@sabor.com", 
      name: "Staff", 
      role: "STAFF", 
      password: passwordHash 
    },
  });

  await prisma.table.createMany({
    data: [
        { name: "mesa-1", capacity: 2 },
        { name: "mesa-2", capacity: 4 },
        { name: "mesa-3", capacity: 6 },
    ]
  })

  console.log("Seeded admin, staff users and tables.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
