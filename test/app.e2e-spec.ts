import { AppModule } from '../src/app.module';
import ApolloClient, { gql } from 'apollo-boost';
import { NestFactory } from '@nestjs/core';
import seedDatabase, { userOne } from './utils/seedDatabase';

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
        mutate: {
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

    it('can login', async () => {
      const result = await client.mutate({
        mutation: gql`
          mutation {
            login(data: { email: "one@demo.de", password: "pass123" }) {
              token
            }
          }
        `,
      });
      expect(result.errors).toBeUndefined();
      expect(result.data.login.token).not.toBeUndefined();
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

    it('cannot delete own user', async () => {
      const result = await client.mutate({
        mutation: gql`
        mutation {
          deleteUser {
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
          authorization: `Bearer ${userOne.jwt}`,
        },
      });
      client.defaultOptions = {
        query: {
          errorPolicy: 'all',
        },
      };
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
      expect(result.data.users.length).toEqual(1);
      expect(result.data.users[0].id).toEqual(userOne.user.id);
    });

    it('can query user', async () => {
      const result = await client.query({
        query: gql`
          {
            user(query: {
              id: "${userOne.user.id}"
            }) {
              id
            }
          }
        `,
      });

      expect(result.errors).toBeUndefined();
      expect(result.data.user.id).toEqual(userOne.user.id);
    });

    it('can delete own user', async () => {
      const result = await client.mutate({
        mutation: gql`
          mutation {
            deleteUser {
              id
            }
          }
        `,
      });

      expect(result.errors).toBeUndefined();
      expect(result.data.deleteUser.id).toEqual(userOne.user.id);
    });
  });
});
