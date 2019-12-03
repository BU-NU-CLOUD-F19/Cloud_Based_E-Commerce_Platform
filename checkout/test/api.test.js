/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;

const cartUrl = `http://${process.env.CART_HOST}:${process.env.CART_PORT}/cart`;
const inventoryUrl = `http://${process.env.INVENTORY_HOST}:${process.env.INVENTORY_PORT}/inventory`;
const requestInv = require("supertest")(inventoryUrl);
const requestCart = require("supertest")(cartUrl);

const checkoutUrl = `http://${process.env.CHECKOUT_HOST}:${process.env.CHECKOUT_PORT}/checkout`;
const requestCheckout = require("supertest")(checkoutUrl);

describe("Checkout REST API", () => {
  let orders, sample_users, sample_products, sample_guest_cart;
  let guestId;

  // Utility function to initialize data
  async function loadSampleData() {
    // Set up test data
    sample_users = [
      {
        "uid": "user1",
        "fname": "John",
        "lname": "Doe",
        "address": "Some Street 22",
        "phone": 1111111111,
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

    sample_guest_cart = {
      "cartId": 1,
      "products": [
        {
          "pid": 1,
          "amount_in_cart": 7
        },
        {
          "pid": 2,
          "amount_in_cart": 50
        }
      ]
    }

    sample_reg_cart = {
      "cartId": 7,
      "products": [
        {
          "pid": 2,
          "amount_in_cart": 1
        },
        {
          "pid": 1,
          "amount_in_cart": 1
        }
      ]
    }

    // Create the records in the database
    console.log(`Inserting sample records`);

    // Kind of a hack to access the other tables, replace this with models eventually
    console.log(`\tCreating users...`);
    await orders.repository.knex('users').insert(sample_users);

  }

  async function initModels() {
    try {
      await require('../src/configs/config');

      // Set up all the required constants
      const { Orders } = require('../src/models/');

      return { orders: new Orders() };
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

      orders = objs.orders;

      // Log the start of the test
      console.log(`Starting test at ${new Date().toLocaleString()}`);

      // Load the sample data into the database
      loadSampleData();
    })
  })

  // Before each test, clear out the cart data
  beforeEach(async function beforeEach() {
    console.log(`Setting up test data`)
    console.log(`\tClearing previous inventory and cart...`);
    await requestCart.delete(`/${sample_guest_cart.cartId}/lock`).query({ sid: guestId });
    await requestCart.delete(`/${sample_guest_cart.cartId}`).query({ sid: guestId });
    await requestCart.delete(`/${sample_reg_cart.cartId}/lock`).query({ uid: sample_users[0].uid });
    await requestCart.delete(`/${sample_reg_cart.cartId}`).query({ uid: sample_users[0].uid });

    console.log(`\tClearing orders...`);
    await orders.repository.knex.raw("truncate table orders cascade");

    for (let prod of sample_products) {
      await requestInv.delete(`/${prod.pid}`);
    }

    console.log(`\tCreating products...`);
    for (let prod of sample_products) {
      await requestInv.post('').send(prod).expect(201);
    }

    console.log(`\tAdding products to guest cart...`);
    for (let i in sample_guest_cart.products) {
      if (i == 0) {
        let resp = await requestCart.post(`/${sample_guest_cart.cartId}`).send(sample_guest_cart.products[i]).expect(201);
        guestId = resp.body.auth.uid;
      }
      else {
        await requestCart.post(`/${sample_guest_cart.cartId}`)
          .send(sample_guest_cart.products[i]).query({ sid: guestId })
          .expect(201);
      }
    }

    console.log(`\tAdding products to registered user cart...`);
    for (let i in sample_reg_cart.products) {
      await requestCart.post(`/${sample_reg_cart.cartId}`).send(sample_reg_cart.products[i]).query({ uid: sample_users[0].uid }).expect(201);
    }

    console.log(`\tChecking consistency...`);
    const { body: guestBody } = await requestCart.get(`/${sample_guest_cart.cartId}`).query({ sid: guestId }).expect(200);
    expect(guestBody.data.length).to.equal(2);
    const { body: regBody } = await requestCart.get(`/${sample_reg_cart.cartId}`).query({ uid: sample_users[0].uid }).expect(200);
    expect(regBody.data.length).to.equal(2);

  })

  it("guest initiates a checkout", async () => {
    const authDetails = { sid: guestId }
    await requestCheckout.post(`/${sample_guest_cart.cartId}`).send(authDetails).expect(200);
  })

  it("guest completes the checkout flow", async () => {
    const authDetails = { sid: guestId }
    await requestCheckout.post(`/${sample_guest_cart.cartId}`).send(authDetails).expect(200);

    const { body: { data: order} } = await requestCheckout.put(`/${sample_guest_cart.cartId}`).send(authDetails).expect(201);

    expect(order.uid).to.equal(guestId);
    expect(Object.keys(order)).to.eql(["oid", "total_price", "date", "destination", "shipping", "uid"]);
  })

  it("guest aborts a checkout", async () => {
    const authDetails = { sid: guestId };
    await requestCheckout.post(`/${sample_guest_cart.cartId}`).send(authDetails).expect(200);
    requestCheckout.delete(`/${sample_guest_cart.cartId}`).send(authDetails).expect(200);
  })

  it("authd initiates a checkout", async () => {
    const authDetails = { uid: sample_users[0].uid }
    await requestCheckout.post(`/${sample_reg_cart.cartId}`).send(authDetails).expect(200);
  })

  it("authd completes the checkout flow", async () => {
    const authDetails = { uid: guestId }
    await requestCheckout.post(`/${sample_guest_cart.cartId}`).send(authDetails).expect(200);

    const { body: { data: order} } = await requestCheckout.put(`/${sample_guest_cart.cartId}`).send(authDetails).expect(201);

    expect(order.uid).to.equal(guestId);
    expect(Object.keys(order)).to.eql(["oid", "total_price", "date", "destination", "shipping", "uid"]);
  })

  it("authd aborts a checkout", async () => {
    const authDetails = { sid: guestId };
    await requestCheckout.post(`/${sample_guest_cart.cartId}`).send(authDetails).expect(200);
    requestCheckout.delete(`/${sample_guest_cart.cartId}`).send(authDetails).expect(200);
  })

  // Clean up after all tests are done
  after(async function after() {
    // Remove carts and products in cart
    console.log(`Clearing test data...`);
    console.log(`\tDeleting products and carts...`);
    await requestCart.delete(`/${sample_guest_cart.cartId}/lock`).query({ sid: guestId }).expect(200);
    await requestCart.delete(`/${sample_guest_cart.cartId}`).query({ sid: guestId }).expect(200);
    await requestCart.delete(`/${sample_reg_cart.cartId}/lock`).query({ uid: sample_users[0].uid }).expect(200);
    await requestCart.delete(`/${sample_reg_cart.cartId}`).query({ uid: sample_users[0].uid }).expect(200);

    for (let prod of sample_products) {
      await requestInv.delete(`/${prod.pid}`).expect(200);
    }

    // Remove the sample data created in before()
    console.log(`\tDeleting users...`);
    for (let user of sample_users) {
      await orders.repository.knex('users').where({uid: user.uid}).del();
    }

    // Close the knex connection
    orders.repository.knex.destroy();

    console.log("Test finished.");
  })

})
