const { ApolloServer, gql } = require("apollo-server");
const ProductsAPI = require("./restProducts");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Product {
    id: String!
    name: String
    price: Int
    weight: Int
  }
  type Query {
    products: [Product]
  }
`;

const resolvers = {
  Query: {
    products: (root, args, { dataSources }) => {
      return dataSources.productsAPI.getAllProducts()
    }
  }
};

const schema = buildFederatedSchema([
  {
    typeDefs,
    resolvers,
  }
]);
const server = new ApolloServer({
  schema,
  dataSources: () => ({
      productsAPI: new ProductsAPI()
    })
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
