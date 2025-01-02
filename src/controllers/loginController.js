const admin = require("../config/firebase");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.loginWithOTP = async (req, res) => {
  const { phoneNumber, otpToken } = req.body;

  try {
    // Verify OTP with Firebase
    const decodedToken = await admin.auth().verifyIdToken(otpToken);
    const user = await User.findOne({ phoneNumber: decodedToken.phone_number });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.status !== "Approved")
      return res.status(403).json({ message: "Account not approved" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: "Invalid OTP" });
  }
};
