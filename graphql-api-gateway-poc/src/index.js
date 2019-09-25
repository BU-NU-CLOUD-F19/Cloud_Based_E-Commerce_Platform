/*
 * This file is the entrypoint for the GraphQL API Gateway.
 */

const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const PORT = process.env.PORT || 3000;

const gateway = new ApolloGateway({
  serviceList: [
    { name: "products", url: "http://localhost:4001/products" }
    // add other services here
  ]
});

const startGateway = async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({ schema, executor });

  server.listen(PORT).then(({ url }) => {
    console.log(`Server started on ${url}`);
  });
};

startGateway();
