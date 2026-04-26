import "dotenv/config";
import path from "node:path";
import { PrismaClient } from "./prisma/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: path.join(process.env.DATA_PATH as string, "armyknife.db"),
});
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
