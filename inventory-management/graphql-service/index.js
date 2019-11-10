/*
 * This file creates an Apollo Server for the inventory microservice and
 * defines the GraphQL schema and resolvers for the service
 * which will be used to communicate with the GraphQL API gateway
 */

const { ApolloServer, gql } = require("apollo-server");
const InventoryAPI = require("./datasource");
const { buildFederatedSchema } = require("@apollo/federation");

const logger = require('./src/utils/logger');

// Type definitions for a GraphQL schema
const typeDefs = gql`
  input ProductDetails {
    pid: Int!
    pcode: String
    price: Float
    sku: String!
    amount_in_stock: Int
    pname: String!
    description: String!
    lang: String!
  }
  type Product {
    pid: Int
    pcode: String
    price: Float
    sku: String
    amount_in_stock: Int
    pname: String
    description: String
    lang: String
  }
  type Query {
    products: [Product]
    product(id: Int!): Product
  }
  type Mutation {
    addProduct(input: ProductDetails): Product
    updateProduct(id: Int!, input: ProductDetails): Product
    deleteProduct(id: Int!): String
  }
`;

// Resolvers are required for each schema type to be able to respond to queries
const resolvers = {
    // Query and Mutations are root types that will be executed by the GraphQL server
    Query: {
        products: (root, args, { dataSources }) => {
            return dataSources.inventoryAPI.getAllProducts();
        },
        product: (root, { id }, { dataSources }) => {
            return dataSources.inventoryAPI.getProduct(id);
        }
    },
    Mutation: {
        addProduct: (root, { input }, { dataSources }) => {
            return dataSources.inventoryAPI.addProduct(input).then(result => {
                return result;
            });
        },
        updateProduct: (root, { id, input }, { dataSources }) => {
            return dataSources.inventoryAPI.updateProduct(input, id).then(result => {
                return result;
            });
        },
        deleteProduct: (root, { id }, { dataSources }) => {
            return dataSources.inventoryAPI.deleteProduct(id).then(result => {
                return result;
            });
        }
    }
};

// Builds a federated schema from the typedefs and resolvers
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
        inventoryAPI: new InventoryAPI()
    })
});

// Starts the GraphQL server for the products microservice
try {
    server.listen({ port: 6000 }).then(({ url }) => {
        console.log(`Server ready at ${url}`);
    });
} catch (err) {
    logger.error(`Error occurred while starting the Apollo Server for the inventory-management microservice - ${err.message}`);
}
