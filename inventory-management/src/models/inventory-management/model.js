'use strict';

const Kernel = require('../../repository/').Kernel;
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('../../repository/').InventoryManagement;

/**
 * The model for inventory management acts as an interface between the routes/handlers and the database.
 * It contains all data logic pertaining to the inventory management service.
 */
class InventoryManagementModel {
    constructor(options = {}) {
        this.resource = Names.inventory;
        this.repository = options.repository || (new Repository());
        this.logger = this.repository.logger;
    }

    /**
     * Get all products.
     * @async
     */
    async getProducts() {
        return this.repository.getProducts();
    }

    /**
     * Retrieve a product from inventory
     * @async
     * @param {number} productid - the id of the product
     * @param {object} product - an object describing the product
     */
    async getProduct(productid) {
        return this.repository.getProduct(productid);
    }

    /**
     * Add a product to inventory.
     * @async
     * @param {object} product - the details of the product to be added
     */
    async addProduct(product) {
        // Add the product and return it
        return this.repository.addProduct(product);
    }

    /**
     * Update the product in the inventory
     * @async
     * @param {number} productId - the id of the product
     * @param {object} product - an object with product details
     */
    async updateProduct(productId, product) {
        return this.repository.updateProduct(productId, product);
    }

    /**
     * Remove a product from the inventory
     * @async
     * @param {number} productId - the id of the product
     */
    async removeProduct(productId) {
        return this.repository.removeProduct(productId);
    }

    /**
     * Delete all records that are related to this model.
     * @async
     */
    async deleteAll() {
        return this.repository.deleteAll();
    }


    /**
     * Add amount of a product to the inventory
     * @async
     * @param {number} productId - the id of the product
     * @param {number} amount - the amount to add to the inventory
     */
    async addAmount(productId, amount) {
        return this.repository.addAmount(productId, amount);
    }

    /**
     * Subtract amount of a product from the inventory
     * @async
     * @param {number} productId - the id of the product
     * @param {number} amount - the amount to subtract from the inventory
     */
    async subtractAmount(productId, amount) {
        return this.repository.subtractAmount(productId, amount);
    }
}

// binds base model to the kernel
Kernel.bind(Names.inventory, InventoryManagementModel);

module.exports = InventoryManagementModel;