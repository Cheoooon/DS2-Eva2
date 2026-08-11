import { prisma } from "./src/lib/prisma";

async function main() {
  const users = await prisma.user.count();
  const tables = await prisma.table.count();
  console.log("Users count:", users);
  console.log("Tables count:", tables);
}

main();
