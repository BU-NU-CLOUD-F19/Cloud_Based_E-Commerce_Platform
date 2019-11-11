/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 3000;
const storesURL = `http://${host}:${port}/stores`; // URL for GraphQL API Gateway
const storesAPI = require("supertest")(storesURL);

describe("Cart REST API", () => {
  let store, sampleStores;

  // Utility function to initialize data
  async function loadSampleData() {
    // Set up test data
    sampleStores = [
      {
        "name": "Dummy store",
        "address": "dummy street 11",
        "phone": 999999998,
        "email": "support@dummystore.com"
      }
    ]

    // Create the records in the database
    console.log(`Inserting sample records`);
    await store.deleteAll(); // Clear out the existing data

    await store.createStore(sampleStores);
  }

  async function initModels() {
    try {
      await require('../src/configs/config');

      // Set up all the required constants
      const { Stores } = require('../src/models');

      return { store: new Stores() }
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

      store = objs.store;
      // Log the start of the test
      console.log(`Starting test at ${new Date().toLocaleString()}`);

      // Load the sample data into the database
      loadSampleData();
    })
  })

  // Before each test, clear out the cart data
  beforeEach(async function beforeEach() {
    await store.deleteAll();
  })

  // Test API functionality
  it("get store by id", async () => {
    // Check if product listing is possible
    const res = await storesAPI.get(`/${storeId}`).expect(200)
    expect(res.body.data).to.eql([]);
  });

  it("creates a store", async () => {
    // Add it to the cart, and check response
    let res = await storesAPI.post('').send(sampleStores[0]).expect(201)
    const { id } = res.body.data[0];
    delete res.body.data[0].id;
    expect(res.body.data).to.eql(sampleStores[0]);

    res = await storesAPI.get(`/${id}`).expect(200);
    delete res.body.data[0].id;
    expect(res.body.data).to.eql(sampleStores[0]);
  });

  it("removes a store", async () => {
    // Add it to the cart
    const storeRes = await storesAPI.post('').send(sampleStores[0]).expect(201);

    const { id } = storeRes.body.data[0];
    // Remove it from the cart
    await storeRes.delete(`/${id}`).expect(200);


    // List the products, expecting none to be present
    const res = await storeRes.get(`/${id}`).expect(200)
    expect(res.body.data).to.eql([]);
  });

  it("update a store", async () => {
    // Define a new product

    // Add a product
    const storeRes = await storesAPI.post('').send(sampleStores[0]).expect(201);

    const { id } = storeRes.body.data[0];

    // Change the product
    await storesAPI.patch(`/${id}`).send({ phone: 222222222 }).expect(200);

    // Check that the amount has been updated
    const res = await storesAPI.get(`/${id}`).expect(200)
    expect(res.body.data[0].phone).to.eql(222222222)
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
    // Remove stores
    await store.deleteAll();

    // Close the knex connection
    store.repository.knex.destroy();

    console.log("Test finished.");
  })

})
