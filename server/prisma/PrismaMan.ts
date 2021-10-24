import { PrismaClient } from '@prisma/client';

class PrismaMan {
  public readonly prisma: PrismaClient;

  private static instance: PrismaMan;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getPrisma(): PrismaClient {
    if (!PrismaMan.instance) {
      PrismaMan.instance = new PrismaMan();
    }
    return PrismaMan.instance.prisma;
  }
}

export default PrismaMan;