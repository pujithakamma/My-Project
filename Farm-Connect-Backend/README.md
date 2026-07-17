# 🌱 Farm Connect Backend

## Project Overview

Farm Connect Backend is developed using **Node.js**, **Express.js**, **MongoDB Atlas**, and **Mongoose**. The project helps to manage farmers and products by performing CRUD operations. All the data is stored in MongoDB Atlas instead of temporary arrays.

---

## Technologies Used

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Postman
* Dotenv

---

## Features

* Connected Express application with MongoDB Atlas
* Used Mongoose Schema and Models
* Added Schema Validations
* Implemented CRUD Operations
* Fetch, Update and Delete using ObjectId
* Error Handling Middleware
* Soft Delete using `isDeleted`
* Tested all APIs using Postman

---

## Folder Structure

* config
* controllers
* middleware
* models
* routes
* screenshots
* server.js
* package.json
* README.md

---

## API Endpoints

### Farmer APIs

| Method | Endpoint     |
| ------ | ------------ |
| POST   | /farmers     |
| GET    | /farmers     |
| GET    | /farmers/:id |
| PUT    | /farmers/:id |
| DELETE | /farmers/:id |

### Product APIs

| Method | Endpoint      |
| ------ | ------------- |
| POST   | /products     |
| GET    | /products     |
| GET    | /products/:id |
| PUT    | /products/:id |
| DELETE | /products/:id |

---

## Validations

### Farmer

* Farmer Name is required
* Email is required and unique
* Email format validation
* Phone number must contain 10 digits
* Village is required
* State is required

### Product

* Product Name is required
* Farmer Name is required
* Category is required
* Quantity must be greater than 0
* Price cannot be negative
* Location is required

---

## Error Handling

The project handles:

* Invalid MongoDB Connection
* Invalid ObjectId
* Validation Errors
* Duplicate Email
* Record Not Found
* Server Errors

---

## Postman Testing

The following APIs were tested successfully:

### Farmer

* Add Farmer
* Get All Farmers
* Get Farmer by ID
* Update Farmer
* Delete Farmer
* Invalid ID
* Validation Error

### Product

* Add Product
* Get All Products
* Get Product by ID
* Update Product
* Delete Product
* Invalid ID
* Validation Error

---

## Screenshots

### Farmer

* Add Farmer
* Get All Farmers
* Get Farmer by ID
* Update Farmer
* Delete Farmer
* Invalid Farmer ID
* Farmer Validation Error

### Product

* Add Product
* Get All Products
* Get Product by ID
* Update Product
* Delete Product
* Invalid Product ID
* Product Validation Error

### MongoDB

* MongoDB Connection
* Farmers Collection
* Products Collection

---

## Project Status

Completed MongoDB Atlas integration and CRUD API testing using Postman.

## Conclusion

This project demonstrates how to build a backend application using Express and MongoDB Atlas. It includes database connectivity, Mongoose schema and models, validations, CRUD operations, ObjectId handling, and API testing using Postman.
