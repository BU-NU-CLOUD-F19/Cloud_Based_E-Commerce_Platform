# GraphQL API Gateway for a microservices architecture

Main file: src/index.js

- The GraphQL API Gateway will be the entrypoint to all requests made by the client to each microservice of the platform
- Each microservice will have an Apollo server running that will be linked to the RESTful API of that microservice with the help of RESTDataSources from Apollo
- The Gateway will redirect the request from the client on the basis of the query made to the correct microservice
- The Apollo server of that microservice will then return the desired result back to the gateway to be returned to the client

The API Gateway runs on http://localhost:3050

## API Gateway queries

Open up http://localhost:3050 on the browser to view the GraphQL playground for making API requests.
All possible queries and mutations for making requests to the gateway are as follows:

### Requests made to the `cart` microservice: 

* *Queries* - Read requests to the REST API
  * *getProducts(id, sid, uid, password)* - Returns all products in a cart with given ID
  * *getLockStatus(id, sid, uid, password)*: Returns the lock status of a cart with given ID
* *Mutations* - Write requests to the REST API
  * *addProductToCart(id, product, sid, uid, password)* - Adds a product to cart
  * *removeProduct(id, productId, sid, uid, password)* - Removes a product from cart
  * *emptyCart(id, sid, uid, password)* - Removes all contents of a cart
  * *changeAmount(id, product, sid, uid, password)* - Changes the amount of a product in cart
  * *deleteCart(id, sid, uid, password)* - Deletes a cart with given ID
  * *lockCart(id, sid, uid, password)*: Locks a cart with the given ID
  * *unlockCart(id, sid, uid, password)*: Unlocks a cart with the given ID

### Requests made to the `checkout` microservice: 

* *Mutations* - Write requests to the REST API
  * *beginCheckout(id, sid, uid, password)* - Starts a checkout
  * *completeCheckout(id, sid, uid, password)* - Completes the checkout after payment
  * *abortCheckout(id, sid, uid, password)* - Cancel a checkout

### Requests made to the `inventory-management` microservice: 

* *Queries* - Read requests to the REST API
  * *products* - Returns all products in inventory
  * *product(id)* - Returns product with given ID
* *Mutations* - Write requests to the REST API
  * *addProduct(product)* - Adds a product to inventory
  * *updateProduct(id, product)* - Updates a product with given ID
  * *deleteProduct(id)* - Deletes a product with given ID

## Microservice design for integration with gateway 

The architecture developed closely follows [Apollo Federation](https://blog.apollographql.com/apollo-federation-f260cf525d21) which is the suggested architecture for building a microservices application with a GraphQL API Gateway.

* Every microservice runs on an Apollo Server. A GraphQL schema is defined for each microservice along with resolvers that handle the client requests. In order to create an Apollo server for a microservice, a valid GraphQL schema and resolvers need to be provided to the server
* The API Gateway interacts with the Apollo servers of the microservices. It maintains a list of the services that are running on the Apollo servers 
* The GraphQL schemas that are a part of the Apollo servers are used by the gateway to figure out which client request needs to be directed to which microservice
* Once the Apollo server of a microservice receives a request from the gateway, there are resolvers for each request that take in the request body and pass it on to the REST Datasource of the microservice. 
* These REST datasources interact with the REST API of the microservice. The response from the REST API is sent back to the Apollo server of the microservice which is sent to the API Gateway and back to the client

Using this architecture, true modularity is achieved with independent GraphQL services for each microservice and individual REST datasources for integration with the REST API of the microservices. 

### Requirement of a separate Apollo server for each microservice

* In order to implement a GraphQL API gateway with microservices accorrding to the architecture of [Apollo Federation](https://blog.apollographql.com/apollo-federation-f260cf525d21), federated services which are standalone GraphQL APIs are required by the API Gateway
* The gateway utilises the GraphQL schema from these services to decide which request should be directed to which microservice. It crunches the schemas from all of these services into a single schema
* These federated services are implemented to achieve true separation of concerns in a microservices architecture and are essential to build a complete schema to connect all data with a distributed architecture
* In order to implement these federated services (GraphQL APIs), an Apollo server is utilized for each separate service
