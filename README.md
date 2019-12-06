Cloud-Based E-Commerce Platform
====================================

[![Build Status](https://travis-ci.org/BU-NU-CLOUD-F19/Cloud_Based_E-Commerce_Platform.svg?branch=master)](https://travis-ci.org/BU-NU-CLOUD-F19/Cloud_Based_E-Commerce_Platform)

Final video presentation: [YouTube](https://www.youtube.com/watch?v=JOQbcbfGPTE) and [mirror on Google Drive](https://drive.google.com/open?id=1p4tRmXGq7TN64me3glDuFlAmBGuvHNKX).

## 1. The developed product
We have developed a number of microservices, each with its own directory in this repository.

### How to run

* __Run in Local Enviroment:__

To bring up the stack locally, make sure you have [Docker](https://docker.io/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.
Then, clone this repository.

Make sure you are in the root folder, and run `docker-compose up -d` on the command line.
This will start all of the microservices.

Alternatively, you can run `docker-compose up -d [service_name]` to start only a specific service.
Be aware that some services depend on each other, as specified in the Docker Compose file, so starting a single service may in fact bring up more than one container.

The barebones user interface is not in a container, as it was only created for demonstration purposes.
To 'run' it, it's enough to open the HTML file in your browser.
Internet connection is required, as it uses jQuery from a remote CDN.

* __Deploy on Google Cloud Platform via Kubernetes:__

Please follow the steps laid out in [Readme.md](kubernetes-cluster/Readme.md) in `kubernetes-cluster` folder.


### How to test
Every Node-based microservice has unit tests, which you can run with `docker exec -it [container_name] npm test`.

### Where to find information
Our design documents are in the `docs/` folder.

Each microservice has its own README file:

* [API Gateway](api-gateway/README.md)
* [Authentication](authentication/README.md)
* [Shopping Cart](cart/README.md)
* [Checkout](checkout/README.md)
* [Database](db/README.md)
* [Inventory Management](inventory-management/README.md)

Furthermore, each microservice that exposes a REST API has web-based documentation at the endpoint `http://[service-IP]:[service-port]/documentation`.
When running locally, the service IP will be localhost.

The ports and hostnames of microservices are specified in the `.env` file in the root of the project.

For convenience, the ports are also listed here:

| Service name                  | Port |
|-------------------------------|------|
| Postgres Service              | 5432 |
| Pgadmin Service               | 5050 |
| Shopping Cart Service         | 3000 |
| Checkout Service              | 3010 |
| Inventory Service             | 3020 |
| API Gateway Service           | 3050 |
| Inventory GraphQL Service     | 6000 |
| Shopping Cart GraphQL Service | 6050 |
| Checkout GraphQL Service      | 7000 |
| Authentication Service        | 4050 |

## 2. Vision and Goals Of The Project:
This project is an open-source, cloud based e-commerce solution that enables entrepreneurs to leverage this platform for individual or business purposes.
The vision for this project is one of headless design, with the front-end and back-end entirely independent from each other.
This would make the system more flexible for developers and for business operators alike, compared to the currently available alternatives.

The platform should be entirely flexible, modular and scalable in nature.
The API-driven architecture would make it a modern, high performing tech stack that easily integrates with external services or technologies.
The platform would enable shopper event data, unlock insights across sales channels, and manage sales performance in real time.

The high-level goals include:

* End-to-end user experience, from product selection to payment and order confirmation
* Enabling entrepreneurs to host their own businesses using this platform and create an e-commerce store
* Complete flexibility, modularity, and scalability
* Independence of front-end and back-end code
* Open-source code and transparency
* A simple UI to demonstrate the core functionality

## 3. Users/Personas Of The Project:
The e-commerce platform will be used by:

* Entrepreneurs hosting their business on the platform, who will use either the full stack of offered functionality, or specific modules
* Businesses who would want to further customize the open-source code for their specific needs
* Sales and marketing teams for analytics and to improve sales
* End-users of the business created by an entrepreneur, who will use the e-commerce system for orders and payment.

It does not target developers directly, although the modular nature of the system will make it easier for developers to integrate its services in other applications.

Furthermore, the system would have hooks to support different languages, so it would be region-independent.

## 4. Scope and Features Of The Project:
The main goal of this project is to develop a robust back-end which can support multiple front-ends; in particular any front-end development will be solely for testing and demonstration.

Core features:

* User management & authentication: creating/deleting an account
* Product sales
  * Product listing
  * Shopping cart functionality (guest & authenticated)
  * Automatic sweeping of abandoned checkouts after 10 min.
  * Placing orders/cart checkout functionality
* Inventory management
* Back-end
  * Secure authentication
  * Messaging queues
  * Scalability to support increase/decrease in load
  * Ability to operate across multiple businesses
  * Containerization
  * Per-microservice logging system

Additional future features, stretch goals for the project:

* User management: signing in/out, profile management
* Product sales:
  * Search
  * Cancelling orders
  * Transactions
  * Shipping & Tax calculator
  * Returns management
  * CRM system to send transactional emails
  * Integration with third-party payment services
* Recommendation systems
* Analytics
* Improved security
  * Secure user data storage
  * Better way to lock a cart (currently only using a boolean column in the database)
* Accounting
* Admin dashboards
* Centralised logging via Apache Kafka

## 5. Solution Concept
A short description of the system components that are building blocks of the architectural design:

* Back-end: Business logic implemented using Node.JS for server-side functionality like user authentication, messaging, and communicating with a database
* Front-end: UI components like login/register, shopping cart, payment page etc.
* API Endpoints: client-facing API uses GraphQL, microservices expose REST APIs
* Deployment: Application deployment on the cloud using Docker containers, with Kubernetes for scaling and management
* Message Queues: Handling email notifications like order status, payment details etc.
* Database: Data storage and retrieval system (PostgreSQL) with an automated sweeping system ([`pg_cron`](https://github.com/citusdata/pg_cron))

![High-level overview of stack](img/hl_stack_overview.png)

## 6. Acceptance Criteria

The acceptance criteria are as follows:

1. Backend stack deployed in Docker containers, orchestrated with `docker-compose`.
2. Microservices prepared for deployment on Kubernetes, potentially deployed.
3. All code documented and checked in on Github repo, with orchestration scripts for deployment.
4. User is able to place an order from the frontend.
5. Services allow both guest user and registered user checkout; users' carts are protected from other users.

## 7. Release planning & Presentations
We are planning for a bi-weekly release, coinciding with in-class demos.

Demos:

* [Presentation - Demo 1](https://docs.google.com/presentation/d/1TYmVYvuYqNWoOj4FwtnGaxnmtSnmXSqMxC14MutpX2s/edit?usp=sharing)

* [Presentation - Demo 2](https://docs.google.com/presentation/d/1pIByj3ZFKsxwYGMkZmbblarH8IQ_82dd2DG20eF9ZoQ/edit?usp=sharing)

* [Presentation - Demo 3](https://docs.google.com/presentation/d/1y8UFQk24xiic3kDdEQJf4XNuVcRz4E9o73lxcjVV5q0/edit?usp=sharing)

* [Presentation - Demo 4](https://docs.google.com/presentation/d/1HYA-NcBYhKcqQb_2hXY_uLIjA32a3Ii8SxGgHjhN5ok/edit?usp=sharing)

* [Presentation - Demo 5](https://docs.google.com/presentation/d/1jZsAQxVgm-G43GMPc2j9_eFu9ijegDiACVId-v0h1X4/edit?usp=sharing)

* [Presentation - Final demo](https://docs.google.com/presentation/d/1Iz1XJm7Du_r0WvnyBmxD1lEDWr31ZacSbZqIBmAwm98/edit?usp=sharing)

Paper presentation: [Kafka](https://docs.google.com/presentation/d/1zpvOEwlpvICcFjsk3VjvMrjJyT14KJtdswHrt5g4bF8/edit?usp=sharing)

