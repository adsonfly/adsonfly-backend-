import User from '../models/user.js';

// Get user profile
export const getUserProfile = async (request, reply) => {
  try {
    const user = await User.findById(request.user.id).select('-password');
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    reply.send({ user });
  } catch (err) {
    console.error('Get user profile error:', err);
    reply.code(500).send({ error: 'Internal server error' });
  }
};

// Update user profile
export const updateUserProfile = async (request, reply) => {
  const { name, email, phone } = request.body;

  try {
    const user = await User.findByIdAndUpdate(
      request.user.id,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    reply.send({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Update user profile error:', err);
    reply.code(500).send({ error: 'Internal server error' });
  }
};

// Delete user account
export const deleteUser = async (request, reply) => {
  try {
    const user = await User.findByIdAndDelete(request.user.id);
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    reply.send({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    reply.code(500).send({ error: 'Internal server error' });
  }
};