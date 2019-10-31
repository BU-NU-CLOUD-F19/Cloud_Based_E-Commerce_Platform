# Shopping Cart Microservice
This microservice provides REST API endpoints for a shopping cart, and integrates with the PostgreSQL database.

## Class Documentation
[Here is the online documentation.](/docs/cart)

## REST API
### POST /cart/{id}
#### Purpose
Add a new product to a cart (automatically creates a new cart if it doesn't exist).

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

Example:

```json
{
  "message": "Product added to cart.",
  "data": [
    {
      "amount_in_cart": 1,
      "pid": 1
    }
  ]
}
```

Errors:

* 400: bad request (e.g. empty request body, or required data not present)
* 403: forbidden, the cart is locked

### PUT /cart/{id}/remove
#### Purpose
Remove a product from a cart.

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

Example:

```json
{
  "message": "Product added to cart.",
  "data": 1
}
```

Errors:

* 400: bad request (e.g. empty request body, or required data not preset)
* 403: forbidden, the cart is locked

### PUT '/cart/{id}/empty'
#### Purpose
Empty the cart, removing all products.

#### Request body
Empty.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `data`: on a successful request, a number denoting the number of products removed.

Example:

```json
{
  "message": "Cart emptied.",
  "data": 1
}
```

Errors:

* 400: bad request (e.g. cart does not exist)
* 403: forbidden, the cart is locked

### PUT '/cart/{id}'
#### Purpose
Change the amount of a product in the cart.

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

Example:

```json
{
  "message": "Amount updated.",
  "data": [
    {
      "amount_in_cart": 3,
      "pid": 1
    }
  ]
}
```

Errors:

* 400: bad request (e.g. product not present in cart)
* 403: forbidden, the cart is locked

### GET /cart/{id}
#### Purpose
List the products in the cart.

#### Request body
Empty.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `data`: on a successful request, an array containing elements with:
  * `pid`: id of each product
  * `amount_in_cart`: amount of each product that is in the cart

Example:

```json
{
  "message": "Products retrieved.",
  "data": [
    {
      "amount_in_cart": 3,
      "pid": 1
    }
  ]
}
```

### DELETE '/cart/{id}'
#### Purpose
Delete a cart and all products in it.

#### Request body
None.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request

Example:

```json
{
  "message": "Cart deleted."
}
```

Errors:

* 400: bad request (e.g. cart does not exist)
* 403: forbidden, the cart is locked

### DELETE '/cart/{id}'
#### Purpose
Delete a cart and all products in it.

#### Request body
None.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request

Example:

```json
{
  "message": "Cart deleted."
}
```

Errors:

* 400: bad request (e.g. cart does not exist)
* 403: forbidden, the cart is locked


### PUT '/cart/{id}/lock'
#### Purpose
Lock a cart, preventing any modification.

#### Request body
None.

#### Response
**Status code**: 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request

Example:

```json
{
  "message": "Cart locked."
}
```

### DELETE '/cart/{id}/lock'
#### Purpose
Unlock a previously locked cart.

#### Request body
None.

#### Response
**Status code:** 200.

**Body**: a JSON object containing

* `message`: a message regarding the status of the request

Example:

```json
{
  "message": "Cart unlocked."
}
```

### GET '/cart/{id}/lock'
#### Purpose
Get the status of the lock on the cart (locked or not).

#### Request body
None.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `data`: a JSON object containing:
  * `locked`: a boolean value indicating whether the cart is locked

Example:

```json
{
  "message": "Cart status retrieved.",
  "data": {
    "locked": false
  }
}
```
