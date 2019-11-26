/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 4050;
const usersURL = `http://${host}:${port}/users`;
const usersAPI = require("supertest")(usersURL);

describe("Users REST API", () => {
  let users;

    // Set up test data
  const sampleUsers = [
      {
        "fname": "John",
        "lname": "Doe",
        "address": "Some Street 22",
        "phone": "1111111111",
        "email": "john@doe.com"
      }
    ];

  async function initModels() {
    try {
      await require('../src/configs/config');

      // Set up all the required constants
      const { Users } = require('../src/models');

      return { users: new Users() };
    }
    catch(err)  {
      console.log(err.message);
      throw err;
    }
  }

  // Runs before all tests
  before(function before() {

    // Load the config and wait for it to load
    initModels().then(objs => {

      users = objs.users;

      // Log the start of the test
      console.log(`Starting test at ${new Date().toLocaleString()}`);

    });
  });

  // Before each test, clear out the cart data
  beforeEach(async function beforeEach() {
    await users.deleteAll();    
  });

  // Test API functionality
  it("lists users by id and email", async () => {
    const userRes = await usersAPI.post('').send(sampleUsers[0]).expect(201);
    const { uid: userId } = userRes.body.data[0];
    // get users
    let res = await usersAPI.get(`/${userId}`).expect(200);
    delete res.body.data[0].uid;
    delete res.body.data[0].date_created;
    expect(res.body.data).to.eql(sampleUsers);

    // get users by email
    res = await usersAPI.get(`/byEmail/${sampleUsers[0].email}`).expect(200);
    delete res.body.data[0].uid;
    delete res.body.data[0].date_created;
    expect(res.body.data).to.eql(sampleUsers);
  });

  it("create a user", async () => {
    // creates a user
    let res = await usersAPI.post('').send(sampleUsers[0]).expect(201);
    delete res.body.data[0].uid;
    delete res.body.data[0].date_created;
    expect(res.body.data).to.eql(sampleUsers);
  });
  
  it("removes a user", async () => {
    // Add a user
    const userRes = await usersAPI.post('').send(sampleUsers[0]).expect(201);

    const { uid } = userRes.body.data[0];
    // Remove that user
    await usersAPI.delete(`/${uid}`).expect(200);


    // List the products, expecting none to be present
    const res = await usersAPI.get(`/${uid}`).expect(200);
    expect(res.body.data).to.eql([]);
  });

  it("update a user", async () => {
    const userRes = await usersAPI.post('').send(sampleUsers[0]).expect(201);

    const { uid: userId } = userRes.body.data[0];

    const patchData = {
      fname: "Jonathan"
    };

    // Update a user
    const res = await usersAPI.patch(`/${userId}`).send(patchData).expect(200);
    expect(res.body.data).to.eql(1);
  });

  // Check API error handling
  // it("Rejects a malformed remove request", async () => {
  //   await requestCart.put(`/${cartId}/remove`).expect(400)
  // });

  // it("Rejects a malformed add request", async () => {
  //   await requestCart.post(`/${cartId}`).expect(400)
  // });

  // it("Rejects a malformed change request", async () => {
  //   await requestCart.put(`/${cartId}`).expect(400)
  // });

  // Clean up after all tests are done
  after(async function after() {
    // Remove carts and products in cart
    await users.deleteAll();
    
    // Close the knex connection
    await users.repository.knex.destroy();
    

    console.log("Test finished.");
  });

});
