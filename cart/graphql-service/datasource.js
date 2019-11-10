/**
 * This file declares a data source for linking the GraphQL
 * schema of the cart microservice with its RESTful API
 * Apollo Data sources are used for fetching and caching data
 * from the REST endpoints
 */

const { RESTDataSource } = require("apollo-datasource-rest");
const host = process.env.CART_SERVICE;
const CART_PORT = process.env.CART_PORT || 3000;

module.exports = class InventoryAPI extends RESTDataSource {
    constructor() {
        super();
        // Root domain of the RESTful API for cart microservice
        this.baseURL = `http://${host}:${CART_PORT}`;
    }

    /** 
    Retrieves all products in a cart
    @param {String} id - ID of the cart
    @returns {Array} of products
    */
    async getProductsInCart(id) {
        const result = await this.get(`cart/${id}`); // Makes an HTTP GET request to /cart/{id}
        return result;
    }

    /** 
    Returns the added product
    @param {Object} product - Product to be added
    @returns {Object} with the id, name and description of the product
    */
    async addProductToCart(id, product) {
        product = JSON.stringify(product);
        const result = await this.post(
            `cart/${id}`, // path
            product, // request body
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return result;
    }

    /** 
    Returns the updated product
    @param {Object} product - Product to be updated
    @param {String} pid - ID of the product to be updated
    @returns {Object} with the id, name and description of the product
    */
    async removeProductFromCart(id, product) {
        product = JSON.stringify(product);
        const result = await this.put(
            `cart/${id}/remove`, // path
            product, // request body
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return result;
    }

    /** 
    Returns the updated product
    @param {Object} product - Product to be updated
    @param {String} pid - ID of the product to be updated
    @returns {Object} with the id, name and description of the product
    */
    async emptyCart(id) {
        const result = await this.put(
            `cart/${id}/empty` // path
        );
        return result;
    }

    /** 
    Returns the updated product
    @param {Object} product - Product to be updated
    @param {String} pid - ID of the product to be updated
    @returns {Object} with the id, name and description of the product
    */
    async changeAmountOfProduct(id, product) {
        product = JSON.stringify(product);
        const result = await this.put(
            `cart/${id}`, // path
            product, // request body
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return result;
    }

    /** 
    Deletes the product with the given ID
    @param {String} pid - ID of the product to be updated
    @returns {Object} with a string message of confirmation
    */
    async deleteCart(id) {
        const result = await this.delete(`cart/${id}`);
        return result;
    }
};
