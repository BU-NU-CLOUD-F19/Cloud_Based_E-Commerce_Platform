/* eslint-env mocha */
const chai = require("chai");
const { expect } = chai;
const host = "localhost";
const port = 3020;
const inventoryUrl = `http://${host}:${port}/inventory`; // URL for inventory management service
const requestInventory = require("supertest")(inventoryUrl);


const gatewayHost = process.env.API_GATEWAY || "localhost";
const urlGateway = `http://${gatewayHost}:3050/`; // URL for GraphQL API Gateway
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
            description: "I\'m too lazy to write a description",
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

    it("lists graphql products", async () => {
        // Check if product listing is possible
        await requestInventory.post('').send(sample_products[0]).expect(201);
        await requestInventory.post('').send(sample_products[1]).expect(201);
        // console.log(inventory.getProducts());
        const res = await requestGateway.post('').send({ query: "{ products{ pid, pname }}" }).expect(200);
        console.log(res.body);
        expect(res.body.data.products[0]).to.have.property("pname");
        expect(res.body.data.products[0].pname).to.equal("Something");
        expect(res.body.data.products[1]).to.have.property("pid");
        expect(res.body.data.products[1].pid).to.equal(2);
    });

    // it("gateway adds a product", async () => {
    //     const res = await requestGateway.post('').send({ query: "{ mutation { addProduct(input: {pid: 5 pcode: \"XYZ999\" price: 500 sku: \"PQR\" amount_in_stock: 500 pname: \"Da Vinci Code\" description: \"This is a book by Dan Brown\" lang: \"en_US\"}) {pid pname description}}}" }).expect(200);
    //     expect(res.body.data.addProduct).to.have.property("pname");
    //     expect(res.body.data.addProduct).to.have.property("pid");
    //     expect(res.body.data.addProduct).to.have.property("description");
    //     expect(res.body.data.addProduct.pname).to.equal("Da Vinci Code");
    // });

    it("gateway deletes a product", async () => {
        await requestInventory.post('').send(sample_products[0]).expect(201);
        const res = await requestGateway.post('').send({ query: ` mutation { deleteProduct(id: 1)}` }).expect(200);
        expect(res.body.data).to.have.property("deleteProduct");
    });

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

// describe("Inventory management GraphQL service", () => {
//     let product, productId, sample_products, inventory;

//     // Utility function to initialize data
//     async function loadSampleData() {
//         // Set up test data

//         sample_products = [
//             {
//                 "pid": 1,
//                 "pcode": "ABC123",
//                 "price": 42.5,
//                 "sku": "XYZ",
//                 "amount_in_stock": 10,
//                 "pname": "Something",
//                 "description": "This is something very interesting that you want to buy.",
//                 "lang": "en_US"
//             },
//             {
//                 "pid": 2,
//                 "pcode": "FD2",
//                 "price": 99.99,
//                 "sku": "QWOP",
//                 "amount_in_stock": 100,
//                 "pname": "Speedos",
//                 "description": "I'm too lazy to write a description",
//                 "lang": "en_US"
//             }
//         ]

//         // Create the records in the database
//         console.log(`Inserting sample records`);
//         await inventory.deleteAll(); // Clear out the existing data

//         // Kind of a hack to access the other tables, replace this with models eventually
//         await inventory.repository.knex('products').insert(sample_products);
//     }

//     async function initModels() {
//         try {
//             await require('../src/configs/config');

//             // Set up all the required constants
//             const { Model } = require('../src/models/inventory-management/index');
//             return { inventory: new Model() }
//         }
//         catch (err) {
//             console.log(err.message);
//             throw err;
//         }
//     }

//     // Runs before all tests
//     before(function before() {

//         // Load the config and wait for it to load
//         initModels().then(objs => {
//             inventory = objs.inventory;

//             // Log the start of the test
//             console.log(`Starting test at ${new Date().toLocaleString()}`);

//             // Load the sample data into the database
//             loadSampleData();

//             product = {
//                 "pid": 3,
//                 "pcode": "PQR123",
//                 "price": 100,
//                 "sku": "LMN",
//                 "amount_in_stock": 20,
//                 "pname": "Watch",
//                 "description": "This is a Tissot classic watch.",
//                 "lang": "en_US"
//             };

//             // Choose a sample product id
//             productId = 3;
//         })
//     })

//     // Before each test, clear out the data
//     beforeEach(async function beforeEach() {
//         await inventory.deleteAll();
//     })

//     // Test API functionality
//     it("lists products", async () => {
//         // Check if product listing is possible
//         const res = await requestGateway.post('').send({ query: "{ products{ pid, pname }}" }).expect(200);
//         expect(res.body.data.products[0]).to.have.property("pname");
//         expect(res.body.data.products[0].pname).to.equal("Something");
//         expect(res.body.data.products[1]).to.have.property("pid");
//         expect(res.body.data.products[1].pid).to.equal(2);
//     });

//     // it("adds a product", async () => {
//     //     // Add it to the inventory, and check response
//     //     let res = await requestInventory.post('').send(product).expect(201);
//     //     expect(res.body.data).to.eql([{
//     //         pid: 3,
//     //         pname: 'Watch',
//     //         description: 'This is a Tissot classic watch.'
//     //     }]);
//     // });

//     // it("doesn't allow to add a product if id already exists", async () => {
//     //     // Add product
//     //     await requestInventory.post('').send(product).expect(201);

//     //     // Add it to the inventory, and check response
//     //     await requestInventory.post('').send(product).expect(400);
//     // });

//     // it("updates a product", async () => {
//     //     // Add product
//     //     await requestInventory.post('').send(product).expect(201);

//     //     // Initialize a product to be updated
//     //     let editProduct = {
//     //         "pid": 3,
//     //         "pcode": "BAG123",
//     //         "price": 200,
//     //         "sku": "NIKEBAG",
//     //         "amount_in_stock": 25,
//     //         "pname": "Bag",
//     //         "description": "This is a Nike bag.",
//     //         "lang": "en_US"
//     //     };
//     //     // Update the product and check response
//     //     let res = await requestInventory.put(`/${productId}`).send(editProduct).expect(200);
//     //     expect(res.body.data).to.eql([{
//     //         pid: 3,
//     //         pname: 'Bag',
//     //         description: 'This is a Nike bag.'
//     //     }]);
//     // });

//     // it("doesn't allow to update a product that doesn't exist", async () => {
//     //     // Add product
//     //     await requestInventory.post('').send(product).expect(201);

//     //     // Initialize a product to be updated that doesn't exist
//     //     let editProduct = {
//     //         "pid": 5,
//     //         "pcode": "BAG123",
//     //         "price": 200,
//     //         "sku": "NIKEBAG",
//     //         "amount_in_stock": 25,
//     //         "pname": "Bag",
//     //         "description": "This is a Nike bag.",
//     //         "lang": "en_US"
//     //     };

//     //     // Add it to the inventory, and check response
//     //     await requestInventory.put(`/${editProduct.pid}`).send(editProduct).expect(400);
//     // });

//     // it("removes a product", async () => {
//     //     // Add product
//     //     await requestInventory.post('').send(product).expect(201);
//     //     // Remove it from the inventory and check response
//     //     await requestInventory.delete(`/${productId}`).expect(200);
//     // });

//     // it("doesn't remove a product which doesn't exist", async () => {
//     //     // Add product
//     //     await requestInventory.post('').send(product).expect(201);
//     //     // Remove it from the inventory and check response
//     //     await requestInventory.delete(`/2`).expect(400);
//     // });

//     // it("retrieves a product from the given id", async () => {
//     //     // Add product
//     //     await requestInventory.post('').send(product).expect(201);
//     //     // Remove it from the inventory and check response
//     //     let res = await requestInventory.get(`/${product.pid}`).expect(200);
//     //     expect(res.body.data).to.eql([{
//     //         "products": "(3,PQR123,100,LMN,20,Watch,\"This is a Tissot classic watch.\",en_US)"
//     //     }
//     //     ]);
//     // });

//     // it("doesn't return a product which doesn't exist", async () => {
//     //     // Add product
//     //     await requestInventory.post('').send(product).expect(201);
//     //     // Remove it from the inventory and check response
//     //     await requestInventory.get(`/2`).expect(400);
//     // });

//     // Clean up after all tests are done
//     after(async function after() {
//         // Remove all products
//         await inventory.deleteAll();

//         // Remove the sample data created in before()
//         console.log("Removing sample data");
//         for (let prod of sample_products) {
//             await inventory.repository.knex('products').where({ pid: prod.pid }).del();
//         }

//         // Close the knex connection
//         inventory.repository.knex.destroy();

//         console.log("Test finished.");
//     })

// })

