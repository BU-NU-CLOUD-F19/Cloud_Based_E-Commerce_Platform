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
  let product, cartid, cart;

  before(function before() {
    product = {
      pid: 1,
      amount_in_cart: 3
    }
    cartid = 1;
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
    })
  });

  beforeEach(function beforeEach() {
    cart.deleteAll();
  })
  after(function after() {
    cart.deleteAll();
  })

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
        expect(res.body.data).to.eql([]);
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
        expect(res.body.data).to.eql(product)
      });

    // List the products, expecting to find the one that was added
    requestCart
      .get(`/${cartid}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data).to.eql([product]);
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
        expect(res.body.data.products).to.eql([]);
        return done();
      })
  });

  it("responds to an empty-cart request", done => {
    // Insert a few products into the cart
    for (let i = 1; i <= 3; i++) {
      requestCart.post(`/${cartid}`).send({ pid: i, amount_in_cart: i }).expect(201);
    }

    // Check that the cart contains 3 products
    requestCart.get(`/${cartid}`).expect(200).end((err, res) => {
      if (err) {
        return done(err);
      }
      expect(res.body.data.length).to.eql(3)
    });

    // Empty the cart
    requestCart
      .put(`/${cartid}/empty`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data).to.eql([]);
      });

    // Check that the cart is empty
    requestCart.get(`/${cartid}`).expect(200).end((err, res) => {
      if (err) {
        return done(err);
      }
      expect(res.body.data).to.eql([])
      return done();
    })
  });

  it("responds to a change request", done => {
    // Define a new product
    let new_product = {
      pid: 1,
      amount_in_cart: 2
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
        expect(res.body.data[0].amount_in_cart).to.eql(3)
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
        expect(res.body.data).to.eql([]);
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
