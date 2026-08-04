import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";

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

  console.log("Seeded admin and staff users.");
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
