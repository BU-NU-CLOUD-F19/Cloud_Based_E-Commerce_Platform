const chai = require("chai");
const { expect } = chai;
const url = `http://localhost:4002/`;
const request = require("supertest")(url);
describe("GraphQL API", () => {
  it("Returns all products", done => {
    request
      .get("/products")
      .send({ query: "{ myProducts { id name price weight } }" })
      .expect(200)
      .end((err, res) => {
        // res will contain array of all users
        if (err) return done(err);
        // assume there are a 100 users in the database
        res.body.myProducts.should.have.lengthOf(3);
      });
  });
});
