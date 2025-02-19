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
     
      user = new Driver({ name, phone, email, password }); //plain password
    } else {
      // For users, rely on the User model's pre-save hook
      user = new User({ name, phone, email, password });
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
export const loginUser = async (req, reply) => {
  const { phone, password } = req.body;

  console.log('User Login payload:', { phone, password });

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      console.log('User not found in the database.');
      return reply.code(404).send({ message: 'User not found' });
    }

    console.log('User found. Stored hashed password:', user.password);

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch. Login attempt failed.');
      return reply.code(400).send({ message: 'Invalid credentials' });
    }

    console.log('Generating JWT token for user...');
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('JWT token generated successfully for user.');
    reply.send({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error for user:', err.message);
    reply.code(500).send({ error: err.message });
  }
};

export const loginDriver = async (req, reply) => {
  const { phone, password } = req.body;

  console.log('Driver Login payload:', { phone, password });

  try {
    const driver = await Driver.findOne({ phone });

    if (!driver) {
      console.log('Driver not found in the database.');
      return reply.code(404).send({ message: 'Driver not found' });
    }

    console.log('Driver found. Stored password:', driver.password);

    // Direct plaintext comparison for driver passwords
    const isMatch = password === driver.password;
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch. Login attempt failed.');
      return reply.code(400).send({ message: 'Invalid credentials' });
    }

    console.log('Generating JWT token for driver...');
    const token = jwt.sign(
      { id: driver._id, role: 'driver' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('JWT token generated successfully for driver.');
    reply.send({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error for driver:', err.message);
    reply.code(500).send({ error: err.message });
  }
};


// Placeholder for OTP verification
export const verifyOtp = async (req, reply) => {
  // Integrate Firebase OTP verification logic here.
  reply.send({ message: 'OTP verified' });
};