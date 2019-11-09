/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 3000;
const cartURL = `http://${host}:${port}/cart`; // URL for GraphQL API Gateway
const requestCart = require("supertest")(cartURL);

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
    catch(err)  {
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

  it("locks and unlocks correctly", async () => {
    // Add a product
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Lock the cart
    await requestCart.put(`/${cartId}/lock`).expect(200);

    // Get the locked status
    let isLocked = await requestCart.get(`/${cartId}/lock`).expect(200);
    expect(isLocked.body.data.locked).to.equal(true);

    // Unlock the cart
    await requestCart.delete(`/${cartId}/lock`).expect(200);

    // Get the locked status
    isLocked = await requestCart.get(`/${cartId}/lock`).expect(200);
    expect(isLocked.body.data.locked).to.equal(false);
  })


  it("can start and end a checkout", async () => {
    // Add a product
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Begin checkout
    await requestCart.put(`/${cartId}/checkout`).expect(200);

    // Cart should be locked
    let isLocked = await requestCart.get(`/${cartId}/lock`).expect(200);
    expect(isLocked.body.data.locked).to.equal(true);

    // End checkout
    await requestCart.delete(`/${cartId}/checkout`).expect(200);

    // Cart should be unlocked
    isLocked = await requestCart.get(`/${cartId}/lock`).expect(200);
    expect(isLocked.body.data.locked).to.equal(false);
  })

  it("does not allow checking out a cart that's being checked out", async () => {
    // Add a product
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Begin checkout
    await requestCart.put(`/${cartId}/checkout`).expect(200);

    // Don't allow a second checkout
    await requestCart.put(`/${cartId}/checkout`).expect(403);
  })


  it("can't end a checkout if there is none", async () => {
    // Add a product
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Can't end a nonexisting checkout process
    await requestCart.delete(`/${cartId}/checkout`).expect(400);
  })


  // Check API error handling
  it ("does not modify a locked cart", async () => {
    // Add a product
    let product2 = {
      "pid": 2,
      "amount_in_cart": 5
    }
    await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Lock the cart
    await requestCart.put(`/${cartId}/lock`).expect(200);

    // Adding a product should fail
    await requestCart.post(`/${cartId}`).send(product2).expect(403);

    // Unlock the cart
    await requestCart.delete(`/${cartId}/lock`).expect(200);

    // Now the product should be added
    await requestCart.post(`/${cartId}`).send(product2).expect(201);
  })

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
    for (let user of sample_users) {
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
