import bcrypt from "bcrypt";
import multer from "multer";
import User from "../models/userModel.js";

const saltRounds = 10;

export async function registerUser(req, res) {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    const { email, password, fullName, ...rest } = req.body;

    // Required field validation
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Check duplicate email
    const existing = await User.findOne({
      email: email.toLowerCase()
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      saltRounds
    );

    // Save uploaded image filename
    const profile = req.file ? req.file.filename : "";

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      profile,
      ...rest
    });

    // Remove password before sending response
    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: safeUser
    });

  } catch (error) {

    // Multer file size error
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: "Image size should be less than 2 MB"
      });
    }

    // Invalid file type
    if (error.message === "Only JPG, JPEG and PNG images are allowed") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
export async function loginUser(req, res) {

  try {

    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        success:false,
        message:"Email and password required"
      });
    }


    const user = await User.findOne({email});


    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }


    const isMatch = await bcrypt.compare(
      password,
      user.password
    );


    if(!isMatch){
      return res.status(401).json({
        success:false,
        message:"Invalid password"
      });
    }


    res.status(200).json({
      success:true,
      message:"Login successful",
      user:{
        id:user._id,
        fullName:user.fullName,
        email:user.email
      }
    });


  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

}
export async function getUsers(req, res) {
  try {
    const search = req.query.search || "";

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || "fullName";
    const order = req.query.order === "desc" ? -1 : 1;

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


    const totalUsers = await User.countDocuments();

    const totalPages = Math.ceil(totalUsers / limit);


    res.status(200).json({
      success:true,
      users,
      page,
      limit,
      totalUsers,
      totalPages
    });


  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
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
    if (req.file) {
      updates.profile = req.file.filename;
    }
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
