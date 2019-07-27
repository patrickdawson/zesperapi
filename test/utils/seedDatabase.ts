import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ConfigurationService } from '../../src/configuration/configuration.service';

const userOne = {
  input: {
    name: 'one',
    email: 'one@demo.de',
    password: bcrypt.hashSync('pass123'),
    admin: true,
  },
  user: undefined,
  jwt: undefined,
};

const seedDatabase = async (app: INestApplication) => {
  const config = app.get(ConfigurationService);
  const prisma = app.get(PrismaService);
  await prisma.mutation.deleteManyUsers({});

  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, config.jwtSecret);
};

export { seedDatabase as default, userOne };
