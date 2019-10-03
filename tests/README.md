# REST API and GraphQL API Gateway testing

Main file: api.test.js

If you have already started the servers for microservices and the API Gateway, navigate to the [Running Tests](#tests) section

## Booting up the microservices and the API Gateway

To run this demo locally:

Navigate to the root directory of the application

```bash
docker-compose up -d
```

## <a name="tests">Running Tests

</a>

In another terminal:

```bash
npm install
```

This will install all of the dependencies required

```bash
npm test
```

This command will run the tests found under all files with the '.test' extension in the tests directory
