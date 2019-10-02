/**
 * This file is the entrypoint for the GraphQL API Gateway.
 */

const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const PORT = process.env.PORT || 3050;

const gateway = new ApolloGateway({
  // Add different microservices here with thier server (with schema, resolvers, data sources) url
  serviceList: [
    { name: "products", url: "http://products:4001/products" }
    // add other services here
  ]
});

const startGateway = async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({ schema, executor }); // Creates a new Apollo server for the API Gateway

  server.listen(PORT).then(({ url }) => {
    console.log(`Server started on ${url}`);
  });
};

// Boots up the Apollo Gateway
startGateway();
