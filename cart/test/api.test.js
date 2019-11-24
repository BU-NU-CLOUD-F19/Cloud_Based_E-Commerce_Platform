/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const cartURL = `http://${process.env.CART_HOST}:${process.env.CART_PORT}/cart`; // URL for GraphQL API Gateway
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
        "email": "john@doe.com",
        "password": "whatever"
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

  // Authd user
  it("authd: lists products", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };

    // Check if product listing is possible
    const res = await requestCart.get(`/${cartId}`).send(user).expect(200)
    expect(res.body.data).to.eql([]);
  });

  it("authd: adds a product to a cart", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };
    // Add it to the cart, and check response
    let res = await requestCart.post(`/${cartId}`).query(user).send(product).expect(201);
    expect(res.body.data).to.eql([product])

    res = await requestCart.get(`/${cartId}`).query(user).expect(200)
    expect(res.body.data).to.eql([product]);
  });

  it("authd: removes a product from a cart", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };
    // Add it to the cart
    await requestCart.post(`/${cartId}`).query(user).send(product).expect(201)

    // Remove it from the cart
    await requestCart.put(`/${cartId}/remove`).query(user).send({ pid: product.pid }).expect(200)


    // List the products, expecting none to be present
    const res = await requestCart.get(`/${cartId}`).query(user).expect(200)
    expect(res.body.data).to.eql([]);
  });

  it("authd: responds to an empty-cart request", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };
    //
    // Insert a few products into the cart
    for (let i = 1; i <= 2; i++) {
      await requestCart.post(`/${cartId}`).query(user).send({ pid: i, amount_in_cart: i }).expect(201);
    }

    // Check that the cart contains 3 products
    let res = await requestCart.get(`/${cartId}`).query(user).expect(200);
    expect(res.body.data.length).to.eql(2)

    // Empty the cart
    res = await requestCart.put(`/${cartId}/empty`).query(user).expect(200);
    expect(res.body.data).to.eql(2);  // rows deleted

    // Check that the cart is empty
    res = await requestCart.get(`/${cartId}`).query(user).expect(200);
    expect(res.body.data).to.eql([])
  })

  it("authd: responds to a change request", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };

    // Define a new product
    let new_product = {
      pid: product.pid,
      amount_in_cart: product.amount_in_cart+5
    }

    // Add a product
    await requestCart.post(`/${cartId}`).query(user).send(product).expect(201);

    // Change the product
    await requestCart.put(`/${cartId}`).query(user).send(new_product).expect(200);

    // Check that the amount has been updated
    const res = await requestCart.get(`/${cartId}`).query(user).expect(200)
    expect(res.body.data[0].amount_in_cart).to.eql(new_product.amount_in_cart)
  });

  it("authd: responds to a delete request", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };

    // Add a product
    await requestCart.post(`/${cartId}`).query(user).send(product).expect(201);

    // Delete the cart
    await requestCart.delete(`/${cartId}`).query(user).expect(200);

    // Check that the product is gone
    const res = await requestCart.get(`/${cartId}`).query(user).expect(200);
    expect(res.body.data).to.eql([]);
  })

  it("authd: locks and unlocks correctly", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };

    // Add a product
    await requestCart.post(`/${cartId}`).query(user).send(product).expect(201);

    // Lock the cart
    await requestCart.put(`/${cartId}/lock`).query(user).expect(200);

    // Get the locked status
    let isLocked = await requestCart.get(`/${cartId}/lock`).query(user).expect(200);
    expect(isLocked.body.data.locked).to.equal(true);

    // Unlock the cart
    await requestCart.delete(`/${cartId}/lock`).query(user).expect(200);

    // Get the locked status
    isLocked = await requestCart.get(`/${cartId}/lock`).query(user).expect(200);
    expect(isLocked.body.data.locked).to.equal(false);
  })


  it("authd: can start and end a checkout", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };

    // Add a product
    await requestCart.post(`/${cartId}`).query(user).send(product).expect(201);

    // Begin checkout
    await requestCart.put(`/${cartId}/checkout`).query(user).expect(200);

    // Cart should be locked
    let isLocked = await requestCart.get(`/${cartId}/lock`).query(user).expect(200);
    expect(isLocked.body.data.locked).to.equal(true);

    // End checkout
    await requestCart.delete(`/${cartId}/checkout`).query(user).expect(200);

    // Cart should be unlocked
    isLocked = await requestCart.get(`/${cartId}/lock`).query(user).expect(200);
    expect(isLocked.body.data.locked).to.equal(false);
  })

  it("authd: does not allow checking out a cart that's being checked out", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };

    // Add a product
    await requestCart.post(`/${cartId}`).send(product).query(user).expect(201);

    // Begin checkout
    await requestCart.put(`/${cartId}/checkout`).query(user).expect(200);

    // Don't allow a second checkout
    await requestCart.put(`/${cartId}/checkout`).query(user).expect(403);
  })


  it("authd: can't end a checkout if there is none", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };

    // Add a product
    await requestCart.post(`/${cartId}`).query(user).send(product).expect(201);

    // Can't end a nonexisting checkout process
    await requestCart.delete(`/${cartId}/checkout`).query(user).expect(400);
  })

  it("guest: allows a guest cart", async () => {
    const { body: { auth: guestAuth } } = await requestCart.post(`/${cartId}`).send(product).expect(201);
    expect(guestAuth.as).to.equal("guest");
    expect(guestAuth.uid);
  })

  it("guest: lets a guest modify their cart", async () => {
    // Define a new product
    let new_product = {
      pid: product.pid,
      amount_in_cart: product.amount_in_cart+5
    }

    // Add a product
    const { body: { auth: { uid: sid } } } = await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Change the product
    await requestCart.put(`/${cartId}`).query({ sid }).send(new_product).expect(200);

    // Check that the amount has been updated
    let res = await requestCart.get(`/${cartId}`).query({ sid }).expect(200);
    expect(res.body.data[0].amount_in_cart).to.eql(new_product.amount_in_cart);

    // Remove it from the cart
    await requestCart.put(`/${cartId}/remove`).query({ sid }).send({ pid: new_product.pid }).expect(200)

    // List the products, expecting none to be present
    res = await requestCart.get(`/${cartId}`).query({ sid }).expect(200)
    expect(res.body.data).to.eql([]);

    // Re-add a product
    await requestCart.post(`/${cartId}`).query({ sid }).send(product).expect(201);

    // Empty the cart
    res = await requestCart.put(`/${cartId}/empty`).query({ sid }).expect(200);
    expect(res.body.data).to.eql(1);  // rows deleted

    // Check that the cart is empty
    res = await requestCart.get(`/${cartId}`).query({ sid }).expect(200);
    expect(res.body.data).to.eql([])
  })

  it("guest: can start and end a checkout", async () => {
    // Add a product
    const { body: { auth: { uid: sid } } } = await requestCart.post(`/${cartId}`).send(product).expect(201);

    // Begin checkout
    await requestCart.put(`/${cartId}/checkout`).query({ sid }).expect(200);

    // Cart should be locked
    let isLocked = await requestCart.get(`/${cartId}/lock`).query({ sid }).expect(200);
    expect(isLocked.body.data.locked).to.equal(true);

    // End checkout
    await requestCart.delete(`/${cartId}/checkout`).query({ sid }).expect(200);

    // Cart should be unlocked
    isLocked = await requestCart.get(`/${cartId}/lock`).query({ sid }).expect(200);
    expect(isLocked.body.data.locked).to.equal(false);
  })

  it ("authd: does not modify a locked cart", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };

    // Add a product
    let product2 = {
      "pid": 2,
      "amount_in_cart": 5
    }
    await requestCart.post(`/${cartId}`).send(product).query(user).expect(201);

    // Lock the cart
    await requestCart.put(`/${cartId}/lock`).query(user).expect(200);

    // Adding a product should fail
    await requestCart.post(`/${cartId}`).send(product2).query(user).expect(403);

    // Unlock the cart
    await requestCart.delete(`/${cartId}/lock`).query(user).expect(200);

    // Now the product should be added
    await requestCart.post(`/${cartId}`).send(product2).query(user).expect(201);
  })

  it("rejects a malformed remove request", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };

    await requestCart.put(`/${cartId}/remove`).query(user).expect(400)
  });

  it("rejects a malformed add request", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };

    await requestCart.post(`/${cartId}`).query(user).expect(400)
  });

  it("rejects a malformed change request", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };

    await requestCart.put(`/${cartId}`).query(user).expect(400)
  });

  it("does not allow users to modify each other's carts", async () => {
    const user = { uid: sample_users[0].uid, password: sample_users[0].password };
    await requestCart.post(`/${cartId}`).query(user).send(product).expect(201);

    // Create a guest cart
    await requestCart.post(`/${cartId}`).send(product).expect(403);
    const { body: { auth: { uid: sid } } } = await requestCart.post(`/${cartId+1}`).send(product).expect(201);
    // Try to delete the carts in an unauthorized way
    await requestCart.delete(`/${cartId}`).query({ sid }).expect(403);
    await requestCart.delete(`/${cartId+1}`).query(user).expect(403);
  })

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
