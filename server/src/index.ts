import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 4000;

// Define base GraphQL schema
const typeDefs = `#graphql
  type Query {
    health: String!
  }
`;

const resolvers = {
  Query: {
    health: () => 'OK',
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

async function startServer() {
  // Create Apollo Server
  const server = new ApolloServer({
    schema,
  });

  // Start the server
  await server.start();

  // Apply middleware
  app.use(cors());
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server));

  // Start express server
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
});
