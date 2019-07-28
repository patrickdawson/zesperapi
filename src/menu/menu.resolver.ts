import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CreateMenuInput, Menu } from '@zesper/api-interface';

@Resolver('Menu')
export class MenuResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async menus(@Args() args, @Info() info): Promise<Menu[]> {
    return this.prisma.query.menus(args, info);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createMenu(@Args() args: { data: CreateMenuInput }, @Info() info): Promise<Menu> {
    return this.prisma.mutation.createMenu({
      data: {
        name: args.data.name,
        items: {
          create: args.data.items,
        },
      },
    });
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteMenu(@Args() args: { id: string }, @Info() info): Promise<Menu> {
    return this.prisma.mutation.deleteMenu({
      where: {
        id: args.id,
      },
    });
  }
}
