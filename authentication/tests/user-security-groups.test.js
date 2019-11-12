/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 3000;
const baseURL = `http://${host}:${port}/`;
const userSecurityGroupsAPI = require("supertest")(baseURL+'user-security-groups');

describe("Cart REST API", () => {
  let users, stores, securityGroups, sampleStores, sampleUsers, sampleSecurityGroups;
  let userSecurityGroups;
  let userId, storeId, securityGroupId;

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
    ];

    sampleStores = [
      {
        "id": "store1",
        "name": "Dummy store",
        "address": "dummy street 11",
        "phone": 999999998,
        "email": "support@dummystore.com"
      }
    ];

    sampleSecurityGroups = [
      {
        "id": "1",
        "scope": "SUPER_ADMIN"
      },
      {
        "id": "2",
        "scope": "STORE_ADMIN"
      },
      {
        "id": "3",
        "scope": "CUSTOMER"
      },
      {
        "id": "4",
        "scope": "GUEST"
      }
    ];

    userId = sampleUsers[0].uid;
    storeId = sampleStores[0].id;
    securityGroupId = sampleSecurityGroups[0].id;

    // Create the records in the database
    console.log(`Inserting sample records`);
    await users.deleteAll(); // Clear out the existing data
    await stores.deleteAll(); // Clear out the existing data
    await securityGroups.deleteAll();
    await userSecurityGroups.deleteAll();

    // Kind of a hack to access the other tables, replace this with models eventually
    await users.repository.knex('users').insert(sampleUsers);
    await stores.repository.knex('stores').insert(sampleUsers);
    await securityGroups.repository.knex('security_groups').insert(sampleUsers);
  }

  async function initModels() {
    try {
      await require('../src/configs/config');

      // Set up all the required constants
      const { Users, Stores, SecurityGroups, UserSecurityGroups } = require('../src/models');

      return {
         users: new Users(),
         stores: new Stores(),
         securityGroups: new SecurityGroups(),
         userSecurityGroups: new UserSecurityGroups() };
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

      // Log the start of the test
      console.log(`Starting test at ${new Date().toLocaleString()}`);

      // Load the sample data into the database
      loadSampleData();
    });
  });

  beforeEach(async () => {
    userSecurityGroups.deleteAll();
  });

  // Test API functionality
  it("create user security group", async () => {
    const payload = {
      userId,
      storeId,
      securityGroupId
    };
    
    const res = await userSecurityGroupsAPI.post().send(payload).expect(200);
    expect(res.body.data).to.eql([]);
  });

  it("Get User security group", async () => {
    
    const payload = {
      userId,
      storeId,
      securityGroupId
    };
    
    await userSecurityGroupsAPI.post().send(payload).expect(200);

    const res = await userSecurityGroupsAPI.get(`/${userId}/${storeId}`).expect(200);
    expect(res.body.data).to.eql();
  });

  it("removes a user security group", async () => {
    const payload = {
      userId,
      storeId,
      securityGroupId
    };
    
    await userSecurityGroupsAPI.post().send(payload).expect(201);

    const res = await userSecurityGroups.delete(`/${userId}/${storeId}`).expect(200);
    expect(res.body.data).to.eql([]);
  });

  
  // // Check API error handling
  // it("Rejects a malformed remove request", async () => {
  //   await requestCart.put(`/${cartId}/remove`).expect(400);
  // });

  // it("Rejects a malformed add request", async () => {
  //   await requestCart.post(`/${cartId}`).expect(400);
  // });

  // it("Rejects a malformed change request", async () => {
  //   await requestCart.put(`/${cartId}`).expect(400);
  // });

  // Clean up after all tests are done
  after(async function after() {
    // Remove carts and products in cart
    await users.deleteAll();
    await stores.deleteAll();
    await securityGroups.deleteAll();
    await userSecurityGroups.deleteAll();

    // Close the knex connection
    users.repository.knex.destroy();
    stores.repository.knex.destroy();
    securityGroups.repository.knex.destroy();
    userSecurityGroups.repository.knex.destroy();

    console.log("Test finished.");
  });

});
