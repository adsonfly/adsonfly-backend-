import Driver from '../models/driver.js';
import { uploadToS3 } from '../utils/s3.js';
import bcrypt from 'bcrypt';

export const registerDriver = async (request, reply) => {
  try {
    const { name, phone, email, vehicleRegNo, password, documents } = request.body;
    console.log('Registration payload:', { name, phone, email, vehicleRegNo, password, documents });

    // Validate required fields
    if (!name || !phone || !email || !vehicleRegNo || !password) {
      return reply.code(400).send({ error: 'All fields are required' });
    }

    // Create new driver (without manual password hashing)
    const driver = new Driver({
      name,
      phone,
      email,
      vehicleRegNo,
      password,  // Pass plaintext password; schema will handle hashing
      documents,
    });

    console.log('Driver created:', driver);

    // Save driver to DB
    await driver.save();

    reply.code(201).send({ message: 'Driver registration successful', driver });

  } catch (err) {
    console.error('Error in registerDriver:', err);
    reply.code(500).send({ error: 'Internal server error', details: err.message });
  }
};


export const uploadDocuments = async (request, reply) => {
  try {
    const files = await request.saveRequestFiles();
    const driverId = request.user.id;

    const documentUrls = {};
    for (const file of files) {
      const url = await uploadToS3(file);
      documentUrls[file.fieldname] = { url, verified: false };
    }

    await Driver.findByIdAndUpdate(driverId, { documents: documentUrls });
    reply.send({ message: 'Documents uploaded successfully', documentUrls });
  } catch (err) {
    console.error('Error in uploadDocuments:', err);
    reply.code(500).send({ error: 'Internal server error' });
  }
};

export const getDriverProfile = async (request, reply) => {
  try {
    const driver = await Driver.findById(request.user.id).select('-password');
    if (!driver) return reply.code(404).send({ error: 'Driver not found' });
    reply.send({ driver });
  } catch (err) {
    console.error('Error in getDriverProfile:', err);
    reply.code(500).send({ error: 'Internal server error' });
  }
};

export const updateDriverProfile = async (request, reply) => {
  const { name, email, vehicleRegNo, documents } = request.body;

  try {
    const driver = await Driver.findByIdAndUpdate(
      request.user.id,
      { name, email, vehicleRegNo, documents },
      { new: true, runValidators: true }
    ).select('-password');

    if (!driver) return reply.code(404).send({ error: 'Driver not found' });
    reply.send({ message: 'Driver profile updated successfully', driver });
  } catch (err) {
    console.error('Error in updateDriverProfile:', err);
    reply.code(500).send({ error: 'Internal server error' });
  }
};

export const deleteDriver = async (request, reply) => {
  try {
    const driver = await Driver.findByIdAndDelete(request.user.id);
    if (!driver) return reply.code(404).send({ error: 'Driver not found' });
    reply.send({ message: 'Driver deleted successfully' });
  } catch (err) {
    console.error('Error in deleteDriver:', err);
    reply.code(500).send({ error: 'Internal server error' });
  }
};