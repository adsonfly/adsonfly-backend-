import fastify from 'fastify';
import { getUserProfile, updateUserProfile, deleteUser } from '../controllers/userController.js';

export default async function userRoutes(fastify, options) {
  // Define routes
  fastify.get('/profile', { preHandler: fastify.verifyJWT }, getUserProfile);
  fastify.put('/profile', { preHandler: fastify.verifyJWT }, updateUserProfile);
  fastify.delete('/profile', { preHandler: fastify.verifyJWT }, deleteUser);
}