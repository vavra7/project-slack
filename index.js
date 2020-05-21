import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schema';
import resolvers from './resolvers';

const GRAPHQL_ENDPOINT = '/graphql';

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();

app.use(GRAPHQL_ENDPOINT, bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: GRAPHQL_ENDPOINT }));
app.listen(8080);
