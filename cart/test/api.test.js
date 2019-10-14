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

    await cart.repository.knex('products').insert(sample_products);
    await cart.repository.knex('users').insert(sample_users);
  }
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

  beforeEach(async function beforeEach() {
    await cart.deleteAll();
  })

  after(async function after() {
    await cart.deleteAll();

    // Remove the sample data created in before()
    logger.debug("Removing sample data");
    for (let user of sample_users) {
      await cart.repository.knex('users').where({uid: user.uid}).del();
    }
    for (let product of sample_products) {
      await cart.repository.knex('products').where({pid: product.pid}).del();
    }

    logger.debug("Test finished.");
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
    for (let i = 1; i <= 3; i++) {
      await requestCart.post(`/${cartid}`).send({ pid: i, amount_in_cart: i }).expect(201);
    }

    // Check that the cart contains 3 products
    let res = await requestCart.get(`/${cartid}`).expect(200);
    expect(res.body.data.length).to.eql(3)

    // Empty the cart
    res = await requestCart.put(`/${cartid}/empty`).expect(200);
    expect(res.body.data).to.eql([]);

    // Check that the cart is empty
    res = await requestCart.get(`/${cartid}`).expect(200);
    expect(res.body.data).to.eql([])
  })

  it("responds to a change request", async () => {
    // Define a new product
    let new_product = {
      pid: 1,
      amount_in_cart: 2
    }

    // Add a product
    await requestCart.post(`/${cartid}`).send(product).expect(201);

    // Change the product
    await requestCart.put(`/${cartid}`).send(new_product).expect(200);

    // Check that the amount has been updated
    const res = await requestCart.get(`/${cartid}`).expect(200)
    expect(res.body.data[0].amount_in_cart).to.eql(3)
  });

  it("responds to a delete request", async () => {
    // Add a product
    await requestCart.post(`/${cartid}`).send(product).expect(201);

    // Delete it
    await requestCart.delete(`/${cartid}`).expect(200);

    // Check that the product is gone
    const res = await requestCart.get(`${cartid}`).expect(200);
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
})
