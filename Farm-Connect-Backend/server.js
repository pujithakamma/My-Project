import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/products", productRoutes);
app.use("/farmers", farmerRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Farm Connect Backend");
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
const PORT = process.env.PORT || 8000;


