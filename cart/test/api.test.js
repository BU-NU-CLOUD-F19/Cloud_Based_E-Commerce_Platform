/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;

const cartHost = `${process.env.CART_HOST}` || "localhost";
const cartPort = `${process.env.CART_PORT}` || "3000";
const cartUrl = `http://${cartHost}:${cartPort}/cart`; // URL for cart service
const requestCart = require("supertest")(cartUrl);


const gatewayHost = `${process.env.API_GW_HOST}` || "localhost";
const gatewayPort = `${process.env.API_GW_PORT}` || "3050";
const urlGateway = `http://${gatewayHost}:${gatewayPort}/`; // URL for GraphQL API Gateway
const requestGateway = require("supertest")(urlGateway);

describe("Cart REST API", () => {
  let product, cartId, cart, productsInCart, sample_products, sample_users;

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

    // Create the records in the database
    console.log(`Inserting sample records`);
    await cart.deleteAll(); // Clear out the existing data
    await productsInCart.deleteAll(); // Clear out the existing data

    // Kind of a hack to access the other tables, replace this with models eventually
    await cart.repository.knex('products').insert(sample_products);
    await cart.repository.knex('users').insert(sample_users);
  }

  async function initModels() {
    try {
      await require('../src/configs/config');

      // Set up all the required constants
      const { ProductsInCart, Cart } = require('../src/models/');

      return { cart: new Cart(), productsInCart: new ProductsInCart() }
    }
    catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  // Runs before all tests
  before(function before() {

    // Load the config and wait for it to load
    initModels().then(objs => {

      cart = objs.cart;
      productsInCart = objs.productsInCart

      // Log the start of the test
      console.log(`Starting test at ${new Date().toLocaleString()}`);

      // Load the sample data into the database
      loadSampleData();

      // Define a sample reference to a product for later use
      product = {
        pid: 1,
        amount_in_cart: 3
      }
      // Choose a sample cart id
      cartId = 1;
    })
  })

  // Before each test, clear out the cart data
  beforeEach(async function beforeEach() {
    await cart.deleteAll();
    await productsInCart.deleteAll();
  })

  // Test API functionality
  it("lists products", async () => {
    // Check if product listing is possible
    const res = await requestCart.get(`/${cartId}`).expect(200)
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
      amount_in_cart: product.amount_in_cart + 5
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

  // Tests for API Gateway

  it("Gateway lists products in cart", async () => {
    // Add a product
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    const res = await requestGateway.post('')
      .send({ query: `{ getProducts(id: ${cartId}){ message, data{ pid, amount_in_cart } }}` }).expect(200);

    expect(res.body.data.getProducts).to.have.property("message");
    expect(res.body.data.getProducts.data[0]).to.have.property("pid");
    expect(res.body.data.getProducts.data[0].pid).to.equal(1);
    expect(res.body.data.getProducts.data[0]).to.have.property("amount_in_cart");
  });

  it("Gateway adds a product to the cart", async () => {
    // Add a product with pid = 1 and amount = 1
    const res = await requestGateway.post('').send({
      query: `mutation {
      addProductToCart(id: ${cartId}, input: {
        pid: 1,
        amount_in_cart: 1
      }){
        message,
        data {
          pid,
          amount_in_cart
        }
      }
    }` }).expect(200);

    expect(res.body.data.addProductToCart).to.have.property("message");
    expect(res.body.data.addProductToCart).to.have.property("data");
    expect(res.body.data.addProductToCart.data[0].pid).to.equal(1);
    expect(res.body.data.addProductToCart.data[0].amount_in_cart).to.equal(1);
  });

  it("Gateway removes a product from the cart", async () => {
    // Add a product to then remove from cart
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    const res = await requestGateway.post('').send({
      query: `mutation {
      removeProduct(id: ${cartId}, input: {
        pid: 1
      }){
        message,
        data 
      }
    }` }).expect(200);

    expect(res.body.data.removeProduct.message).to.equal("Product removed from cart.");
    expect(res.body.data.removeProduct.data).to.equal(1);
  });

  it("Gateway responds to an empty-cart request", async () => {
    // Add a product 
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Empty the cart
    const res = await requestGateway.post('').send({
      query: `mutation {
      emptyCart(id: ${cartId}){
        message,
        data 
      }
    }` }).expect(200);

    expect(res.body.data.emptyCart.message).to.equal("Cart emptied.");
    expect(res.body.data.emptyCart.data).to.equal(1);
  });

  it("Gateway responds to a change request", async () => {
    // Add a product
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Change the amount of the product in cart
    const res = await requestGateway.post('').send({
      query: `mutation {
      changeAmount(id: ${cartId}, input: {
        pid: 1,
        amount_in_cart: 3
      }){
        message,
        data {
          pid,
          amount_in_cart
        }
      }
    }` }).expect(200);

    expect(res.body.data.changeAmount.message).to.equal("Amount updated.");
    expect(res.body.data.changeAmount.data[0].amount_in_cart).to.equal(3);
  });

  it("Gateway rejects a malformed remove request", async () => {
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Send a remove request with the id of the product
    const res = await requestGateway.post('').send({
      query: `mutation {
      removeProduct(id: ${cartId}){
        message,
        data 
      }
    }` });
    expect(res.body).to.have.property("errors");
  });

  it("Gateway rejects a malformed add request", async () => {
    // Send an add request with the information of the product
    const res = await requestGateway.post('').send({
      query: `mutation {
      addProductToCart(id: ${cartId}){
        message,
        data {
          pid,
          amount_in_cart
        }
      }
    }` });
    expect(res.body).to.have.property("errors");
  });

  it("Gateway rejects a malformed change request", async () => {
    // Send a change request with the information of the product
    const res = await requestGateway.post('').send({
      query: `mutation {
      changeAmount(id: ${cartId}){
        message,
        data {
          pid,
          amount_in_cart
        }
      }
    }` });
    expect(res.body).to.have.property("errors");
  });

  it("gateway responds to a delete request", async () => {
    // Add a product to the cart
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Delete the cart
    const res = await requestGateway.post('').send({
      query: `mutation {
      deleteCart(id: ${cartId}){
        message
      }
    }` }).expect(200);

    expect(res.body.data.deleteCart.message).to.equal("Cart deleted.");
  });

  // Clean up after all tests are done
  after(async function after() {
    // Remove carts and products in cart
    // await cart.deleteAll();
    await productsInCart.deleteAll();

    // Remove the sample data created in before()
    console.log("Removing sample data");
    // for (let user of sample_users) {
    //   await cart.repository.knex('users').where({ uid: user.uid }).del();
    // }
    for (let prod of sample_products) {
      await cart.repository.knex('products').where({ pid: prod.pid }).del();
    }

    // Close the knex connection
    cart.repository.knex.destroy();
    productsInCart.repository.knex.destroy();

    console.log("Test finished.");
  })

})
