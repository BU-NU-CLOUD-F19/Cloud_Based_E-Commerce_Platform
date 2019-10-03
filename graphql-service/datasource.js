/**
 * This file declares a data source for linking the GraphQL schema of the demo microservice with its RESTful API
 * Apollo Data sources are used for fetching and caching data from the REST endpoints
 */

const { RESTDataSource } = require("apollo-datasource-rest");

module.exports = class MembersAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://boilerplate:3000"; // Root domain of the RESTful API
    this.getAllMembers.bind(this);
    this.getMember.bind(this);
    this.addMember.bind(this);
  }

  /** 
  Retrieves all members
  @returns Array of members
  */
  async getAllMembers() {
    const demo = await this.get("demo");
    return demo;
  }

  /** 
  Returns a member given an ID
  @param id - ID of the member
  @returns Object with the desired member
  */
  async getMember(id) {
    const result = await this.get(`demo/${id}`);
    return result[0];
  }

  /** 
  Returns all members
  @param product - Member to be added
  @returns Array of members
  */
  async addMember(product) {
    product = JSON.stringify(product);
    const result = await this.post(
      `demo`, // path
      product, // request body
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return result;
  }
};
