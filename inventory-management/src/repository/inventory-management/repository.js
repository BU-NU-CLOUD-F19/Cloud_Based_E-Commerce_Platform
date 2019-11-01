/**
 * This class defines all the methods to handle calls to db for `inventory management` resource,
 * using query-builder tool
 */

'use strict';

const logger = require('../../utils/logger');
const Names = require('../../constants/modelNames');
const resource = Names.inventory;
const Kernel = require('../kernel');
const knex = require('../knex');

/**
 * Defines primitive functions for interacting with the PostgreSQL database.
 * They only retrieve and return data, they do not contain any data logic -- that is the responsibility of the model.
 */
class InventoryManagementRepository {
    constructor(options = {}) {
        const knexManager = Kernel.resolve(Names.knexManager);

        this.knex = knexManager.knex;
        if (!this.knex) {
            const {
                connection,
                pool = { min: 2, max: 7 },
            } = options;
            this.knex = knex(connection, pool);
        }

        this.logger = logger;
        this.resource = resource;
    }

    /**
     * Get all products from inventory
     * @async
     */
    async getProducts() {

        const knexBuilder = this.knex(this.resource);
        const query = knexBuilder.select('products');
        this.logger.debug(`\tQuery: ${query}`);

        const result = await query;
        this.logger.debug(`\tRetrieved ${result.length} records.`);
        return result;
    }

    /**
     * Retrieve a product from inventory
     * @async
     * @param {number} productid - the id of the product
     */
    async getProduct(productid) {
        const knexBuilder = this.knex(this.resource);
        const query = knexBuilder.select('products').where({ pid: productid });
        this.logger.debug(`\tQuery: ${query}`);

        const result = await query;
        this.logger.debug(`\tRetrieved ${result.length} record.`);
        return result;
    }

    /**
     * Add a product to the inventory
     *
     * @async
     * @param {object} product - the product to be added
     */
    async addProduct(product) {
        // Set up the table reference
        const knexBuilder = this.knex(this.resource);
        const addProduct = knexBuilder.insert(product).returning(['pid', 'pname', 'description']);
        this.logger.debug(`\tQuery: ${addProduct}`);

        return addProduct;
    }
    /**
     * Update a product in the inventory.
     * @async
     * @param {number} productId - the id of the product
     * @param {object} product - the object containing the details of the product
     */
    async updateProduct(productId, product) {
        const knexBuilder = this.knex(this.resource);
        const query = knexBuilder.where({ pid: productId })
            .update(product)
            .returning(['pid', 'pname', 'description'])
        this.logger.debug(`\tQuery: ${query}`);

        const res = await query;
        this.logger.debug(`\tResult ${JSON.stringify(res)}`);
        return res;
    }

    /**
     * Remove a product from the inventory
     * @async
     * @param {number} productId - the id of the product
     */
    async removeProduct(productId) {
        const knexBuilder = this.knex(this.resource);
        const query = knexBuilder.where({ pid: productId }).del();
        this.logger.debug(`\tQuery: ${query}`);

        const nRowsDeleted = await query;
        this.logger.debug(`\tResult: deleted ${nRowsDeleted} rows.`);

        return nRowsDeleted;
    }

    /**
     * Delete all products
     * @async
     */
    async deleteAll() {
        try {
            // Knex doesn't provide a way to cascade, so have to use a raw query
            const query = this.knex.raw(`TRUNCATE TABLE ${this.resource} CASCADE`);
            const result = await query;

            this.logger.debug("Successfully truncated the table.");
            return result;
        }
        catch (err) {
            this.logger.error(err.message);
        }
    }

    /**
     * Subtract amount of a product from the inventory
     * @async
     * @param {number} productId - the id of the product
     * @param {number} amount - the amount to subtract from the inventory
     */
    async subtractAmount(productId, amount) {
        const inventory = this.knex(this.resource);

        // Get the urrent amount in stock
        const getAmount = inventory.select('amount_in_stock').where({pid: productId});
        this.logger.debug(`\tQuery: ${getAmount}`);

        const { amount_in_stock: currentAmount } = (await getAmount)[0];
        this.logger.debug(`\tResult: ${JSON.stringify(currentAmount)}`);

        // Calculate the new amount
        const newAmount = currentAmount-amount;

        // Create the query
        const query = inventory.where({pid: productId}).update({amount_in_stock: newAmount}, ['pid', 'amount_in_stock']);
        this.logger.debug(`\tQuery: ${query}`);

        // Try to subtract the amount
        try {
            const res = await query;
            this.logger.debug(`\tResult: ${JSON.stringify(res)}`);
            return res[0];
        }
        catch(err) {
            // Error handling if it fails because of a constraint check on the amount in stock.
            //    Note: these checks could also be done beforehand, once the current amount in stock is known.
            //    The reason I opted to do it this way is because we can use the generated database error object
            //    from knex. I haven't figured out how to throw the knex error directly; if that's figured out, the
            //    checks can be done without transacting with the database.
            if (err.constraint === "products_amount_in_stock_check") {
                // If there is nothing in stock
                if (currentAmount == 0) {
                    // Add a custom property to the error that states so
                    err.amount_in_stock_error = "none_in_stock";
                }
                // Else, if there's not enough in stock
                else {
                    // Add a custom property to the error that states so, as well
                    // as the amount that is currently in stock.
                    err.amount_in_stock_error = "not_enough_in_stock";
                    err.amount_in_stock_current = parseInt(currentAmount);
                }
            }

            // Then re-throw the error up to the HTTP request handler, which will return the appropriate
            //   HTTP response.
            throw err;
        }

    }

    /**
     * Add amount of a product to the inventory
     * @async
     * @param {number} productId - the id of the product
     * @param {number} amount - the amount to add to the inventory
     */
    async addAmount(productId, amount) {
        const inventory = this.knex(this.resource);

        // Get the current amount in stock
        const getAmount = inventory.select('amount_in_stock').where({pid: productId});
        this.logger.debug(`\tQuery: ${getAmount}`);

        const { amount_in_stock: currentAmount } = (await getAmount)[0];
        this.logger.debug(`\tResult: ${JSON.stringify(currentAmount)}`);

        // Calculate the new amount in stock
        const newAmount = parseInt(currentAmount)+parseInt(amount);

        // Update the database
        const query = inventory.where({pid: productId}).update({amount_in_stock: newAmount}, ['pid', 'amount_in_stock']);
        this.logger.debug(`\tQuery: ${query}`);

        const res = await query;
        this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

        return res[0];
    }
}

module.exports = InventoryManagementRepository;