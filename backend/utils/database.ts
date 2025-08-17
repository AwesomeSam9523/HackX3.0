import { PrismaClient } from "@prisma/client";

// Singleton pattern for Prisma client
declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

// Database utilities
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log("Database disconnected successfully");
  } catch (error) {
    console.error("Database disconnection failed:", error);
  }
}

export async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}
