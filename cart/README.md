# Shopping Cart Microservice
This microservice provides REST API endpoints for a shopping cart, and integrates with the PostgreSQL database.

## REST API
### POST /cart/{id}
#### Purpose
Add a new product to a cart (automatically creates a new cart if it doesn't exist).

#### Request parameters
Requests are authenticated using URL parameters.
When creating a guest cart, no authentication needs to be provided, as a new guest ID will automatically be generated and returned in the response.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID


#### Request body
A JSON object containing

* `pid` (a number referring to the id of a product)
* `amount_in_cart` (the amount of this product in the cart)

Example:

```json
{
  "pid": 1,
  "amount_in_cart": 1
}
```

#### Response
**Status code:** 201.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `data`: on a successful request, an array containing elements with:
  * `pid`: id of the added product
  * `amount_in_cart`: the amount added to the cart
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID

Example:

```json
{
  "message": "Product added to cart.",
  "data": [
    {
      "amount_in_cart": 1,
      "pid": 1
    }
  ],
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }

}
```

Errors:

* 400: bad request (e.g. empty request body, or required data not present)
* 403: forbidden, the cart is locked or the user is not authenticated

### PUT /cart/{id}/remove
#### Purpose
Remove a product from a cart.

#### Request parameters
Requests are authenticated using URL parameters.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID

#### Request body
A JSON object containing

* `pid` (a number referring to the id of a product)

Example:

```json
{
  "pid": 1,
}
```

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `data`: on a successful request, contains a number denoting the number of products removed
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID


Example:

```json
{
  "message": "Product added to cart.",
  "data": 1,
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }
}
```

Errors:

* 400: bad request (e.g. empty request body, or required data not preset)
* 403: forbidden, the cart is locked

### PUT '/cart/{id}/empty'
#### Purpose
Empty the cart, removing all products.

#### Request parameters
Requests are authenticated using URL parameters.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID

#### Request body
Empty.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `data`: on a successful request, a number denoting the number of products removed.
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID


Example:

```json
{
  "message": "Cart emptied.",
  "data": 1,
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }
}
```

Errors:

* 400: bad request (e.g. cart does not exist)
* 403: forbidden, the cart is locked

### PUT '/cart/{id}'
#### Purpose
Change the amount of a product in the cart.

#### Request parameters
Requests are authenticated using URL parameters.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID

#### Request body
A JSON object containing

* `pid` (a number referring to the id of a product)
* `amount_in_cart` (the new amount of this product in the cart)

Example:

```json
{
  "pid": 1,
  "amount_in_cart": 3
}
```

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `data`: on a successful request, an array containing elements with:
  * `pid`: id of the changed product
  * `amount_in_cart`: the new amount
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID


Example:

```json
{
  "message": "Amount updated.",
  "data": [
    {
      "amount_in_cart": 3,
      "pid": 1
    }
  ],
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }
}
```

Errors:

* 400: bad request (e.g. product not present in cart)
* 403: forbidden, the cart is locked

### GET /cart/{id}
#### Purpose
List the products in the cart.

#### Request parameters
Requests are authenticated using URL parameters.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID

#### Request body
Empty.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `data`: on a successful request, an array containing elements with:
  * `pid`: id of each product
  * `amount_in_cart`: amount of each product that is in the cart
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID


Example:

```json
{
  "message": "Products retrieved.",
  "data": [
    {
      "amount_in_cart": 3,
      "pid": 1
    }
  ],
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }
}
```

### DELETE '/cart/{id}'
#### Purpose
Delete a cart and all products in it.

#### Request parameters
Requests are authenticated using URL parameters.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID

#### Request body
None.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID


Example:

```json
{
  "message": "Cart deleted.",
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }
}
```

Errors:

* 400: bad request (e.g. cart does not exist)
* 403: forbidden, the cart is locked

### DELETE '/cart/{id}'
#### Purpose
Delete a cart and all products in it.

#### Request parameters
Requests are authenticated using URL parameters.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID

#### Request body
None.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID


Example:

```json
{
  "message": "Cart deleted.",
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }
}
```

Errors:

* 400: bad request (e.g. cart does not exist)
* 403: forbidden, the cart is locked


### PUT '/cart/{id}/lock'
#### Purpose
Lock a cart, preventing any modification.

#### Request parameters
Requests are authenticated using URL parameters.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID

#### Request body
None.

#### Response
**Status code**: 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID


Example:

```json
{
  "message": "Cart locked.",
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }
}
```

### DELETE '/cart/{id}/lock'
#### Purpose
Unlock a previously locked cart.

#### Request parameters
Requests are authenticated using URL parameters.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID

#### Request body
None.

#### Response
**Status code:** 200.

**Body**: a JSON object containing

* `message`: a message regarding the status of the request
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID


Example:

```json
{
  "message": "Cart unlocked.",
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }
}
```

### GET '/cart/{id}/lock'
#### Purpose
Get the status of the lock on the cart (locked or not).

#### Request parameters
Requests are authenticated using URL parameters.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID

#### Request body
None.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `data`: a JSON object containing:
  * `locked`: a boolean value indicating whether the cart is locked
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID


Example:

```json
{
  "message": "Cart status retrieved.",
  "data": {
    "locked": false
  },
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }
}
```

### PUT '/cart/{id}/checkout'
#### Purpose
Begin the checkout of a cart (add the checkout start time and lock the cart).

#### Request parameters
Requests are authenticated using URL parameters.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID


#### Request body
None.

#### Response
**Status code**: 200.

**Body**: a JSON object containing

* `message`: a message regarding the status of the request
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID

Example:

```json
{
  "message": "Checkout started.",
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }
}
```

### DELETE 'cart/{id}/checkout'
#### Purpose
Finish the checkout of a cart (remove the checkout start time, lock the cart).

#### Request parameters
Requests are authenticated using URL parameters.

For a guest cart:

* `sid`: the session ID, for a guest user

For a registered user's cart:

* `uid`: the registered user's ID

#### Request body
None.

#### Response
**Status code**: 200.

**Body**: a JSON object containing

* `message`: a message regarding the status of the request
* `auth`: the object containing authentication information
  * `authorized`: a boolean indicating whether the user is authorized
  * `as`: a string denoting the user's authorization type, either 'guest' or 'reguser'
  * `uid`: the user ID, will either be a guest ID or a registered user ID

Example:

```json
{
  "message": "Checkout finished.",
  "auth": {
    "authorized": true,
    "uid": "-MVuylsR",
    "as": "guest"
  }
}
```
