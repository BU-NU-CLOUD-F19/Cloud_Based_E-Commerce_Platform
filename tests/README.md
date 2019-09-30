# REST API and GraphQL API Gateway testing

Main file: api.test.js

If you have already started the servers for microservices and the API Gateway, navigate to the [Running Tests](#tests) section

## Booting up the products microservice

To run this demo locally:

Navigate to the root directory of the application

```bash
cd products
```

```bash
npm install
```

This will install all of the dependencies for the product

```bash
npm run start-products
```

This command will start up the Apollo Server for the products service which utilises data sources to communicate with the REST API and will also run the REST API server concurrently.
The servers will run on http://localhost:4001 and http://localhost:4050 respectively

## Booting up the GraphQL API Gateway

In another terminal,

```bash
cd ../graphql-api-gateway-poc/
```

```bash
npm install
```

This will install all of the dependencies for the gateway

```bash
npm run start-gateway
```

This command will start the GraphQL API gateway
This will start up the gateway and serve it at http://localhost:3000

## <a name="tests">Running Tests

</a>

In another terminal:

```bash
npm install
```

This will install all of the dependencies required

```bash
npm test
```

This command will run the tests found under all files with the '.test' extension in the tests directory
