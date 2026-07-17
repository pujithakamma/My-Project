import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      minlength: 2,
    },

    farmerName: {
      type: String,
      required: true,
      minlength: 2,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Vegetables",
        "Fruits",
        "Spices",
        "Grains",
        "Dairy",
        "Other",
      ],
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
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

const Product = mongoose.model("Product", productSchema);

export default Product;