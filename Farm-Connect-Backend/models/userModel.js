import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  gender: { type: String },
  dob: { type: String },
  userType: { type: String },
  address: { type: String },
  village: { type: String },
  state: { type: String },
  pincode: { type: String },
  farmName: { type: String },
  crops: { type: String },
  profile: { type: String },
  terms: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
