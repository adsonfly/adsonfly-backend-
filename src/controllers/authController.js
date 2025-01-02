const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { name, phoneNumber, vehicleRegistrationNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser)
      return res.status(400).json({ message: "User already registered" });

    const newUser = new User({
      name,
      phoneNumber,
      vehicleRegistrationNumber,
      license: req.files.license[0].location,
      vehicleRC: req.files.vehicleRC[0].location,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Registration successful, pending approval" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
