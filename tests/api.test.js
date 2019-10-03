/**
 * The file contains tests for the GraphQL API Gateway and the REST API of the members microservice
 * It tests both the servers using Mocha, Chai and SuperTest
 */

const chai = require("chai");
const { expect } = chai;

const urlGateway = `http://localhost:3050/`; // URL for GraphQL API Gateway
const requestGateway = require("supertest")(urlGateway);

// Tests for GraphQL API Gateway
describe("GraphQL API", () => {
  // Makes a request to get a member with a specific ID
  it("Returns member with ID == 1", done => {
    requestGateway
      .post("")
      .send({ query: "{ member(id: 1) { id name } }" })
      .expect(200)
      .end((err, res) => {
        if (err) {return done(err);}
        expect(res.body.data.member).to.have.property("name");
        expect(res.body.data.member.name).to.equal("Alex");
        return done();
      });
  });
});

const urlMembersAPI = `http://localhost:3000/`; // URL for GraphQL API Gateway
const requestMembersAPI = require("supertest")(urlMembersAPI);

describe("Members REST API", () => {
  it("Returns member with ID == 1", done => {
    const id = 1;
    requestMembersAPI
      .get(`demo/${id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {return done(err);}
        expect(res.body[0]).to.have.property("name");
        expect(res.body[0].name).to.equal("Alex");
        return done();
      });
  });
});
