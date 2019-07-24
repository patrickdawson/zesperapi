import { AppModule } from './../src/app.module';
import ApolloClient, { gql } from 'apollo-boost';
import { NestFactory } from '@nestjs/core';
import seedDatabase from './utils/seedDatabase';

describe('AppController (e2e)', () => {
  const uri = 'http://localhost:3000/graphql';
  let app;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule);
    await app.listen(3000);
  });
  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {
    await seedDatabase(app);
  });

  describe('not authenticated', () => {
    let client;

    beforeEach(() => {
      client = new ApolloClient({
        uri,
      });
      client.defaultOptions = {
        query: {
          errorPolicy: 'all',
        },
      };
    });

    it('can create a new user', async () => {
      const result = await client.mutate({
        mutation: gql`
          mutation {
            createUser(data: { name: "Patrick", email: "patrick@demo.de", password: "foo" }) {
              token
            }
          }
        `,
      });
      expect(result.errors).toBeUndefined();
      expect(result.data.createUser.token).not.toBeUndefined();
    });

    it('cannot query users', async () => {
      const result = await client.query({
        query: gql`
        {
          users {
            id
          }
        }
      `,
      });
      expect(result.errors).toBeDefined();
      expect(result.errors[0].message.statusCode).toEqual(401);
    });

    it('cannot query user', async () => {
      const result = await client.query({
        query: gql`
        {
          user(query: {
            email: "patrick@demo.de"
          }) {
            id
          }
        }
      `,
      });
      expect(result.errors).toBeDefined();
      expect(result.errors[0].message.statusCode).toEqual(401);
    });
  });

  describe('authenticated', () => {
    let client;

    beforeEach(() => {
      client = new ApolloClient({
        uri: 'http://localhost:3000/graphql',
        headers: {
          authorization:
            'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhI' +
            'jp7InNlcnZpY2UiOiJ6ZXNwZXJAZGV2Iiwicm9sZXMiOlsiYWRtaW4iXX0sImlhdCI6' +
            'MTU2MjUwMDk0MiwiZXhwIjoxNTYzMTA1NzQyfQ.5lMitCjbw80nzMnLqA9ECvMoQ3i_' +
            'Lzb582gkMZmoe1Q',
        },
      });
    });

    it('can query users', async () => {
      const result = await client.query({
        query: gql`
          {
            users {
              id
            }
          }
        `,
      });

      expect(result.errors).toBeUndefined();
      expect(result.data.users).toEqual([]);
    });
  });
});
