# GraphQL API Gateway for a microservices architecture

Main file: src/index.js

- The GraphQL API Gateway will be the entrypoint to all requests made by the client to each microservice of the platform
- Each microservice will have an Apollo server running that will be linked to the RESTful API of that microservice with the help of RESTDataSources from Apollo
- The Gateway will redirect the request from the client on the basis of the query made to the correct microservice
- The Apollo server of that microservice will then return the desired result back to the gateway to be returned to the client

### Booting up the products microservice

To run this demo locally:

Navigate to the root directory of the application

```bash
docker-compose up -d
```

This will run the containers in the background

The API Gateway runs on http://localhost:3050 <br />
The boilerplate runs on http://localhost:3000

## Testing by making API requests

---

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

to receive a JSON response for the given request

The API gateway makes use of the running microservices to create an overall composed schema which can be queried
