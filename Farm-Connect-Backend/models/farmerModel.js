import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    farmerName: {
      type: String,
      required: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+@.+\..+/,
    },

    phone: {
      type: String,
      required: true,
      match: /^\d{10}$/,
    },

    village: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    specialty: {
      type: String,
      default: "General",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Farmer = mongoose.model("Farmer", farmerSchema);

export default Farmer;