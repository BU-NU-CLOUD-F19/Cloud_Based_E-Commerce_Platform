/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 4050;
const storesURL = `http://${host}:${port}/stores`; // URL for GraphQL API Gateway
const storesAPI = require("supertest")(storesURL);

describe("Stores REST API", () => {
  let store, sampleStores;

  const storeId = "store1";
  // Utility function to initialize data
  async function loadSampleData() {
    // Set up test data
    sampleStores = [
      {
        "id": storeId,
        "name": "Dummy store",
        "address": "dummy street 11",
        "phone": "9999999988",
        "email": "support@dummystore.com",
        "date_created": null
      }
    ];

    // Create the records in the database
    console.log(`Inserting sample records`);
    await store.deleteAll(); // Clear out the existing data

    await store.repository.knex('stores').insert(sampleStores);
  }

  async function initModels() {
    try {
      await require('../src/configs/config');

      // Set up all the required constants
      const { Stores } = require('../src/models');

      return { store: new Stores() };
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
    });
  });

  // Before each test, clear out the cart data
  beforeEach(async function beforeEach() {
    // Load the sample data into the database
    await loadSampleData();
  });

  // Test API functionality
  it("get store by id", async () => {
    // Check if product listing is possible
    const res = await storesAPI.get(`/${storeId}`).expect(200);
    expect(res.body.data).to.eql(sampleStores);
  });

  it("creates a store", async () => {
    const newStoreData = {
      "name": "New Store",
      "address": "new street 11",
      "phone": "2222222222",
      "email": "support@dummystore.com"
    };

    // Add it to the cart, and check response
    let res = await storesAPI.post('').send(newStoreData).expect(201);
    delete res.body.data[0].id;
    delete res.body.data[0].date_created;
    expect(res.body.data[0]).to.eql(newStoreData);
  });

  it("removes a store", async () => {
    // Remove it from the cart
    await storesAPI.delete(`/${storeId}`).expect(200);

    // List the products, expecting none to be present
    const res = await storesAPI.get(`/${storeId}`).expect(200);
    expect(res.body.data).to.eql([]);
  });

  it("update a store", async () => {
    // Change the product
    await storesAPI.patch(`/${storeId}`).send({ phone: "2222222222" }).expect(200);

    // Check that the amount has been updated
    const res = await storesAPI.get(`/${storeId}`).expect(200);
    expect(res.body.data[0].phone).to.eql("2222222222");
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
    await store.repository.knex.destroy();

    console.log("Test finished.");
  });

});
