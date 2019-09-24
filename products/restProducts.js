const { RESTDataSource } = require("apollo-datasource-rest");

module.exports = class ProductsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:4050";
    this.getAllProducts.bind(this);
  }

  async getAllProducts() {
    const products = await this.get("products");
    return products;
  }
};
