# GraphQL API Gateway for a microservices architecture

Main file: src/index.js

- The GraphQL API Gateway will be the entrypoint to all requests made by the client to each microservice of the platform
- Each microservice will have an Apollo server running that will be linked to the RESTful API of that microservice with the help of RESTDataSources from Apollo
- The Gateway will redirect the request from the client on the basis of the query made to the correct microservice
- The Apollo server of that microservice will then return the desired result back to the gateway to be returned to the client

The API Gateway runs on http://localhost:3050

## Testing by making API requests

---

Open up http://localhost:3050 on the browser to view the GraphQL playground for making API requests
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
