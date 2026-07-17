import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import farmerRoutes from "./routes/farmerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Farm Connect Backend");
});

app.use("/farmers", farmerRoutes);
app.use("/products", productRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(8000, () => {
  console.log("Server is started at 8000");
});