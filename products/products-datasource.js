/*
 * This file declares a data source for linking the GraphQL schema of the products microservice with its RESTful API
 */

const { RESTDataSource } = require("apollo-datasource-rest");

module.exports = class ProductsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:4050"; // URL for the RESTful API server
    this.getAllProducts.bind(this);
  }

  async getAllProducts() {
    const products = await this.get("products");
    return products;
  }

  async getProduct(id) {
    const result = await this.get(`products/${id}`);
    return result;
  }
};
