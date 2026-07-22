import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import farmerRoutes from "./routes/farmerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();
const app = express();

app.use(express.json());
// Allow CORS from any origin during local development so frontend can call the API
app.use(cors());


app.get("/", (req, res) => {
  res.send("Welcome to Farm Connect Backend");
});

app.use("/farmers", farmerRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/uploads",express.static("uploads"));


app.use(notFound);
app.use(errorHandler);

app.listen(8000, () => {
  console.log("Server is started at 8000");
});