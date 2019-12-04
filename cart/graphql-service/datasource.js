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
    @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
    @returns {Array} of products
    */
    async getProductsInCart(id, sid, uid, password) {
        var requestUrl = "";
        if (sid) {
            requestUrl = `cart/${id}?sid=${sid}`;
        }
        else {
            requestUrl = `cart/${id}?uid=${uid}&password=${password}`;
        }
        const result = await this.get(requestUrl);
        return result;
    }

    /** 
    Returns the added product
    @param {String} id - ID of the cart
    @param {Object} product - Product to be added
    @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
    @returns {Object} with the id, name and description of the product
    */
    async addProductToCart(id, product, sid, uid, password) {
        var requestUrl = "";
        if (sid) {
            requestUrl = `cart/${id}?sid=${sid}`;
        }
        else {
            requestUrl = `cart/${id}?uid=${uid}&password=${password}`;
        }
        product = JSON.stringify(product);
        const result = await this.post(
            requestUrl, // path
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
    Returns an object containing the message and data
    @param {String} id - ID of the cart
    @param {Object} product - Product to be removed
    @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
    @returns {Object} with message and data
    */
    async removeProductFromCart(id, product, sid, uid, password) {
        var requestUrl = "";
        if (sid) {
            requestUrl = `cart/${id}/remove?sid=${sid}`;
        }
        else {
            requestUrl = `cart/${id}/remove?uid=${uid}&password=${password}`;
        }
        product = JSON.stringify(product);
        const result = await this.put(
            requestUrl, // path
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
    Returns an object containing the message and data
    @param {String} id - ID of the cart
    @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
    @returns {Object} with message and data
    */
    async emptyCart(id, sid, uid, password) {
        var requestUrl = "";
        if (sid) {
            requestUrl = `cart/${id}/empty?sid=${sid}`;
        }
        else {
            requestUrl = `cart/${id}/empty?uid=${uid}&password=${password}`;
        }
        const result = await this.put(
            requestUrl // path
        );
        return result;
    }

    /** 
    Returns an object containing the message and updated product information
    @param {String} id - ID of the cart
    @param {Object} product - Product to be updated
    @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
    @returns {Object} with message and updated product information
    */
    async changeAmountOfProduct(id, product, sid, uid, password) {
        var requestUrl = "";
        if (sid) {
            requestUrl = `cart/${id}?sid=${sid}`;
        }
        else {
            requestUrl = `cart/${id}?uid=${uid}&password=${password}`;
        }
        product = JSON.stringify(product);
        const result = await this.put(
            requestUrl, // path
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
    Deletes the cart with the given ID
    @param {String} id - ID of the cart
    @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
    @returns {Object} with a string message of confirmation
    */
    async deleteCart(id, sid, uid, password) {
        var requestUrl = "";
        if (sid) {
            requestUrl = `cart/${id}?sid=${sid}`;
        }
        else {
            requestUrl = `cart/${id}?uid=${uid}&password=${password}`;
        }
        const result = await this.delete(requestUrl);
        return result;
    }

    /** 
    Locks the cart with the given ID
    @param {String} id - ID of the cart
    @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
    @returns {Object} with a string message of confirmation
    */
    async lockCart(id, sid, uid, password) {
        var requestUrl = "";
        if (sid) {
            requestUrl = `cart/${id}/lock?sid=${sid}`;
        }
        else {
            requestUrl = `cart/${id}/lock?uid=${uid}&password=${password}`;
        }
        const result = await this.put(requestUrl);
        return result;
    }

    /** 
   Removes the lock of the cart with the given ID
   @param {String} id - ID of the cart
   @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
   @returns {Object} with a string message of confirmation
   */
    async unlockCart(id, sid, uid, password) {
        var requestUrl = "";
        if (sid) {
            requestUrl = `cart/${id}/lock?sid=${sid}`;
        }
        else {
            requestUrl = `cart/${id}/lock?uid=${uid}&password=${password}`;
        }
        const result = await this.delete(requestUrl);
        return result;
    }

    /** 
   Locks the cart with the given ID
   @param {String} id - ID of the cart
   @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
   @returns {Object} with a string message of confirmation
   */
    async getLockStatus(id, sid, uid, password) {
        var requestUrl = "";
        if (sid) {
            requestUrl = `cart/${id}/lock?sid=${sid}`;
        }
        else {
            requestUrl = `cart/${id}/lock?uid=${uid}&password=${password}`;
        }
        const result = await this.get(requestUrl);
        return result;
    }
};
