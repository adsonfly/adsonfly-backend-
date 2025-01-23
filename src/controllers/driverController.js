import Driver from '../models/driver.js';

export const registerDriver = async (request, reply) => {
  const { name, phone, email, vehicleRegNo, password, documents } = request.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const driver = new Driver({ name, phone, email, vehicleRegNo, password: hashedPassword, documents });
    await driver.save();
    reply.code(201).send({ message: 'Driver registration successful', driver });
  } catch (err) {
    console.error('Driver registration error:', err);
    reply.code(500).send({ error: 'Internal server error' });
  }
};

export const getDriverProfile = async (request, reply) => {
  try {
    const driver = await Driver.findById(request.user.id).select('-password');
    if (!driver) {
      return reply.code(404).send({ error: 'Driver not found' });
    }
    reply.send({ driver });
  } catch (err) {
    console.error('Get driver profile error:', err);
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

    if (!driver) {
      return reply.code(404).send({ error: 'Driver not found' });
    }

    reply.send({ message: 'Driver profile updated successfully', driver });
  } catch (err) {
    console.error('Update driver profile error:', err);
    reply.code(500).send({ error: 'Internal server error' });
  }
};

export const deleteDriver = async (request, reply) => {
  try {
    const driver = await Driver.findByIdAndDelete(request.user.id);
    if (!driver) {
      return reply.code(404).send({ error: 'Driver not found' });
    }
    reply.send({ message: 'Driver deleted successfully' });
  } catch (err) {
    console.error('Delete driver error:', err);
    reply.code(500).send({ error: 'Internal server error' });
  }
};