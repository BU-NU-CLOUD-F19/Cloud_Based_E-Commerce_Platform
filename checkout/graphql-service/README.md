# GraphQL service for the checkout microservice

Main file: index.js

- The apollo server for the checkout microservice takes requests from the API Gateway and hits the RESTful API using the RESTDataSource
- The RESTDataSource returns the response from the RESTful API to the Apollo server for the checkout microservice
- The apollo server for the checkout microservice returns the response back to the API Gateway

### index.js

This file creates an Apollo Server for the checkout microservice and defines the GraphQL schema and resolvers for the service which will be used to communicate with the GraphQL API gateway.

#### GraphQL schema
* **type**: *OrderDetails* - Describes the details of an order 
* **type**: *CompleteCheckoutSuccess* - Contains the message for a successful request and order details
* **type**: *SuccessMessage* - Contains the message for a successful request
* **type**: *Mutation* - Write requests to the REST API
  * *beginCheckout(id, sid, uid, password)* - Starts a checkout
  * *completeCheckout(id, sid, uid, password)* - Completes the checkout after payment
  * *abortCheckout(id, sid, uid, password)* - Cancel a checkout

### datasource.js

- This file declares a data source for linking the GraphQL schema of the checkout microservice with its RESTful API
- RESTDataSources are used for fetching and caching data from the RESTful endpoints
