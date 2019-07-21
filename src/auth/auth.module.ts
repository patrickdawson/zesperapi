import { Module } from '@nestjs/common';
import { HttpStrategy } from './http-strategy';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [PrismaModule],
  exports: [],
  providers: [HttpStrategy, AuthService, UsersResolver],
})
export class AuthModule {}
