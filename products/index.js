/*
 * This file is the entrypoint for the products microservice.
 * It creates an Apollo Server for the microservice and defines the GraphQL schema and resolvers for the service.
 */

const { ApolloServer, gql } = require("apollo-server");
const ProductsAPI = require("./products-datasource");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  input ProductDetails {
    id: String!
    name: String
    price: Int
    weight: Int
  }
  type Product {
    id: String!
    name: String
    price: Int
    weight: Int
  }
  type Query {
    products: [Product]
    product(id: String!): Product
  }
  type Mutation {
    addProduct(input: ProductDetails): Product
  }
`;

const resolvers = {
  Query: {
    products: (root, args, { dataSources }) => {
      return dataSources.productsAPI.getAllProducts();
    },
    product: (root, { id }, { dataSources }) => {
      return dataSources.productsAPI.getProduct(id);
    }
  },
  Mutation: {
    addProduct: (root, { input }, { dataSources }) => {
      return dataSources.productsAPI.addProduct(input).then(result => {
        return result;
      });
    }
  }
};

const schema = buildFederatedSchema([
  {
    typeDefs,
    resolvers
  }
]);

// Apollo Server is used to layer GraphQL over the RESTful API for our service
const server = new ApolloServer({
  schema,
  dataSources: () => ({
    productsAPI: new ProductsAPI()
  })
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
