import bcrypt from "bcrypt";
import User from "../models/userModel.js";

const saltRounds = 10;

export async function registerUser(req, res) {
  try {
    const { email, password, fullName, ...rest } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ email: email.toLowerCase(), password: hashed, fullName, ...rest });
    const safeUser = user.toObject();
    delete safeUser.password;
    res.status(201).json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Missing credentials" });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getUsers(req, res) {
  try {
    // Search
    const search = req.query.search || "";

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sort = req.query.sort || "fullName";
    const order = req.query.order === "desc" ? -1 : 1;

    // Fetch users
    const users = await User.find({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { village: { $regex: search, $options: "i" } },
        { farmName: { $regex: search, $options: "i" } }
      ]
    })
      .select("-password")
      .sort({ [sort]: order })
      .skip(skip)
      .limit(limit);

    // Count matching users
    const totalUsers = await User.countDocuments({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { village: { $regex: search, $options: "i" } },
        { farmName: { $regex: search, $options: "i" } }
      ]
    });

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      users,
      page,
      limit,
      totalUsers,
      totalPages
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function searchUsers(req, res) {
  try {
    const search = req.query.query;

    const users = await User.find({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { village: { $regex: search, $options: "i" } },
        { farmName: { $regex: search, $options: "i" } }
      ]
    }).select("-password");

    res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export default null;
