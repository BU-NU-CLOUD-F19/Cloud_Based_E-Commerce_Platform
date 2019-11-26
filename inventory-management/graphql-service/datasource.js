/**
 * This file declares a data source for linking the GraphQL
 * schema of the inventory management microservice with its RESTful API
 * Apollo Data sources are used for fetching and caching data
 * from the REST endpoints
 */

const { RESTDataSource } = require("apollo-datasource-rest");
const host = process.env.INVENTORY_SERVICE;
const INVENTORY_PORT = process.env.INVENTORY_PORT || 3020;

module.exports = class InventoryAPI extends RESTDataSource {
    constructor() {
        super();
        // Root domain of the RESTful API for inventory-management microservice
        this.baseURL = `http://${host}:${INVENTORY_PORT}`;
    }

    /** 
    Retrieves all products
    @returns {Array} of products
    */
    async getAllProducts() {
        const demo = await this.get("inventory"); // Makes an HTTP GET request to /inventory
        return demo.data;
    }

    /** 
    Returns a product given a product ID
    @param {String} pid - ID of the product
    @returns {Object} with the desired product
    */
    async getProduct(pid) {
        const result = await this.get(`inventory/${pid}`);
        return result.data[0];
    }

    /** 
    Returns the added product
    @param {Object} product - Product to be added
    @returns {Object} with the id, name and description of the product
    */
    async addProduct(product) {
        product = JSON.stringify(product);
        const result = await this.post(
            `inventory`, // path
            product, // request body
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return result.data[0];
    }

    /** 
    Returns the updated product
    @param {Object} product - Product to be updated
    @param {String} pid - ID of the product to be updated
    @returns {Object} with the id, name and description of the product
    */
    async updateProduct(product, pid) {
        product = JSON.stringify(product);
        const result = await this.put(
            `inventory/${pid}`, // path
            product, // request body
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return result.data[0];
    }

    /** 
    Deletes the product with the given ID
    @param {String} pid - ID of the product to be updated
    @returns {Object} with a string message of confirmation
    */
    async deleteProduct(pid) {
        const result = await this.delete(`inventory/${pid}`);
        return result.message;
    }
};
