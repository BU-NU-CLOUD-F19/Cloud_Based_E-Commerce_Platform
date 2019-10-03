/*
 * This file creates an Apollo Server for the members microservice and defines the GraphQL schema and resolvers for the service
 * which will be used to communicate with the GraphQL API gateway
 */

const { ApolloServer, gql } = require("apollo-server");
const MembersAPI = require("./datasource");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  input MemberDetails {
    id: Int!
    name: String
  }
  type Member {
    id: Int!
    name: String
  }
  type Query {
    members: [Member]
    member(id: Int!): Member
  }
  type Mutation {
    addMember(input: MemberDetails): Member
  }
`;

const resolvers = {
  Query: {
    members: (root, args, { dataSources }) => {
      return dataSources.membersAPI.getAllMembers();
    },
    member: (root, { id }, { dataSources }) => {
      return dataSources.membersAPI.getMember(id);
    }
  },
  Mutation: {
    addMember: (root, { input }, { dataSources }) => {
      return dataSources.membersAPI.addMember(input).then(result => {
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
    membersAPI: new MembersAPI()
  })
});

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
