/*
 * The file contains tests for the GraphQL API Gateway and the REST API of the products microservice
 * It tests both the servers using Mocha, Chai and SuperTest
 */

const chai = require("chai");
const { expect } = chai;

const urlGateway = `http://localhost:3000/`; // URL for GraphQL API Gateway
const requestGateway = require("supertest")(urlGateway);

// Tests for GraphQL API Gateway
describe("GraphQL API", () => {
  // Makes a request to get all the products
  it("Returns all products", done => {
    requestGateway
      .post("")
      .send({ query: "{ products { id name price weight } }" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.products).to.have.lengthOf(3);
        return done();
      });
  });
  // Makes a request to get a product with a specific ID
  it("Returns product with ID == 1", done => {
    requestGateway
      .post("")
      .send({ query: '{ product(id: "1") { id name price weight } }' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.product).to.have.property("name");
        expect(res.body.data.product.name).to.equal("Table");
        return done();
      });
  });
});

const urlRestAPI = `http://localhost:4050/`; // URL for GraphQL API Gateway
const requestRestAPI = require("supertest")(urlRestAPI);

// Tests for products microservice RESTful API
describe("Products REST API", () => {
  // Makes a request to get all the products
  it("Returns all products", done => {
    requestRestAPI
      .get("products")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.lengthOf(3);
        return done();
      });
  });
  // Makes a request to get a product with a specific ID
  it("Returns product with ID == 1", done => {
    const id = "1";
    requestRestAPI
      .get(`products/${id}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("name");
        expect(res.body.name).to.equal("Table");
        return done();
      });
  });
});
