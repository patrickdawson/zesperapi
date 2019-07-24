import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

const seedDatabase = async (app: INestApplication) => {
  const prisma = app.get(PrismaService);
  await prisma.mutation.deleteManyUsers({});
};

export { seedDatabase as default };
