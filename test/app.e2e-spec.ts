import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import ApolloClient, { gql } from 'apollo-boost';
import { NestFactory } from '@nestjs/core';

describe('AppController (e2e)', () => {
  let app;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule);
    await app.listen(3000);
  });

  afterAll(async () => {
    app.close();
  });

  describe('/graphql', () => {
    it('can query users', async () => {
      const client = new ApolloClient({
        uri: 'http://localhost:3000/graphql',
        headers: {
          authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhI' +
            'jp7InNlcnZpY2UiOiJ6ZXNwZXJAZGV2Iiwicm9sZXMiOlsiYWRtaW4iXX0sImlhdCI6' +
            'MTU2MjUwMDk0MiwiZXhwIjoxNTYzMTA1NzQyfQ.5lMitCjbw80nzMnLqA9ECvMoQ3i_' +
            'Lzb582gkMZmoe1Q',
        },
      });

      const result = await client.query({
        query: gql`{ users { id } }`,
      });

      expect(result.errors).toBeUndefined();
      expect(result.data.users).toEqual([]);

      // const mod = app.get(GraphQLModule);
      // const { query } = createTestClient(mod.apolloServer);
      // const res = await query({
      //   query: gql`{ users { id } }`,
      // });
      // console.log(res);
      // expect(res.errors).toBeUndefined();
      // expect(res.data.users).toEqual([]);
    });
  });
});
