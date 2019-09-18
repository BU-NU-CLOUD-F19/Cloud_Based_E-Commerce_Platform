# GraphQL API Gateway for a microservices architecture

Main file: src/index.js

## Installation

To run this demo locally:

```bash
cd graphql-api-gateway-poc
```

```bash
npm install
```

This will install all of the dependencies for the gateway and each underlying service.

```bash
npm run start-service-products
```

This command will run the demo microservice called products
It can be found at http://localhost:4001

In another terminal window, run the API Gateway by running the command

```bash
npm run start-gateway
```

This will start up the gateway and serve it at http://localhost:3000

## Testing by making API requests

Open up http://localhost:3000 on the browser to view the GraphQL playground for making API requests
Write a query (for example:

```
Query:
{
   myProducts{
    weight
    name
   }
}
```

) to receive a JSON response for the given request

The API gateway makes use of the running microservices to create an overall composed schema which can be queried

```

```
