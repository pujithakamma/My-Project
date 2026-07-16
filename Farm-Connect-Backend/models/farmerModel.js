import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Farmer name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    farmName: {
      type: String,
      required: [true, "Farm name is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    specialty: {
      type: String,
      trim: true,
      default: "General",
    },
  },
  {
    timestamps: true,
  }
);

const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;
