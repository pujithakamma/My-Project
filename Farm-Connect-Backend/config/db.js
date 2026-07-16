import mongoose from "mongoose";

async function connectDB() {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb+srv://Pujitha_20:Pujitha2006@mycluster.kxftylk.mongodb.net/Farmconnect?retryWrites=true&w=majority&appName=Mycluster";

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}

export default connectDB;