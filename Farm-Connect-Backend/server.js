import express from "express";

// const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Products Array
let products = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        category: "Vegetables",
        price: 40,
        stock: 100
    },
    {
        id: 2,
        name: "Organic Milk",
        category: "Dairy",
        price: 70,
        stock: 80
    }
];

// Home Route
app.get("/home", (req, res) => {
    res.json("Welcome to Farm Connect Backend");
});

// Get All Products
app.get("/products", (req, res) => {
    res.json(products);
});

// Get Product By ID
app.get("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((product) => product.id == id);
    res.json(product);
});

// Add Product
app.post("/products", (req, res) => {
    const product = req.body;
    // req.body contains Postman data
    products.push(product);
    res.status(201).json({
        message: "Product Added"
    });
});

// Update Product
app.put("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((product) => product.id == id);
    product.name = req.body.name;
    product.category = req.body.category;
    product.price = req.body.price;
    product.stock = req.body.stock;
    res.json({
        message: "Product Updated"
    });
});

// Delete Product
app.delete("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    products = products.filter((product) => product.id != id);
    res.json({
        message: "Product Deleted"
    });
});

// Start Server
app.listen(8000, () => {
    console.log("Server is started at 8000");
});