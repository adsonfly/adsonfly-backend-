const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, unique: true, required: true },
  email: { type: String },
  password: { type: String }, // Optional for email login
  googleId: { type: String }, // Optional for Google login
  vehicleRegistrationNumber: { type: String, required: true },
  profilePicture: { type: String },
  license: { type: String }, // S3 URL
  vehicleRC: { type: String }, // S3 URL
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("User", userSchema);
