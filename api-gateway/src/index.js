/**
 * This file is the entrypoint for the GraphQL API Gateway.
 */

const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const logger = require('./utils/logger');

const PORT = process.env.API_GW_PORT || 3050;
const inventory_host = process.env.INVENTORY_GQL_HOST;
const cart_host = process.env.CART_GQL_HOST;
const checkout_host = process.env.CHECKOUT_GQL_HOST;
const INVENTORY_GRAPHQL_SERVICE_PORT = process.env.INVENTORY_GQL_PORT || 6000;
const CART_GRAPHQL_SERVICE_PORT = process.env.CART_GQL_PORT || 6050;
const CHECKOUT_GRAPHQL_SERVICE_PORT = process.env.CHECKOUT_GQL_PORT || 7000;

const gateway = new ApolloGateway({
  // Add different microservices here with thier server (with schema, resolvers, data sources) url
  serviceList: [
    {
      name: "inventory-management",
      url: `http://${inventory_host}:${INVENTORY_GRAPHQL_SERVICE_PORT}/inventory-management`
    },
    {
      name: "cart",
      url: `http://${cart_host}:${CART_GRAPHQL_SERVICE_PORT}/cart`
    },
    {
      name: "checkout",
      url: `http://${checkout_host}:${CHECKOUT_GRAPHQL_SERVICE_PORT}/checkout`
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
