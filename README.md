Cloud-Based E-Commerce Platform
====================================

## 1. Vision and Goals Of The Project:
This project is a cloud based e-commerce solution that enables entrepreneurs to leverage this platform for individual or business purposes.
The vision for this project is one of headless design, with the front-end and back-end entirely independent from each other.
This would make the system more flexible for developers and for business operators alike, compared to the currently available alternatives.

The platform should be entirely flexible, modular and scalable in nature.
The API-driven architecture would make it a modern, high performing tech stack that easily integrates with external services or technologies.
The platform would enable shopper event data, unlock insights across sales channels, and manage sales performance in real time.

The high-level goals include:

* A simple, intuitive, straightforward, and easy-to-use UI for all users
<!-- Is the UI really a goal, or is the back-end our main focus?-->
* End-to-end user experience, from product selection to payment
* Enabling entrepreneurs to host their own businesses using this platform and create an e-commerce store
* Complete flexibility, modularity, and scalability
* Independence of front-end and back-end code

## 2. Users/Personas Of The Project:
The e-commerce platform will be used by:

* Entrepreneurs hosting their business on the platform, who will use either the full stack of offered functionality, or specific modules
* End-users of the business created by an entrepreneur, who will use the e-commerce system for orders and payment.

It does not target developers directly, although the modular nature of the system will make it easier for developers to integrate its services in other applications.

## 3. Scope and Features Of The Project:
The main goal of this project is to develop a robust back-end which can support multiple front-ends; in particular any front-end development will be solely for testing.

Main features:

* User management & authentication: creating/deleting an account, signing in/out, profile management
* Product sales
  * Product listing
  * Search
  * Shopping cart functionality
  * Placing/cancelling orders
  * Transactions
  * Shipping & Tax calculator
  * Returns management
  * CRM system to send transactional emails
* Inventory management
* Accounting
* Admin dashboards
* Back-end
  * Secure authentication
  * Integration with third-party payment services
  * Secure user data storage
  * Messaging queues
  * Scalability to support increase/decrease in load
  * Ability to operate across multiple businesses

Additional features:

* Recommendation systems
* Analytics
* Improved security

## 4. Solution Concept
A short description of the system components that are building blocks of the architectural design:

* Back-end: Business logic implemented using Node.JS for server-side functionality like user authentication, messaging, and communicating with a database
* Front-end: UI components like login/register, shopping cart, payment page etc.
<!-- To what degree is front-end a main part of our solution? The project description says that "any front-end development will be solely for testing"-->
* implemented using React.JS/ Next.JS
* End-points: Maintains all service endpoints using GraphQL/REST APIs
* Load testing: Probably Loadtest
* Deployment: Application deployment on cloud using Docker containers with Kubernetes
* Server Host: Server framework on which the application runs - Nginx/ Express.JS
* Message Queues: Handling email notifications like order status, payment details etc.
* using Apache Kafka
* Database: Data storage and retrieval system - PostgreSQL

## 5. Acceptance Criteria
TBD.

## 6. Release planning
TBD.
