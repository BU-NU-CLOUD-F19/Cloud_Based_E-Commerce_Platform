# GraphQL API Gateway for a microservices architecture

Main file: src/index.js

## Installation

### Booting up the products microservice

To run this demo locally:

Navigate to the root directory of the application

```bash
docker-compose up -d
```

This will run the containers in the background

The API Gateway runs on http://localhost:3050 <br />
The boilerplate runs on http://localhost:3000
<br />
The products microservice runs on http://localhost:4001

## Testing by making API requests

Open up http://localhost:3050 on the browser to view the GraphQL playground for making API requests
Write queries (for example):

```
{
  member(id: 1){
    id
    name
  }
}
```

```
{
   products{
    weight
    name
   }
}
```

```
{
  product(id: "1") {
    name
    weight
  }
}
```

to receive a JSON response for the given request

The API gateway makes use of the running microservices to create an overall composed schema which can be queried
