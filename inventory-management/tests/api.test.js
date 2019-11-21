/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const inventoryHost = `${process.env.INVENTORY_HOST}` || "localhost";
const inventoryPort = `${process.env.INVENTORY_PORT}` || "3020";
const inventoryUrl = `http://${inventoryHost}:${inventoryPort}/inventory`; // URL for inventory management service
const requestInventory = require("supertest")(inventoryUrl);


const gatewayHost = `${process.env.API_GW_HOST}` || "localhost";
const gatewayPort = `${process.env.API_GW_PORT}` || "3050";
const urlGateway = `http://${gatewayHost}:${gatewayPort}/`; // URL for GraphQL API Gateway
const requestGateway = require("supertest")(urlGateway);

describe("Inventory management REST API", () => {
    let product, productId, sample_products, inventory;

    // Utility function to initialize data
    async function loadSampleData() {
        // Set up test data

        sample_products = [
            {
                "pid": 1,
                "pcode": "ABC123",
                "price": 42.5,
                "sku": "XYZ",
                "amount_in_stock": 10,
                "pname": "Something",
                "description": "This is something very interesting that you want to buy.",
                "lang": "en_US"
            },
            {
                "pid": 2,
                "pcode": "FD2",
                "price": 99.99,
                "sku": "QWOP",
                "amount_in_stock": 100,
                "pname": "Speedos",
                "description": "I'm too lazy to write a description",
                "lang": "en_US"
            }
        ]

        // Create the records in the database
        console.log(`Inserting sample records`);
        await inventory.deleteAll(); // Clear out the existing data

        // Kind of a hack to access the other tables, replace this with models eventually
        await inventory.repository.knex('products').insert(sample_products);
        console.log("Inserted records");
    }

    async function initModels() {
        try {
            await require('../src/configs/config');

            // Set up all the required constants
            const { Model } = require('../src/models/inventory-management/index');
            return { inventory: new Model() }
        }
        catch (err) {
            console.log(err.message);
            throw err;
        }
    }

    // Runs before all tests
    before(function before() {

        // Load the config and wait for it to load
        initModels().then(objs => {
            inventory = objs.inventory;

            // Log the start of the test
            console.log(`Starting test at ${new Date().toLocaleString()}`);

            // Load the sample data into the database
            loadSampleData();

            product = {
                "pid": 3,
                "pcode": "PQR123",
                "price": 100,
                "sku": "LMN",
                "amount_in_stock": 20,
                "pname": "Watch",
                "description": "This is a Tissot classic watch.",
                "lang": "en_US"
            };

            // Choose a sample product id
            productId = 3;
        })
    })

    // Before each test, clear out the data
    beforeEach(async function beforeEach() {
        await inventory.deleteAll();
    })

    // Test API functionality
    it("lists products", async () => {
        // Check if product listing is possible
        const res = await requestInventory.get('').expect(200);
        expect(res.body.data).to.eql([{
            pid: 1,
            pcode: "ABC123",
            price: 42.5,
            sku: "XYZ",
            amount_in_stock: 10,
            pname: "Something",
            description: "This is something very interesting that you want to buy.",
            lang: "en_US"
        },
        {
            pid: 2,
            pcode: "FD2",
            price: 99.99,
            sku: "QWOP",
            amount_in_stock: 100,
            pname: "Speedos",
            description: "I'm too lazy to write a description",
            lang: "en_US"
        }]);
    });

    it("adds a product", async () => {
        // Add it to the inventory, and check response
        let res = await requestInventory.post('').send(product).expect(201);
        expect(res.body.data).to.eql([{
            pid: 3,
            pname: 'Watch',
            description: 'This is a Tissot classic watch.'
        }]);
    });

    it("doesn't allow to add a product if id already exists", async () => {
        // Add product
        await requestInventory.post('').send(product).expect(201);

        // Add it to the inventory, and check response
        await requestInventory.post('').send(product).expect(400);
    });

    it("updates a product", async () => {
        // Add product
        await requestInventory.post('').send(product).expect(201);

        // Initialize a product to be updated
        let editProduct = {
            "pid": 3,
            "pcode": "BAG123",
            "price": 200,
            "sku": "NIKEBAG",
            "amount_in_stock": 25,
            "pname": "Bag",
            "description": "This is a Nike bag.",
            "lang": "en_US"
        };
        // Update the product and check response
        let res = await requestInventory.put(`/${productId}`).send(editProduct).expect(200);
        expect(res.body.data).to.eql([{
            pid: 3,
            pname: 'Bag',
            description: 'This is a Nike bag.'
        }]);
    });

    it("doesn't allow to update a product that doesn't exist", async () => {
        // Add product
        await requestInventory.post('').send(product).expect(201);

        // Initialize a product to be updated that doesn't exist
        let editProduct = {
            "pid": 5,
            "pcode": "BAG123",
            "price": 200,
            "sku": "NIKEBAG",
            "amount_in_stock": 25,
            "pname": "Bag",
            "description": "This is a Nike bag.",
            "lang": "en_US"
        };

        // Add it to the inventory, and check response
        await requestInventory.put(`/${editProduct.pid}`).send(editProduct).expect(400);
    });

    it("removes a product", async () => {
        // Add product
        await requestInventory.post('').send(product).expect(201);
        // Remove it from the inventory and check response
        await requestInventory.delete(`/${productId}`).expect(200);
    });

    it("doesn't remove a product which doesn't exist", async () => {
        // Add product
        await requestInventory.post('').send(product).expect(201);
        // Remove it from the inventory and check response
        await requestInventory.delete(`/2`).expect(400);
    });

    it("retrieves a product from the given id", async () => {
        // Add product
        await requestInventory.post('').send(product).expect(201);
        // Remove it from the inventory and check response
        let res = await requestInventory.get(`/${product.pid}`).expect(200);
        expect(res.body.data).to.eql([{
            pid: 3,
            pcode: "PQR123",
            price: 100,
            sku: "LMN",
            amount_in_stock: 20,
            pname: "Watch",
            description: "This is a Tissot classic watch.",
            lang: "en_US"
        }
        ]);
    });

    it("doesn't return a product which doesn't exist", async () => {
        // Add product
        await requestInventory.post('').send(product).expect(201);
        // Remove it from the inventory and check response
        await requestInventory.get(`/2`).expect(400);
    });

    // Tests for API Gateway

    it("Gateway lists all products", async () => {
        // Add sample products
        await requestInventory.post('').send(sample_products[0]).expect(201);
        await requestInventory.post('').send(sample_products[1]).expect(201);

        // Make request to Gateway
        const res = await requestGateway.post('').send({ query: "{ products{ pid, pname }}" }).expect(200);

        expect(res.body.data.products[0]).to.have.property("pname");
        expect(res.body.data.products[0].pname).to.equal("Something");
        expect(res.body.data.products[1]).to.have.property("pid");
        expect(res.body.data.products[1].pid).to.equal(2);
    });

    it("Gateway lists product with given ID", async () => {
        // Add sample product
        await requestInventory.post('').send(sample_products[0]).expect(201);

        // Make request to Gateway
        const res = await requestGateway.post('').send({ query: "{ product(id: 1){ pid, pname }}" }).expect(200);

        expect(res.body.data.product).to.have.property("pname");
        expect(res.body.data.product.pname).to.equal("Something");
    });

    it("Gateway doesn't retrieve product that doesn't exist", async () => {
        // Send request for product with ID 1 when no products exist
        const res = await requestGateway.post('').send({ query: "{ product(id: 1){ pid, pname }}" }).expect(200);

        // Check that the response contains errors with a specific error message
        expect(res.body).to.have.property("errors");
        expect(res.body.errors[0].extensions.response.body).to.have.property("message");
        expect(res.body.errors[0].extensions.response.body.message).to.equal("Product with id 1 not in inventory.");
    });

    it("Gateway adds a product", async () => {
        const newProduct = `{
            pid: 5 
            pcode: "XYZ999" 
            price: 500 
            sku: "PQR" 
            amount_in_stock: 500 
            pname: "Da Vinci Code" 
            description: "This is a book by Dan Brown" 
            lang: "en_US"}`;

        // Add a product with ID 5
        const res = await requestGateway.post('')
            .send({ query: `mutation { addProduct(input: ${newProduct}) {pid pname description}}` })
            .expect(200);

        expect(res.body.data.addProduct).to.have.property("pname");
        expect(res.body.data.addProduct).to.have.property("pid");
        expect(res.body.data.addProduct).to.have.property("description");
        expect(res.body.data.addProduct.pname).to.equal("Da Vinci Code");
    });

    it("Gateway doesn't allow to add a product if ID already exists", async () => {
        // Add a product with ID 1
        await requestInventory.post('').send(sample_products[0]).expect(201);

        const newProduct = `{
            pid: 1
            pcode: "XYZ999" 
            price: 500 
            sku: "PQR" 
            amount_in_stock: 500 
            pname: "Da Vinci Code" 
            description: "This is a book by Dan Brown" 
            lang: "en_US"}`;

        const res = await requestGateway.post('')
            .send({ query: `mutation { addProduct(input: ${newProduct}) {pid pname description}}` });

        // Check that the response contains errors with a specific error message
        expect(res.body).to.have.property("errors");
        expect(res.body.errors[0].extensions.response.body).to.have.property("message");
        expect(res.body.errors[0].extensions.response.body.message).to.equal("Product already present in inventory.");
    });

    it("Gateway updates a product", async () => {
        // Add a product with ID 1
        await requestInventory.post('').send(sample_products[0]).expect(201);

        const updateProduct = `{
            pid: 1
            pcode: "XYZ999" 
            price: 500 
            sku: "PQR" 
            amount_in_stock: 500 
            pname: "Da Vinci Code" 
            description: "This is a book by Dan Brown" 
            lang: "en_US"}`;

        const res = await requestGateway.post('')
            .send({ query: `mutation { updateProduct(id: 1 input: ${updateProduct}) {pid pname description}}` })
            .expect(200);

        expect(res.body.data.updateProduct).to.have.property("pname");
        expect(res.body.data.updateProduct).to.have.property("pid");
        expect(res.body.data.updateProduct).to.have.property("description");
        expect(res.body.data.updateProduct.pname).to.equal("Da Vinci Code");
    });

    it("Gateway doesn't allow to update a product that doesn't exist", async () => {
        const updateProduct = `{
            pid: 1
            pcode: "XYZ999" 
            price: 500 
            sku: "PQR" 
            amount_in_stock: 500 
            pname: "Da Vinci Code" 
            description: "This is a book by Dan Brown" 
            lang: "en_US"}`;
        const res = await requestGateway.post('')
            .send({ query: `mutation { updateProduct(id: 1 input: ${updateProduct}) {pid pname description}}` });

        // Check that the response contains errors with a specific error message
        expect(res.body).to.have.property("errors");
        expect(res.body.errors[0].extensions.response.body).to.have.property("message");
        expect(res.body.errors[0].extensions.response.body.message).to.equal("No such product in inventory.");
    });

    it("Gateway deletes a product", async () => {
        // Add a product with ID 1
        await requestInventory.post('').send(sample_products[0]).expect(201);

        const res = await requestGateway.post('').send({ query: ` mutation { deleteProduct(id: 1)}` }).expect(200);

        expect(res.body.data).to.have.property("deleteProduct");
    });

    it("Gateway doesn't delete a product that doesn't exist", async () => {
        const res = await requestGateway.post('').send({ query: ` mutation { deleteProduct(id: 1)}` }).expect(200);

        // Check that the response contains errors with a specific error message
        expect(res.body).to.have.property("errors");
        expect(res.body.errors[0].extensions.response.body).to.have.property("message");
        expect(res.body.errors[0].extensions.response.body.message).to.equal("No such product in inventory.");
    });
    it("decrements the amount of a product in the inventory", async () => {
        // Add product
        await requestInventory.post('').send(product).expect(201);

        // Subtract some amount from the product
        const toSubtract = 5;
        await requestInventory.delete(`/${product.pid}/${toSubtract}`).expect(200);

        // Check that the database was updated
        const res = await requestInventory.get(`/${product.pid}`).expect(200);
        expect(res.body.data).to.eql([{
            "amount_in_stock": 15,
            "description": "This is a Tissot classic watch.",
            "lang": "en_US",
            "pcode": "PQR123",
            "pid": 3,
            "pname": "Watch",
            "price": 100,
            "sku": "LMN"
        }]);
    })

    it("increments the amount of a product in the inventory", async () => {
        // Add product
        await requestInventory.post('').send(product).expect(201);

        // Add some amount to the product
        const toAdd = 5;
        await requestInventory.put(`/${product.pid}/${toAdd}`).expect(200);

        // Check that the database was updated
        const res = await requestInventory.get(`/${product.pid}`).expect(200);
        expect(res.body.data).to.eql([{
            "amount_in_stock": 25,
            "description": "This is a Tissot classic watch.",
            "lang": "en_US",
            "pcode": "PQR123",
            "pid": 3,
            "pname": "Watch",
            "price": 100,
            "sku": "LMN"
        }]);
    })

    it("cannot remove more than is in stock", async () => {
        // Add product
        await requestInventory.post('').send(product).expect(201);

        // Try to remove more than is in stock, expect an error
        const toRemove = product.amount_in_stock + 1;
        await requestInventory.delete(`/${product.pid}/${toRemove}`).expect(400);

        // Check that the database didn't change
        const res = await requestInventory.get(`/${product.pid}`).expect(200);
        expect(res.body.data).to.eql([{
            "amount_in_stock": 20,
            "description": "This is a Tissot classic watch.",
            "lang": "en_US",
            "pcode": "PQR123",
            "pid": 3,
            "pname": "Watch",
            "price": 100,
            "sku": "LMN"
        }]);
    })

    it("cannot remove if there is nothing in stock", async () => {
        // Add product
        await requestInventory.post('').send(product).expect(201);

        // Remove as much as is in stock (bringing amount_in_stock to 0)
        let toRemove = product.amount_in_stock;
        await requestInventory.delete(`/${product.pid}/${toRemove}`).expect(200);

        // Try to remove from a product that's not in stock, expect an error
        toRemove = 1;
        await requestInventory.delete(`/${product.pid}/${toRemove}`).expect(400);


        // Check that the database didn't change
        const res = await requestInventory.get(`/${product.pid}`).expect(200);
        expect(res.body.data).to.eql([{
            "amount_in_stock": 0,
            "description": "This is a Tissot classic watch.",
            "lang": "en_US",
            "pcode": "PQR123",
            "pid": 3,
            "pname": "Watch",
            "price": 100,
            "sku": "LMN"
        }]);
    })

    // Clean up after all tests are done
    after(async function after() {
        // Remove all products
        await inventory.deleteAll();

        // Remove the sample data created in before()
        console.log("Removing sample data");
        for (let prod of sample_products) {
            await inventory.repository.knex('products').where({ pid: prod.pid }).del();
        }

        // Close the knex connection
        inventory.repository.knex.destroy();

        console.log("Test finished.");
    })

})

