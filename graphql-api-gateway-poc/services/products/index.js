const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    myProducts(first: Int = 5): [Product]
  }
  type Product @key(fields: "id") {
    id: String!
    name: String
    price: Int
    weight: Int
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find(product => product.id === object.id);
    }
  },
  Query: {
    myProducts(_, args) {
      return products.slice(0, args.first);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

const products = [
  {
    id: "1",
    name: "Table",
    price: 100,
    weight: 10
  },
  {
    id: "2",
    name: "Board",
    price: 500,
    weight: 50
  },
  {
    id: "3",
    name: "Chair",
    price: 50,
    weight: 5
  }
];
