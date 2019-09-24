NodeJS_Boilerplate_for_microservices
====================================

## Overview

This package serves as the boilerplate for all the Node services to be built for the `Cloud based E-commerce Platform` project.

To start this service:

```code

$ cd boilerplate
$ npm i
$ npm start
```

Now go to browser and hit: `http://localhost:3000/demo/123`

You should be able to see this json:

```json

{"data":"123"}
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

For more details refer the relevant file in the folders.
