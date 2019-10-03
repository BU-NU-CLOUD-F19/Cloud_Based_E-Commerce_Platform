# Apollo server for the products microservice

Main file: index.js

- The apollo server for the products microservice takes requests from the API Gateway and hits the RESTful API for the products microservice using the RESTDataSource
- The RESTDataSource returns the response from the RESTful API to the apollo server for the products microservice
- The apollo server for the products microservice returns the response back to the API Gateway

### index.js

---

This file creates an Apollo Server for the products microservice and defines the GraphQL schema and resolvers for the service which will be used to communicate with the GraphQL API gateway.

### products-datasource.js

---

- This file declares a data source for linking the GraphQL schema of the products microservice with its RESTful API
- RESTDataSources are used for fetching and caching data from the RESTful endpoints

### products-api.js

---

This file creates a simple RESTful API for the products microservice and declares a products array with data for testing the API.
