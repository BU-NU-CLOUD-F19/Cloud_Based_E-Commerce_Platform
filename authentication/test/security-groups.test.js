/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 3000;
const baseURL = `http://${host}:${port}/`; // URL for GraphQL API Gateway
const requestBaseURL = require("supertest")(baseURL);

describe("Cart REST API", () => {
  let users, stores, memberships, sampleStores, sampleUsers, sampleSecurityGroups;

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

  // Test API functionality
  it("get memberships", async () => {
    // Check if product listing is possible
    const res = await memberships.get(`/${cartId}`).expect(200)
    expect(res.body.data).to.eql([]);
  });

  it("adds a product to a cart", async () => {
    // Add it to the cart, and check response
    let res = await requestCart.post(`/${cartId}`).send(product).expect(201)
    expect(res.body.data).to.eql([product])

    res = await requestCart.get(`/${cartId}`).expect(200)
    expect(res.body.data).to.eql([product]);
  });

  it("removes a product from a cart", async () => {
    // Add it to the cart
    await requestCart.post(`/${cartId}`).send(product).expect(201)

    // Remove it from the cart
    await requestCart.put(`/${cartId}/remove`).send({ pid: product.pid }).expect(200)


    // List the products, expecting none to be present
    const res = await requestCart.get(`/${cartId}`).expect(200)
    expect(res.body.data).to.eql([]);
  });

  it("responds to an empty-cart request", async () => {
    // Insert a few products into the cart
    for (let i = 1; i <= 2; i++) {
      await requestCart.post(`/${cartId}`).send({ pid: i, amount_in_cart: i }).expect(201);
    }

    // Check that the cart contains 3 products
    let res = await requestCart.get(`/${cartId}`).expect(200);
    expect(res.body.data.length).to.eql(2)

    // Empty the cart
    res = await requestCart.put(`/${cartId}/empty`).expect(200);
    expect(res.body.data).to.eql(2);  // rows deleted

    // Check that the cart is empty
    res = await requestCart.get(`/${cartId}`).expect(200);
    expect(res.body.data).to.eql([])
  })

  it("responds to a change request", async () => {
    // Define a new product
    let new_product = {
      pid: product.pid,
      amount_in_cart: product.amount_in_cart+5
    }

    // Add a product
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Change the product
    await requestCart.put(`/${cartId}`).send(new_product).expect(200);

    // Check that the amount has been updated
    const res = await requestCart.get(`/${cartId}`).expect(200)
    expect(res.body.data[0].amount_in_cart).to.eql(new_product.amount_in_cart)
  });

  it("responds to a delete request", async () => {
    // Add a product
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Delete the cart
    await requestCart.delete(`/${cartId}`).expect(200);

    // Check that the product is gone
    const res = await requestCart.get(`/${cartId}`).expect(200);
    expect(res.body.data).to.eql([]);
  })

  // Check API error handling
  it("Rejects a malformed remove request", async () => {
    await requestCart.put(`/${cartId}/remove`).expect(400)
  });

  it("Rejects a malformed add request", async () => {
    await requestCart.post(`/${cartId}`).expect(400)
  });

  it("Rejects a malformed change request", async () => {
    await requestCart.put(`/${cartId}`).expect(400)
  });

  // Clean up after all tests are done
  after(async function after() {
    // Remove carts and products in cart
    await cart.deleteAll();
    await productsInCart.deleteAll();

    // Remove the sample data created in before()
    console.log("Removing sample data");
    for (let user of sampleUsers) {
      await cart.repository.knex('users').where({uid: user.uid}).del();
    }
    for (let prod of sample_products) {
      await cart.repository.knex('products').where({pid: prod.pid}).del();
    }

    // Close the knex connection
    cart.repository.knex.destroy();
    productsInCart.repository.knex.destroy();

    console.log("Test finished.");
  })

})
