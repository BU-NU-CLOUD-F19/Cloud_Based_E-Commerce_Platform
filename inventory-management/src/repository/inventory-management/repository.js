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
        const query = knexBuilder.select('*');
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
        const query = knexBuilder.select('*').where({ pid: productid });
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
}

module.exports = InventoryManagementRepository;