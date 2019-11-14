Authentication Microservice
===========================

(Requires modification for future use)

## Overview

This package plays role of user-authenticator to be built for the `Cloud based E-commerce Platform` project.

Prerequisites:

1. Create an project on Google Firebase.
2. Download credentials for that project. (should be a json file)
3. Replace the appropriate firebase database url.
4. Use a token generator to get a firebase token. Use this as Bearer Token when making requests
5. Edit `schema.sql` if required in future. Have Postgres docker container up and running ( run `docker-compose up -d`)

To start this service, use the docker-compose file in the root of the repository:

For API documentation, go to browser and hit: `http://localhost:4050/documentation`

You should be able to see a swagger json documentation page.

The main purpose of this service is to provide you with a authenticator for user requests.

These are the models in this service:

1. `users` - contains all the user related information

2. `stores` - contains all the store related information

3. `security-groups` - contains different access level

4. `memberships` - contains membership of users in the stores

5. `user-security-groups` - contains user access level in thestore

6. `src/repository` - contains the wrapper classes to talk to the database.
7. `src/utils` - contains the utility scripts required in the application (generally contains logger).

8. `app.js` -  the server configuration file for the application (changes should be as minimal to this as possible).

9. `Dockerfile` - contains the configuration required to generate docker image for this application.

10. `registrations` - contains a list of the routes to be plugged into the server (should contain all the subfolders of `src/endpoints` folder).

11. `process.json` - defines pm2 process to be executed. (don't change this file unless required)

12. `.authenticationrc` - contains system-wide configuration to be used throughout the service. Should be copied to root folder when running locally. `.authenticationtestrc` is used for test environment.

13. `auth.js` - contains setup for firbase admin

## Packages

* `elv` - we use this package for `elv.coalesce` to pick the first non-null value out of the list of values
* `hapi-firebase-auth` - to integrate Firebase with Hapi
  
For more details refer the relevant file in the folders.
