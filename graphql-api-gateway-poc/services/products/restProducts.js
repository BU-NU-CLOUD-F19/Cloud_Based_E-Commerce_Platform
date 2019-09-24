const { RESTDataSource } = require("apollo-datasource-rest");

module.exports = class ProductsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:4050";
  }

  async getAllProducts() {
    return this.get("products");
  }
};
