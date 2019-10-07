# Apollo server for the members microservice created by the boilerplate

Main file: index.js

- The apollo server for the members microservice takes requests from the API Gateway and hits the RESTful API for the demo microservice using the RESTDataSource
- The RESTDataSource returns the response from the RESTful API to the Apollo server for the members microservice
- The apollo server for the members microservice returns the response back to the API Gateway

### index.js

---

This file creates an Apollo Server for the members microservice and defines the GraphQL schema and resolvers for the service which will be used to communicate with the GraphQL API gateway.

### datasource.js

---

- This file declares a data source for linking the GraphQL schema of the members microservice with its RESTful API
- RESTDataSources are used for fetching and caching data from the RESTful endpoints
