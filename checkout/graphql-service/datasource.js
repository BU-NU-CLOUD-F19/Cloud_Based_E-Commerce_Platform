/**
 * This file declares a data source for linking the GraphQL
 * schema of the checkout microservice with its RESTful API
 * Apollo Data sources are used for fetching and caching data
 * from the REST endpoints
 */

const { RESTDataSource } = require("apollo-datasource-rest");
const host = process.env.CHECKOUT_SERVICE;
const CHECKOUT_PORT = process.env.CHECKOUT_PORT || 3010;

module.exports = class CheckoutAPI extends RESTDataSource {
    constructor() {
        super();
        // Root domain of the RESTful API for cart microservice
        this.baseURL = `http://${host}:${CHECKOUT_PORT}`;
    }

    /** 
    Starts a checkout
    @param {String} id - ID of the cart
    @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
    @returns {Object} with success or failure message
    */
    async beginCheckout(id, sid, uid, password) {
        var authDetails = {};
        if (sid) {
            authDetails = {
                sid: sid
            }
        }
        else {
            authDetails = {
                uid: uid,
                password: password
            }
        }
        authDetails = JSON.stringify(authDetails);
        const result = await this.post(
            `checkout/${id}`, // path
            authDetails, // request body
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return result;
    }

    /** 
    Completes a checkout
    @param {String} id - ID of the cart
    @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
    @returns {Object} with success or failure message and details of order
    */
    async completeCheckout(id, sid, uid, password) {
        var authDetails = {};
        if (sid) {
            authDetails = {
                sid: sid
            }
        }
        else {
            authDetails = {
                uid: uid,
                password: password
            }
        }
        authDetails = JSON.stringify(authDetails);
        const result = await this.put(
            `checkout/${id}`, // path
            authDetails, // request body
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return result;
    }

    /** 
    Starts a checkout
    @param {String} id - ID of the cart
    @param {String} sid - session ID of guest
    @param {String} uid - user ID of registered user
    @param {String} password - password of registered user
    @returns {Object} with success or failure message
    */
    async abortCheckout(id, sid, uid, password) {
        var authDetails = {};
        if (sid) {
            authDetails = {
                sid: sid
            }
        }
        else {
            authDetails = {
                uid: uid,
                password: password
            }
        }
        console.log(authDetails);
        authDetails = JSON.stringify(authDetails);
        const result = await this.delete(
            `checkout/${id}`, // path
            authDetails, // request body
            {
                body: authDetails,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return result;
    }
};
