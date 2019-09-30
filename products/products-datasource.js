/**
 * This file declares a data source for linking the GraphQL schema of the products microservice with its RESTful API
 * Apollo Data sources are used for fetching and caching data from the REST endpoints
 */

const { RESTDataSource } = require("apollo-datasource-rest");

module.exports = class ProductsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:4050"; // Root domain of the RESTful API
    this.getAllProducts.bind(this);
    this.getProduct.bind(this);
    this.addProduct.bind(this);
  }

  /** 
  Retrieves all products
  @returns Array of products
  */
  async getAllProducts() {
    const products = await this.get("products");
    return products;
  }

  /** 
  Returns a product given an ID
  @param id - ID of the product
  @returns Object with the desired product
  */
  async getProduct(id) {
    const result = await this.get(`products/${id}`);
    return result;
  }

  /** 
  Returns all products
  @param product - Product to be added
  @returns Array of products
  */
  async addProduct(product) {
    product = JSON.stringify(product);
    const result = await this.post(
      `products`, // path
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
