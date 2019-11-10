/*
 * This file creates an Apollo Server for the cart microservice and
 * defines the GraphQL schema and resolvers for the service
 * which will be used to communicate with the GraphQL API gateway
 */

const { ApolloServer, gql } = require("apollo-server");
const CartAPI = require("./datasource");
const { buildFederatedSchema } = require("@apollo/federation");

const logger = require('./src/utils/logger');

// Type definitions for a GraphQL schema
const typeDefs = gql`
  input ProductInCart {
    pid: Int!
    amount_in_cart: Int
  }
  input ProductId{
    pid: Int!
  }
  type ProductInfo {
    pid: Int
    amount_in_cart: Int
  }
  type RemoveProduct{
    message: String
    data: Int
  }
  type PostProduct {
    message: String
    data: [ProductInfo]
  }
  type DeleteCart {
    message: String
  }
  type Query {
    getProducts(id: Int!): PostProduct
  }
  type Mutation {
    addProductToCart(id: Int!, input: ProductInCart): PostProduct
    removeProduct(id: Int!, input: ProductId): RemoveProduct
    emptyCart(id: Int!): RemoveProduct
    changeAmount(id: Int!, input: ProductInCart): PostProduct
    deleteCart(id: Int!): DeleteCart
  }
`;

// Resolvers are required for each schema type to be able to respond to queries
const resolvers = {
    // Query and Mutations are root types that will be executed by the GraphQL server
    Query: {
        getProducts: (root, { id }, { dataSources }) => {
            return dataSources.cartAPI.getProductsInCart(id);
        }
    },
    Mutation: {
        addProductToCart: (root, { id, input }, { dataSources }) => {
            return dataSources.cartAPI.addProductToCart(id, input).then(result => {
                return result;
            });
        },
        removeProduct: (root, { id, input }, { dataSources }) => {
            return dataSources.cartAPI.removeProductFromCart(id, input).then(result => {
                return result;
            });
        },
        emptyCart: (root, { id }, { dataSources }) => {
            return dataSources.cartAPI.emptyCart(id).then(result => {
                return result;
            });
        },
        changeAmount: (root, { id, input }, { dataSources }) => {
            return dataSources.cartAPI.changeAmountOfProduct(id, input).then(result => {
                return result;
            });
        },
        deleteCart: (root, { id }, { dataSources }) => {
            return dataSources.cartAPI.deleteCart(id).then(result => {
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
        cartAPI: new CartAPI()
    })
});

// Starts the GraphQL server for the products microservice
try {
    server.listen({ port: 6050 }).then(({ url }) => {
        console.log(`Server ready at ${url}`);
    });
} catch (err) {
    logger.error(`Error occurred while starting the Apollo Server for the cart-management microservice - ${err.message}`);
}
