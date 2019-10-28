# Inventory Management Microservice
This microservice provides REST API endpoints for an inventory, and integrates with the PostgreSQL database.

## REST API
### POST /inventory
#### Purpose
Add a new product to the inventory.

#### Request body
A JSON object containing

* `pid` (a number referring to the id of a product)
* `pcode` (a unique code identifying the product)
* `price` (the price of the product)
* `sku` (the stock keeping unit of the product)
* `amount_in_stock` (quantity of the product in the stock)
* `pname` (name of the product)
* `description` (description of the product)
* `lang` (language of the details of the product)

Example:

```json
{
  "pid": 1,
  "pcode": "ABC",
  "price": 10,
  "sku": "XYZ123",
  "amount_in_stock": 100,
  "pname": "Name",
  "description": "Description",
  "lang": "en_US"
}
```

#### Response
**Status code:** 201.

**Body:** a JSON object containing

* `data`: on a successful request, an array containing elements with:
  * `pid`: id of the added product
  * `pname`: name of the added product
  * `description`: description of the product

Example:

```json
{
  "data": [
    {
      "pid": 1,
      "pname": "Name",
      "description": "Description"
    }
  ]
}
```

Errors:

* 400: bad request (e.g. empty request body, or product already present)

### PUT /inventory/{id}
#### Purpose
Update a product in the inventory.

#### Request body
A JSON object containing

* `pid` (a number referring to the id of a product)
* `pcode` (a unique code identifying the product)
* `price` (the price of the product)
* `sku` (the stock keeping unit of the product)
* `amount_in_stock` (quantity of the product in the stock)
* `pname` (name of the product)
* `description` (description of the product)
* `lang` (language of the details of the product)

Example:

```json
{
  "pid": 1,
  "pcode": "ABC",
  "price": 10,
  "sku": "XYZ123",
  "amount_in_stock": 100,
  "pname": "Name",
  "description": "Description",
  "lang": "en_US"
}
```

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `data`: on a successful request, an array containing elements with:
  * `pid`: id of the added product
  * `pname`: name of the added product
  * `description`: description of the product

Example:

```json
{
  "message": "Product updated.",
  "data": [
    {
      "pid": 1,
      "pname": "Name",
      "description": "Description"
    }
  ]
}
```

Errors:

* 400: bad request (e.g. empty request body, or wrong product ID)

### GET /inventory/{id}
#### Purpose
List the product with a given ID in the inventory.

#### Request body
Empty.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `data`: on a successful request, an array containing elements with:
  * `products`: details of the product

Example:

```json
{
  "data": [
    {
      "products": "(2,3a,10,abc_sku,10,jaguar,\"my jaguar\",english)"
    }
  ]
}
```

Errors:

* 400: bad request (e.g. product not found)

### GET /inventory
#### Purpose
List all products in the inventory.

#### Request body
Empty.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `data`: on a successful request, an array containing elements with:
  * `products`: details of the products

Example:

```json
{
  "data": [
    {
      "products": "(2,3a,10,abc_sku,10,jaguar,\"my jaguar\",english)"
    }
  ]
}
```

### DELETE '/inventory/{id}'
#### Purpose
Delete a product from the inventory

#### Request body
None.

#### Response
**Status code:** 200.

**Body:** a JSON object containing

* `message`: a message regarding the status of the request
* `data`: number of elements deleted

Example:

```json
{
  "message": "Product deleted.",
  "data": 1
}
```

Errors:

* 400: bad request (e.g. product does not exist)

