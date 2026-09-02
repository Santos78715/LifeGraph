import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as prismaClientModule from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Get the PrismaClient class from the generated client
const { PrismaClient } = prismaClientModule as any;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: any;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });
    this.client = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    // PrismaPg adapter handles connection automatically
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  get user() {
    return this.client.user;
  }
}
