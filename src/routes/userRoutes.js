import { getUserProfile, updateUserProfile, deleteUser } from '../controllers/userController.js';

export default async function userRoutes(fastify, options) {
  fastify.get('/profile', getUserProfile);
  fastify.put('/profile', updateUserProfile);
  fastify.delete('/profile', deleteUser);
}