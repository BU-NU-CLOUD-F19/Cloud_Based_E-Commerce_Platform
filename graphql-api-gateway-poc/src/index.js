/**
 * This file is the entrypoint for the GraphQL API Gateway.
 */

const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const logger = require('./utils/logger');

const PORT = process.env.PORT || 3050;
const host = process.env.GRAPHQL_SERVICE;
const GRAPHQL_SERVICE_PORT = process.env.GRAPHQL_SERVICE_PORT || 6000;

const gateway = new ApolloGateway({
  // Add different microservices here with thier server (with schema, resolvers, data sources) url
  serviceList: [
    // {
    //   name: "members",
    //   url: `http://${host}:${GRAPHQL_SERVICE_PORT}/members`
    // }
    {
      name: "inventory-management",
      url: `http://${host}:${GRAPHQL_SERVICE_PORT}/inventory-management`
    }
    // add other services here
  ]
});

const startGateway = async () => {
  try {
    const { schema, executor } = await gateway.load();
    const server = new ApolloServer({ schema, executor }); // Creates a new Apollo server for the API Gateway
    server.listen(PORT).then(({ url }) => {
      logger.info(`Server started on ${url}`);
    });
  } catch (err) {
    logger.error(`Error occurred while starting the API Gateway - ${err.message}`);
  }
};

// Boots up the Apollo Gateway
startGateway();
