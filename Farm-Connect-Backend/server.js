import express from "express";

// const express = require("express");

const app = express();
app.use(express.json());

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


app.get("/home", (req, res) => {
    res.json("Welcome to Farm Connect Backend");
});


app.get("/products", (req, res) => {
    res.json(products);
});

app.get("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((product) => product.id == id);
    res.json(product);
});

app.post("/products", (req, res) => {
    const product = req.body;
    products.push(product);
    res.status(201).json({
        message: "Product Added"
    });
});


app.listen(8000, () => {
    console.log("Server is started at 8000");
});
