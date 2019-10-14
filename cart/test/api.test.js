/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 3000;
const cartURL = `http://${host}:${port}/cart`; // URL for GraphQL API Gateway
const requestCart = require("supertest")(cartURL);
const Pg = require('../src/repository');
const Cart = require('../src/models').Model;
const logger = require('../src/utils/logger');
const RcProvider = require('kibbutz-rc');
const Kibbutz = require('kibbutz');

describe("Cart REST API", () => {
  let product, cartid, cart, sample_products, sample_users;

  // Utility function to initialize data
  async function loadSampleData() {
    // Set up test data
    sample_users = [
      {
        "uid": "user1",
        "fname": "John",
        "lname": "Doe",
        "address": "Some Street 22",
        "phone": 1231231231,
        "email": "john@doe.com"
      }
    ]

    sample_products = [
      {
        "pid": 1,
        "pcode": "ABC123",
        "price": 42.5,
        "sku": "XYZ",
        "amount_in_stock": 10,
        "pname": "Something",
        "description": "This is something very interesting that you want to buy.",
        "lang": "en_US"
      },
      {
        "pid": 2,
        "pcode": "FD2",
        "price": 99.99,
        "sku": "QWOP",
        "amount_in_stock": 100,
        "pname": "Speedos",
        "description": "I'm too lazy to write a description",
        "lang": "en_US"
      }
    ]

    // Create the records in the database
    logger.debug(`Inserting sample records`);

    await cart.deleteAll();
    await cart.repository.knex('products').insert(sample_products);
    await cart.repository.knex('users').insert(sample_users);
  }

  // Set up the connection and sample data
  before(function before() {
    // Set up the required config
    const pkg = require('../package');
    const rcLoader = new RcProvider({
      appName: pkg.config.appName
    });

    const config = new Kibbutz();
    config.load([rcLoader], (err, conf) => {

      const {
        connection
      } = conf.persistence.postgres;

      let knexInstance = require('knex')({
        client: 'pg',
        connection
      });
      let repoOpts = {knex: knexInstance, resource: 'products_in_cart', logger: logger};
      let repository = new Pg(repoOpts);
      cart = new Cart({repository: repository});

      logger.debug(`Starting test at ${new Date().toLocaleString()}`);

      loadSampleData();

      // Create a sample product
      product = {
        pid: 1,
        amount_in_cart: 3
      }
      // Choose a sample cart
      cartid = 1;
    })
  });

  // Clear the carts and products in cart before each test
  beforeEach(async function beforeEach() {
    await cart.deleteAll();
  })

  // Functionality
  it("lists products", async () => {
    // Check if product listing is possible
    const res = await requestCart.get(`/${cartid}`).expect(200)
    expect(res.body.data).to.eql([]);
  });

  it("adds a product to a cart", async () => {
    // Add it to the cart, and check response
    let res = await requestCart.post(`/${cartid}`).send(product).expect(201)
    expect(res.body.data).to.eql([product])

    res = await requestCart.get(`/${cartid}`).expect(200)
    expect(res.body.data).to.eql([product]);
  });

  it("removes a product from a cart", async () => {
    // Add it to the cart
    await requestCart.post(`/${cartid}`).send(product).expect(201)

    // Remove it from the cart
    await requestCart.put(`/${cartid}/remove`).send({ pid: product.pid }).expect(200)


    // List the products, expecting none to be present
    const res = await requestCart.get(`/${cartid}`).expect(200)
    expect(res.body.data).to.eql([]);
  });

  it("responds to an empty-cart request", async () => {
    // Insert a few products into the cart
    for (let i = 1; i <= 2; i++) {
      await requestCart.post(`/${cartid}`).send({ pid: i, amount_in_cart: i }).expect(201);
    }

    // Check that the cart contains 3 products
    let res = await requestCart.get(`/${cartid}`).expect(200);
    expect(res.body.data.length).to.eql(2)

    // Empty the cart
    res = await requestCart.put(`/${cartid}/empty`).expect(200);
    expect(res.body.data).to.eql(2);  // rows deleted

    // Check that the cart is empty
    res = await requestCart.get(`/${cartid}`).expect(200);
    expect(res.body.data).to.eql([])
  })

  it("responds to a change request", async () => {
    // Define a new product
    let new_product = {
      pid: product.pid,
      amount_in_cart: product.amount_in_cart+5
    }

    // Add a product
    await requestCart.post(`/${cartid}`).send(product).expect(201);

    // Change the product
    await requestCart.put(`/${cartid}`).send(new_product).expect(200);

    // Check that the amount has been updated
    const res = await requestCart.get(`/${cartid}`).expect(200)
    expect(res.body.data[0].amount_in_cart).to.eql(new_product.amount_in_cart)
  });

  it("responds to a delete request", async () => {
    // Add a product
    await requestCart.post(`/${cartid}`).send(product).expect(201);

    // Delete the cart
    await requestCart.delete(`/${cartid}`).expect(200);

    // Check that the product is gone
    const res = await requestCart.get(`/${cartid}`).expect(200);
    expect(res.body.data).to.eql([]);
  })

  // Error handling
  it("Rejects a malformed remove request", async () => {
    await requestCart.put(`/${cartid}/remove`).expect(400)
  });

  it("Rejects a malformed add request", async () => {
    await requestCart.post(`/${cartid}`).expect(400)
  });

  it("Rejects a malformed change request", async () => {
    await requestCart.put(`/${cartid}`).expect(400)
  });


  // Clean up after all tests
  after(async function after() {
    // Remove carts and products in cart
    await cart.deleteAll();

    // Remove the sample data created in before()
    logger.debug("Removing sample data");
    for (let user of sample_users) {
      await cart.repository.knex('users').where({uid: user.uid}).del();
    }
    for (let prod of sample_products) {
      await cart.repository.knex('products').where({pid: prod.pid}).del();
    }

    // Close the knex connection
    cart.repository.knex.destroy();

    logger.debug("Test finished.");
  })

})
