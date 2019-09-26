NodeJS_Boilerplate_for_microservices
====================================

## Overview

This package serves as the boilerplate for all the Node services to be built for the `Cloud based E-commerce Platform` project.

Prerequisites:

1. Postgres docker container up and running
2. Set up `cloud-demo` db and create `demo` table
3. Create a column called `id` as integer, `name` as varchar and populate table with value 1, 'DC'

To start this service:

1. From terminal:

```code

$ cd boilerplate
$ npm i
$ npm start
```

2. Via Docker:

```code

$ docker build -t <image-name> . // run it everytime you make changes to the code
$ docker run --name <container-name> -p 0.0.0.0:3000:3000 -v ${PWD}/log:/usr/app/log -d <image-name>
```
Note: $(pwd) should be replaced by ${PWD} if running on windows


Now go to browser and hit: `http://localhost:3000/demo/1`

You should be able to see this json:

```json

{"id": 1, "name": "DC"}
```

The main purpose of this service is to provide you with the basic scripts required to start developing a microservice.

The file-structure explained:

1. `src` - contains the source code of the application

2. `src/configs` - contains all the configuration required for this project

3. `src/constants` - contains the constants to be used throughout the application

4. `src/endpoints` - contains all the routes and handlers to be registered on the server.

5. `src/models` - contains the business logic to process data to be stored/retrieved.

6. `src/repository` - contains the wrapper classes to talk to the database.

7. `src/utils` - contains the utility scripts required in the application (generally contains logger).

8. `app.js` -  the server configuration file for the application (changes should be as minimal to this as possible).

9. `Dockerfile` - contains the configuration required to generate docker image for this application.

10. `registrations` - contains a list of the routes to be plugged into the server (should contain all the subfolders of `src/endpoints` folder).

11. `process.json` - defines pm2 process to be executed. (don't change this file unless required)

12. `.apirc` - contains system-wide configuration to be used throughout the service. Should be copied to root folder when running locally.

## Packages

* `elv` - we use this package for `elv.coalesce` to pick the first non-null value out of the list of values

For more details refer the relevant file in the folders.
