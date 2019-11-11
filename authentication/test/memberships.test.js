/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 3000;
const baseURL = `http://${host}:${port}/`; // URL for GraphQL API Gateway
const membershipsAPI = require("supertest")(baseURL+'memberships');
const usersAPI = require("supertest")(baseURL+'users');
const storesAPI = require("supertest")(baseURL+'stores');

describe("Cart REST API", () => {
  let users, stores, memberships, sampleStores, sampleUsers, sampleMemberships;

  // Utility function to initialize data
  async function loadSampleData() {
    // Set up test data
    sampleUsers = [
      {
        "uid": "user1",
        "fname": "John",
        "lname": "Doe",
        "address": "Some Street 22",
        "phone": 1111111111,
        "email": "john@doe.com"
      }
    ]

    sampleStores = [
      {
        "name": "Dummy store",
        "address": "dummy street 11",
        "phone": 999999998,
        "email": "support@dummystore.com"
      }
    ]

    sampleMemberships = [
      {
        subscriptionStatus: true,
      }
    ];

    // Create the records in the database
    console.log(`Inserting sample records`);
    await users.deleteAll(); // Clear out the existing data
    await stores.deleteAll(); // Clear out the existing data
    await memberships.deleteAll(); // Clear out the existing data

    // Kind of a hack to access the other tables, replace this with models eventually
    await users.createUser(sampleUsers[0]);
    await stores.createStore(sampleStores[0]);
  }

  async function initModels() {
    try {
      await require('../src/configs/config');

      // Set up all the required constants
      const { Users, Stores, Memberships } = require('../src/models');

      return { users: new Users(), stores: new Stores(), memberships: new Memberships() }
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

      // Load the sample data into the database
      loadSampleData();
    })
  })

  // Before each test, clear out the cart data
  beforeEach(async function beforeEach() {
    await stores.deleteAll();
    await users.deleteAll();
    await memberships.deleteAll();
  })

  it("create and get a membership", async () => {
    // create store
    const storeRes = await storesAPI.post('').send(sampleStores[0]).expect(201);
    const { id: storeId } = storeRes.body.data[0];

    // create store
    const userRes = await usersAPI.post('').send(sampleUsers[0]).expect(201);
    const { id: userId } = userRes.body.data[0];


    sampleMemberships[0].userId = userId;
    sampleMemberships[0].storeId = storeId;
    // create a membership for the user in the store
    let res = await memberships.post('').send(sampleMemberships).expect(201)
    expect(res.body.data).to.eql(sampleMemberships)

    res = await memberships.get(`/${userId}/${storeId}`).expect(200)
    expect(res.body.data).to.eql(sampleMemberships);
  });

  it("delete a membership", async () => {
    const storeRes = await storesAPI.post('').send(sampleStores[0]).expect(201);
    const { id: storeId } = storeRes.body.data[0];

    // create store
    const userRes = await usersAPI.post('').send(sampleUsers[0]).expect(201);
    const { id: userId } = userRes.body.data[0];


    sampleMemberships[0].userId = userId;
    sampleMemberships[0].storeId = storeId;
    // create a membership for the user in the store
    let res = await memberships.post('').send(sampleMemberships).expect(201)
    expect(res.body.data).to.eql(sampleMemberships)

    res = await memberships.delete(`/${userId}/${storeId}`).expect(201);
  });


  it("update subscription", async () => {
    const storeRes = await storesAPI.post('').send(sampleStores[0]).expect(201);
    const { id: storeId } = storeRes.body.data[0];

    // create store
    const userRes = await usersAPI.post('').send(sampleUsers[0]).expect(201);
    const { id: userId } = userRes.body.data[0];


    sampleMemberships[0].userId = userId;
    sampleMemberships[0].storeId = storeId;
    // create a membership for the user in the store
    const membershipRes = await memberships.post('').send(sampleMemberships).expect(201);

    const { id } = membershipRes.body.data[0];

    // Update the subscription
    const res = await membershipsAPI.patch(`/${id}`).send({ subscriptionStatus: false}).expect(200);
    expect(res.body.data[0].subscriptionStatus).to.eql(false);
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
  })

})
