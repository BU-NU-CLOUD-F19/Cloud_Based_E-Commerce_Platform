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
  input ProductID {
    pid: Int!
  }
  type ProductInfo {
    pid: Int
    amount_in_cart: Int
  }
  type AuthDetails {
    authorized: Boolean
    uid: String
    as: String
  }
  type RemoveProductSuccess{
    message: String
    data: Int
    auth: AuthDetails
  }
  type GetProductSuccess {
    message: String
    data: [ProductInfo]
    auth: AuthDetails
  }
  type LockStatus {
    locked: Boolean
  }
  type GetLockStatus{
    message: String
    data: LockStatus
    auth: AuthDetails
  }
  type DeleteCartSuccess {
    message: String
    auth: AuthDetails
  }
  type Query {
    getProducts(id: Int!, sid: String, uid: String, password: String): GetProductSuccess
    getLockStatus(id: Int!, sid: String, uid: String, password: String): GetLockStatus
  }
  type Mutation {
    addProductToCart(id: Int!, input: ProductInCart, sid: String, uid: String, password: String): GetProductSuccess
    removeProduct(id: Int!, input: ProductID, sid: String, uid: String, password: String): RemoveProductSuccess
    emptyCart(id: Int!, sid: String, uid: String, password: String): RemoveProductSuccess
    changeAmount(id: Int!, input: ProductInCart, sid: String, uid: String, password: String): GetProductSuccess
    deleteCart(id: Int!, sid: String, uid: String, password: String): DeleteCartSuccess
    lockCart(id: Int!, sid: String, uid: String, password: String): DeleteCartSuccess
    unlockCart(id: Int!, sid: String, uid: String, password: String): DeleteCartSuccess
  }
`;

// Resolvers are required for each schema type to be able to respond to queries
const resolvers = {
    // Query and Mutations are root types that will be executed by the GraphQL server
    Query: {
        getProducts: (root, { id, sid, uid, password }, { dataSources }) => {
            return dataSources.cartAPI.getProductsInCart(id, sid, uid, password);
        },
        getLockStatus: (root, { id, sid, uid, password }, { dataSources }) => {
            return dataSources.cartAPI.getLockStatus(id, sid, uid, password);
        },
    },
    Mutation: {
        addProductToCart: (root, { id, input, sid, uid, password }, { dataSources }) => {
            return dataSources.cartAPI.addProductToCart(id, input, sid, uid, password).then(result => {
                return result;
            });
        },
        removeProduct: (root, { id, input, sid, uid, password }, { dataSources }) => {
            return dataSources.cartAPI.removeProductFromCart(id, input, sid, uid, password).then(result => {
                return result;
            });
        },
        emptyCart: (root, { id, sid, uid, password }, { dataSources }) => {
            return dataSources.cartAPI.emptyCart(id, sid, uid, password).then(result => {
                return result;
            });
        },
        changeAmount: (root, { id, input, sid, uid, password }, { dataSources }) => {
            return dataSources.cartAPI.changeAmountOfProduct(id, input, sid, uid, password).then(result => {
                return result;
            });
        },
        deleteCart: (root, { id, sid, uid, password }, { dataSources }) => {
            return dataSources.cartAPI.deleteCart(id, sid, uid, password).then(result => {
                return result;
            });
        },
        lockCart: (root, { id, sid, uid, password }, { dataSources }) => {
            return dataSources.cartAPI.lockCart(id, sid, uid, password).then(result => {
                return result;
            });
        },
        unlockCart: (root, { id, sid, uid, password }, { dataSources }) => {
            return dataSources.cartAPI.unlockCart(id, sid, uid, password).then(result => {
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
    logger.error(`Error occurred while starting the Apollo Server for 
    the cart-management microservice - ${err.message}`);
}
