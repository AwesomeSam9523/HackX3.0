import {Prisma, PrismaClient} from "@prisma/client";

// Singleton pattern for Prisma client
declare global {
  var __prisma: PrismaClient | undefined;
}

const clientOptions = {
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
} satisfies Prisma.PrismaClientOptions;

export const prisma: PrismaClient<typeof clientOptions> =
  globalThis.__prisma ||
  new PrismaClient(clientOptions);

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
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
