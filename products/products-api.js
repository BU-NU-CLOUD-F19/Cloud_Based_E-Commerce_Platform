/**
 * This file creates a simple RESTful API for the products microservice and declares a products array with data for testing the API.
 */

const Hapi = require("hapi");

const server = new Hapi.Server({
  host: "localhost",
  port: 4050
});

server.start().then(() => {
  console.log("Listening at " + server.info.uri);
});

// Route for retrieving all products
server.route({
  method: "GET",
  path: "/products",
  handler: (req, res) => {
    return res.response(products);
  }
});

// Route for retrieving a product with a given id
server.route({
  method: "GET",
  path: "/products/{id}",
  handler: (req, res) => {
    const result = products.find(product => product.id === req.params.id);
    return res.response(result);
  }
});

server.route({
  method: "POST",
  path: "/products",
  handler: (req, res) => {
    const newProduct = req.payload;
    products.push(newProduct);
    return res.response(products[products.length - 1]);
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
