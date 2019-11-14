/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 4050;
const sgURL = `http://${host}:${port}/security-groups`; // URL for GraphQL API Gateway
const securityGroupsAPI = require("supertest")(sgURL);

describe("Security-groups REST API", () => {
  let securityGroups, sampleSecurityGroups;

  // Utility function to initialize data
  async function loadSampleData() {
    // Set up test data

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

    // Create the records in the database
    console.log(`Inserting sample records`);
    await securityGroups.deleteAll(); // Clear out the existing data
    // Kind of a hack to access the other tables, replace this with models eventually
    await securityGroups.repository.knex('security_groups').insert(sampleSecurityGroups);
  }

  async function initModels() {
    try {
      await require('../src/configs/config');

      // Set up all the required constants
      const { SecurityGroups } = require('../src/models');

      return { securityGroups: new SecurityGroups() };
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

      securityGroups = objs.securityGroups;

      // Log the start of the test
      console.log(`Starting test at ${new Date().toLocaleString()}`);
    });
  });

  beforeEach(async () => {
    // Load the sample data into the database
    await loadSampleData();
  });

  // Test API functionality
  it("list security groups", async () => {
    const res = await securityGroupsAPI.get('').expect(200);
    expect(res.body.data).to.eql(sampleSecurityGroups);
  });

  // Clean up after all tests are done
  after(async function after() { 
    await securityGroups.deleteAll();

    // Close the knex connection
    await securityGroups.repository.knex.destroy();

    console.log("Test finished.");
  });

});
