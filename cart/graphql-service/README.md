# GraphQL service for the cart microservice

Main file: index.js

- The apollo server for the cart microservice takes requests from the API Gateway and hits the RESTful API using the RESTDataSource
- The RESTDataSource returns the response from the RESTful API to the Apollo server for the cart microservice
- The apollo server for the cart microservice returns the response back to the API Gateway

### index.js

This file creates an Apollo Server for the cart microservice and defines the GraphQL schema and resolvers for the service which will be used to communicate with the GraphQL API gateway.

#### GraphQL schema
* **input**: *ProductInCart* - Contains fields that describe a product in a cart
* **input**: *ProductID* - ID of a product 
* **type**: *ProductInfo* - Describes a product in a cart 
* **type**: *RemoveProductSuccess* - Describes the response of a remove product request
* **type**: *GetProductSuccess* - Describes the response of a retrieve product request
* **type**: *DeleteCartSuccess* - Message containing the response of a Delete Cart Request
* **type**: *Query* - Read requests to the REST API
  * *getProducts(id, sid, uid, password)* - Returns all products in a cart with given ID
  * *getLockStatus(id, sid, uid, password)*: Returns the lock status of a cart with given ID
* **type**: *Mutation* - Write requests to the REST API
  * *addProductToCart(id, product, sid, uid, password)* - Adds a product to cart
  * *removeProduct(id, productId, sid, uid, password)* - Removes a product from cart
  * *emptyCart(id, sid, uid, password)* - Removes all contents of a cart
  * *changeAmount(id, product, sid, uid, password)* - Changes the amount of a product in cart
  * *deleteCart(id, sid, uid, password)* - Deletes a cart with given ID
  * *lockCart(id, sid, uid, password)*: Locks a cart with the given ID
  * *unlockCart(id, sid, uid, password)*: Unlocks a cart with the given ID

### datasource.js

- This file declares a data source for linking the GraphQL schema of the cart microservice with its RESTful API
- RESTDataSources are used for fetching and caching data from the RESTful endpoints
