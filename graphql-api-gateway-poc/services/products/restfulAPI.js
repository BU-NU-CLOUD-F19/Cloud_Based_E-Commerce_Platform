const Hapi = require("hapi");

const server = new Hapi.Server({
  host: "localhost",
  port: 4050
});

server.start().then(() => {
  console.log("Listening at " + server.info.uri);
});

server.route({
  method: "GET",
  path: "/products",
  handler: (req, res) => {
    return res.response(products);
  }
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
