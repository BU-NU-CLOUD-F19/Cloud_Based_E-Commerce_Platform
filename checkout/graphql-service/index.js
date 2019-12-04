/*
 * This file creates an Apollo Server for the checkout microservice and
 * defines the GraphQL schema and resolvers for the service
 * which will be used to communicate with the GraphQL API gateway
 */

const { ApolloServer, gql } = require("apollo-server");
const CheckoutAPI = require("./datasource");
const { buildFederatedSchema } = require("@apollo/federation");

const logger = require('./src/utils/logger');

// Type definitions for a GraphQL schema
const typeDefs = gql`
  type OrderDetails{
    oid: Int
    total_price: Float
    date: String
    destination: String
    shipping: Float
    uid: String
  }
  type CompleteCheckoutSuccess {
    message: String
    data: OrderDetails
  }
  type SuccessMessage {
    message: String
  }
  type Mutation {
    beginCheckout(id: Int!, sid: String, uid: String, password: String): SuccessMessage
    completeCheckout(id: Int!, sid: String, uid: String, password: String): CompleteCheckoutSuccess
    abortCheckout(id: Int!, sid: String, uid: String, password: String): SuccessMessage
  }
`;

// Resolvers are required for each schema type to be able to respond to queries
const resolvers = {
    // Query and Mutations are root types that will be executed by the GraphQL server
    Mutation: {
        beginCheckout: (root, { id, sid, uid, password }, { dataSources }) => {
            return dataSources.checkoutAPI.beginCheckout(id, sid, uid, password).then(result => {
                return result;
            });
        },
        completeCheckout: (root, { id, sid, uid, password }, { dataSources }) => {
            return dataSources.checkoutAPI.completeCheckout(id, sid, uid, password).then(result => {
                return result;
            });
        },
        abortCheckout: (root, { id, sid, uid, password }, { dataSources }) => {
            return dataSources.checkoutAPI.abortCheckout(id, sid, uid, password).then(result => {
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
        checkoutAPI: new CheckoutAPI()
    })
});

// Starts the GraphQL server for the products microservice
try {
    server.listen({ port: 7000 }).then(({ url }) => {
        console.log(`Server ready at ${url}`);
    });
} catch (err) {
    logger.error(`Error occurred while starting the Apollo Server for 
    the checkout microservice - ${err.message}`);
}
