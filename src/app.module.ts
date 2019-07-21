import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./src/schema.graphql'],
      context: ({ req }) => ({ req }),
      definitions: {
        path: join(process.cwd(), 'src/generated/graphqlTypings.ts'),
      },
    }),
    AuthModule,
  ],
  exports: [GraphQLModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
