/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 4050;
const baseURL = `http://${host}:${port}/memberships`; // URL for GraphQL API Gateway
const membershipsAPI = require("supertest")(baseURL);

describe("Memberships REST API", () => {
  let users, stores, memberships, sampleStores, sampleUsers, sampleMemberships;
  const userId = "user1", storeId = "store1";

  // Utility function to initialize data
  async function loadSampleData() {
    // Set up test data
    sampleUsers = [
      {
        "uid": userId,
        "fname": "John",
        "lname": "Doe",
        "address": "Some Street 22",
        "phone": "1111111111",
        "email": "john@doe.com"
      }
    ];

    sampleStores = [
      {
        "id": storeId,
        "name": "Dummy store",
        "address": "dummy street 11",
        "phone": "9999999998",
        "email": "support@dummystore.com",
        "date_created": null
      }
    ];

    sampleMemberships = [
      {
        userId,
        storeId,
        subscriptionStatus: true,
      }
    ];

    // Create the records in the database
    console.log(`Inserting sample records`);
    await users.deleteAll(); // Clear out the existing data
    await stores.deleteAll(); // Clear out the existing data
    await memberships.deleteAll(); // Clear out the existing data

    // Kind of a hack to access the other tables, replace this with models eventually
    await users.repository.knex('users').insert(sampleUsers);
    await stores.repository.knex('stores').insert(sampleStores);
  }

  async function initModels() {
    try {
      await require('../src/configs/config');

      // Set up all the required constants
      const { Users, Stores, Memberships } = require('../src/models');

      return { users: new Users(), stores: new Stores(), memberships: new Memberships() };
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
      stores = objs.stores;
      memberships = objs.memberships;

      // Log the start of the test
      console.log(`Starting test at ${new Date().toLocaleString()}`);
    });
  });

  // Before each test, clear out the cart data
  beforeEach(async function beforeEach() {
    // Load the sample data into the database
    await loadSampleData();
  });

  it("create and get a membership", async () => {

    const expectedOutput = [
      {
        user_id: userId,
        store_id: storeId,
        subscription_status: true
      }
    ];

    // create a membership for the user in the store
    await membershipsAPI.post('').send(sampleMemberships[0]).expect(201);
    
    const res = await membershipsAPI.get(`/${userId}/${storeId}`).expect(200);
    delete res.body.data[0].id;
    delete res.body.data[0].date_created;
    expect(res.body.data).to.eql(expectedOutput);
  });

  it("delete a membership", async () => {
    // create a membership for the user in the store
    await membershipsAPI.post('').send(sampleMemberships[0]).expect(201);
    
    const res = await membershipsAPI.delete(`/${userId}/${storeId}`).expect(200);
    expect(res.body.data).to.eql(1);
  });


  it("update subscription", async () => {
    // create a membership for the user in the store
    const membershipRes = await membershipsAPI.post('').send(sampleMemberships[0]).expect(201);

    const { id } = membershipRes.body.data[0];

    // Update the subscription
    const res = await membershipsAPI.patch(`/${id}`).send({ subscriptionStatus: false}).expect(200);
    expect(res.body.data).to.eql(1);
  });

  // // Check API error handling
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
    await stores.deleteAll();
    await memberships.deleteAll();

    // Close the knex connection
    users.repository.knex.destroy();
    stores.repository.knex.destroy();
    memberships.repository.knex.destroy();

    console.log("Test finished.");
  });

});
