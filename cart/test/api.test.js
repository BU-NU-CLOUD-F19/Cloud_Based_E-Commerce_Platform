const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 3000;
const cartURL = `http://${host}:${port}/cart`; // URL for GraphQL API Gateway
const requestCart = require("supertest")(cartURL);
const Cart = require('../src/models').cart.Model;

describe("Cart REST API", () => {
  let product, cartid;

  before(function() {
    product = {
      pid: 1,
      amount: 3
    }
    cartid = 1
  })
  beforeEach(function() {
    Cart.deleteAll();
    done();
  });

  // Functionality
  it("lists products", done => {
    // Check if product listing is possible
    requestCart
      .get(`/${cartid}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data).to.equal([]);
        return done();
      });
  });

  it("adds a product to a cart", done => {
    // Add it to the cart, and check response
    requestCart
      .post(`/${cartid}`)
      .send(product)
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data[0]).to.equal(product)
      });

    // List the products, expecting to find the one that was added
    requestCart
      .get(`/${cartid}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data).to.equal([product]);
        return done();
      });
  });

  it("removes a product from a cart", done => {
    // Add it to the cart
    requestCart.post(`/${cartid}`).send(product);

    // Remove it from the cart
    requestCart
      .put(`/${cartid}/remove`)
      .send({ pid: product.pid })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      });

    // List the products, expecting none to be present
    requestCart
      .get(`/${cartid}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data.products).to.equal([]);
        return done();
      })
  });

  it("responds to an empty-cart request", done => {
    // Insert a few products into the cart
    for (i = 1; i <= 3; i++) {
      requestCart.post(`/${cartid}`).send({ pid: i, amount: i }).expect(201);
    }

    // Check that the cart contains 3 products
    requestCart.get(`/${cartid}`).expect(200).end((err, res) => {
      if (err) {
        return done(err);
      }
      expect(res.body.data.length).to.equal(3)
    });

    // Empty the cart
    requestCart
      .put(`/${cartid}/empty`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data).to.equal([]);
      });

    // Check that the cart is empty
    requestCart.get(`/${cartid}`).expect(200).end((err, res) => {
      if (err) {
        return done(err);
      }
      expect(res.body.data).to.equal([])
      return done();
    })
  });

  it("responds to a change request", done => {
    // Define a new product
    let new_product = {
      pid: 1,
      amount: 2
    }

    // Add a product
    requestCart.post(`/${cartid}`).send(product).expect(201);

    // Change the product
    requestCart
      .put(`/${cartid}`)
      .send(new_product)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      });

    // Check that the amount has been updated
    requestCart.get(`/${cartid}`).expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data[0].amount).to.equal(3)
        return done();
      });
  });

  it("responds to a delete request", done => {
    // Add a product
    requestCart.post(`/${cartid}`).send(product).expect(201);

    // Delete it
    requestCart
      .delete(`/${cartid}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      });

    // Check that the product is gone
    requestCart.get(`${cartid}`).expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data).to.equal([]);
        return done();
      });
  })

  // Error handling
  it("Rejects a malformed remove request", done => {
    requestCart
      .put(`/${cartid}/remove`)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
  it("Rejects a malformed add request", done => {
    requestCart
      .post(`/${cartid}`)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it("Rejects a malformed change request", done => {
    requestCart
      .put(`/${cartid}`)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

});
