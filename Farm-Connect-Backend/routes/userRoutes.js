import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
} from "../controllers/userController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// Register with profile image upload
router.post("/register", upload.single("profile"), registerUser);

// Login
router.post("/login", loginUser);

// Search users
router.get("/search", searchUsers);

// Get all users
router.get("/", getUsers);

// Get single user
router.get("/:id", getUserById);

// Update user with image upload
router.put("/:id", upload.single("profile"), updateUser);

// Delete user
router.delete("/:id", deleteUser);

export default router;