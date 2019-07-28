import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { AuthService } from '../auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { User } from '../generated/prisma.binding';

@Resolver('Menu')
export class MenuResolver {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigurationService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async menus(@Args() args, @Info() info): Promise<any[]> {
    return [];
  }
}
