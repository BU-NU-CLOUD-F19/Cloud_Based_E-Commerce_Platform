/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 4050;
const usgURL = `http://${host}:${port}/user-security-groups`;
const userSecurityGroupsAPI = require("supertest")(usgURL);

describe("User Security groups REST API", () => {
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
        "phone": "1111111111",
        "email": "john@doe.com"
      }
    ];

    sampleStores = [
      {
        "id": "store1",
        "name": "Dummy store",
        "address": "dummy street 11",
        "phone": "9999999998",
        "email": "support@dummystore.com",
        "date_created": null
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
    await stores.repository.knex('stores').insert(sampleStores);
    await securityGroups.repository.knex('security_groups').insert(sampleSecurityGroups);
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
      securityGroups = objs.securityGroups;
      userSecurityGroups = objs.userSecurityGroups;

      // Log the start of the test
      console.log(`Starting test at ${new Date().toLocaleString()}`);
    });
  });

  beforeEach(async () => {
    // Load the sample data into the database
    await loadSampleData();
  });

  // Test API functionality
  it("create user security group", async () => {
    const payload = {
      userId,
      storeId,
      securityGroupId
    };

    const expectedOutput = {
      user_id: userId,
      store_id: storeId,
      security_group_id: securityGroupId
    };
    
    const res = await userSecurityGroupsAPI.post('').send(payload).expect(201);
    delete res.body.data[0].id;
    delete res.body.data[0].date_created;
    expect(res.body.data).to.eql([expectedOutput]);
  });

  it("Get User security group", async () => {
    const payload = {
      userId,
      storeId,
      securityGroupId
    };
    
    const expectedOutput = {
      user_id: userId,
      store_id: storeId,
      security_group_id: securityGroupId
    };

    await userSecurityGroupsAPI.post('').send(payload).expect(201);

    const res = await userSecurityGroupsAPI.get(`/${userId}/${storeId}`).expect(200);
    delete res.body.data[0].id;
    delete res.body.data[0].date_created;
    expect(res.body.data).to.eql([expectedOutput]);
  });

  it("removes a user security group", async () => {
    const payload = {
      userId,
      storeId,
      securityGroupId
    };
    
    await userSecurityGroupsAPI.post('').send(payload).expect(201);

    const res = await userSecurityGroupsAPI.delete(`/${userId}/${storeId}`).expect(200);
    expect(res.body.data).to.eql(1);
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
    await users.repository.knex.destroy();
    await stores.repository.knex.destroy();
    await securityGroups.repository.knex.destroy();
    await userSecurityGroups.repository.knex.destroy();

    console.log("Test finished.");
  });

});
