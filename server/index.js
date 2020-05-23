import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';
import models from './models';

const GRAPHQL_ENDPOINT = '/graphql';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();

app.use(cors('*'));
app.use(
  GRAPHQL_ENDPOINT,
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      models,
      user: {
        id: 1
      }
    }
  })
);
app.use('/graphiql', graphiqlExpress({ endpointURL: GRAPHQL_ENDPOINT }));

models.sequelize
  .sync({
    // force: true
  })
  .then(() => {
    app.listen(8080);
  });
