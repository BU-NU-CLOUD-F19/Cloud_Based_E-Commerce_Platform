# Checkout Microservice
Uses the cart, authentication, database, and inventory microservices to provide checkout functionality.

Documentation is provided through Swagger.

## REST API
### POST /checkout/{id}
#### Purpose
Begin a checkout on a shopping cart, specified by the id.

#### Request body
A JSON object containing

* for a guest checkout:
  * `sid`: the guest session ID
* for a registered user checkout:
  * `uid`: the user's ID
  * `password`: the user's password

Example:

```json
{
  "sid": "-MVuylsR"
}
```

#### Response
**Status code:** 200

**Body:** a JSON object containing

* `message`: a message detailing the status of the request

Example:

```json
{
  "message": "Checkout initiated successfully."
}
```

Errors:

* 400: bad request (e.g. empty request body, or required data not present)
* 403: unauthorized, cannot modify the cart as current user

### PUT /checkout/{id}
#### Purpose
Finalize a checkout on a cart, specified by the id, e.g. when pressing the "buy" button.

#### Request body
A JSON object containing

* for a guest checkout:
  * `sid`: the guest session ID
* for a registered user checkout:
  * `uid`: the user's ID
  * `password`: the user's password

Example:

```json
{
  "sid": "-MVuylsR"
}
```

#### Response
**Status code:** 201

**Body:** a JSON object containing

* `message`: a message detailing the status of the request
* `data`: on successful completion, the details of the newly created order
  * `oid`: the order id
  * `total_price`: the total price of the products in the cart
  * `shipping`: the shipping price of the cart
  * `date`: the timestamp when the order was created
  * `destination`: where the order will be sent
  * `uid`: the user/session ID of whoever placed the order

Example:

```json
{
  "message": "Checkout complete",
  "data": {
    "oid": 1,
    "total_price": 1127.4,
    "date": "2019-12-02T19:18:32.439Z",
    "destination": "Easter Island",
    "shipping": 42,
    "uid": "guIttDP-"
  }
}
```

Errors:

* 400: bad request (e.g. empty request body, or required data not present, or no checkout in progress)
* 403: unauthorized, cannot modify the cart as current user

### DELETE /checkout/{id}
#### Purpose
Abort a checkout on a cart, specified by the id.

#### Request body
A JSON object containing

* for a guest checkout:
  * `sid`: the guest session ID
* for a registered user checkout:
  * `uid`: the user's ID
  * `password`: the user's password

Example:

```json
{
  "sid": "-MVuylsR"
}
```

#### Response
**Status code:** 200

**Body:** a JSON object containing

* `message`: a message detailing the status of the request

Example:

```json
{
  "message": "Checkout aborted"
}
```

Errors:

* 400: bad request (e.g. empty request body, or required data not present, or no checkout in progress)
* 403: 
