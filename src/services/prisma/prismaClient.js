import { PrismaClient } from "@prisma/client";

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [],
    errorFormat:"pretty"
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
