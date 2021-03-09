const { ApolloServer, gql } = require("apollo-server-lambda");
const faunaDB = require("faunadb"),
  q = faunaDB.query;

const client = new faunaDB.Client({
  secret: "fnAED4NTgJACBS-lZnHtRLhng7me3JVIqpPkygOC",
});

const typeDefs = gql`
  type Query {
    todos: [Todo]!
  }
  type Todo {
    id: ID!
    text: String!
    done: Boolean!
  }
  type Mutation {
    addTodo(text: String!): Todo
    updateTodoDone(id: ID!): Todo
  }
`;

const resolvers = {
  Query: {
    todos: async (parent, args, { user }) => {
      if (!user) {
        return [];
      } else {
        const results = await client.query(
          q.Paginate(q.Match(q.Index("todos_by_user"), user))
        );
        return results.data.map(([ref, text, done]) => ({
          id: ref.id,
          text,
          done,
        }));
      }
    },
  },
  Mutation: {
    addTodo: async (_, { text }, { user }) => {
      if (!user) {
        throw new Error("Must e authenticated to insert todos.");
      }
      const result = await client.query(
        q.Create(q.Collection("todos"), {
          data: { text, done: false, owner: user },
        })
      );
      return {
        ...result.data,
        id: result.ref.id,
      };
    },
    updateTodoDone: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error("Must e authenticated to update a todo.");
      }
      const response = await client.query(
        q.Get(q.Ref(q.Collection("todos"), id))
      );
      const previousTodoStatus = response.data.done;
      const result = await client.query(
        q.Update(q.Ref(q.Collection("todos"), id), {
          data: { done: !previousTodoStatus },
        })
      );
      return {
        ...result.data,
        id: result.ref.id,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context: theContext }) => {
    if (theContext.clientContext.user) {
      return { user: theContext.clientContext.user.sub };
    } else {
      return {};
    }
  },
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler({});
