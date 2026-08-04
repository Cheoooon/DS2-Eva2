import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const rawDatabaseUrl = process.env.DATABASE_URL;
const databaseUrl = (rawDatabaseUrl ?? "").trim() || "file:./dev.db";

const adapter = new PrismaLibSql({
  url: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

export { prisma };
export default prisma;
