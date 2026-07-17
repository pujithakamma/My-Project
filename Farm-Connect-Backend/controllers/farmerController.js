import mongoose from "mongoose";
import Farmer from "../models/farmerModel.js";

// Get all farmers
export async function getFarmers(req, res) {
  try {
    const farmers = await Farmer.find({ isDeleted: false });

    res.status(200).json({
      success: true,
      count: farmers.length,
      farmers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get farmer by ID
export async function getFarmerById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Farmer ID",
      });
    }

    const farmer = await Farmer.findById(req.params.id);

    if (!farmer || farmer.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    res.status(200).json({
      success: true,
      farmer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Add farmer
export async function addFarmer(req, res) {
  try {
    const farmer = await Farmer.create(req.body);

    res.status(201).json({
      success: true,
      farmer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Update farmer
export async function updateFarmer(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Farmer ID",
      });
    }

    const farmer = await Farmer.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    res.status(200).json({
      success: true,
      farmer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete farmer (Soft Delete)
export async function deleteFarmer(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Farmer ID",
      });
    }

    const farmer = await Farmer.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      }
    );

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Farmer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}