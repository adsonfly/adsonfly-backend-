import User from '../models/user.js';
import Driver from '../models/driver.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register function
export const register = async (req, reply) => {
  const { name, phone, email, password, role } = req.body;

  console.log('Registration payload:', { name, phone, email, password, role });

  try {
    let user;

    // Create user or driver based on role
    if (role === 'driver') {
      user = new Driver({ name, phone, email, password });  // No need to hash password here
    } else {
      user = new User({ name, phone, email, password });  // No need to hash password here
    }

    // Save the user
    await user.save();
    console.log('User saved successfully:', user);

    // Respond with success
    reply.code(201).send({ message: 'Registration successful', user });
  } catch (err) {
    console.error('Registration error:', err.message);
    reply.code(500).send({ error: err.message });
  }
};


// Login function
export const login = async (req, reply) => {
  const { phone, password, role } = req.body;

  console.log('Login payload:', { phone, password, role });

  try {
    let user;

    // Fetch user based on role
    if (role === 'driver') {
      user = await Driver.findOne({ phone });
      console.log('Driver found:', user);
    } else {
      user = await User.findOne({ phone });
      console.log('User found:', user);
    }

    // Check if user exists
    if (!user) {
      console.log('User not found');
      return reply.code(404).send({ message: 'User not found' });
    }

    // Log stored hashed password
    console.log('Stored hashed password:', user.password);

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Input password:', password); // Debugging
    console.log('Stored hashed password:', user.password); // Debugging
    console.log('Password match result:', isMatch); // Debugging

    if (!isMatch) {
      return reply.code(400).send({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Respond with success message and token
    reply.send({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err.message);
    reply.code(500).send({ error: err.message });
  }
};


// Placeholder for OTP verification
export const verifyOtp = async (req, reply) => {
  // Integrate Firebase OTP verification logic here.
  reply.send({ message: 'OTP verified' });
};
