import {
  registerDriver,
  uploadDocuments,
  getDriverProfile,
  updateDriverProfile,
  deleteDriver,
} from '../controllers/driverController.js';

export default async function driverRoutes(fastify, options) {
  // Register driver (no authentication required)
  fastify.post('/register', registerDriver);

  // Other routes (require authentication)
  fastify.post('/upload-documents', { preHandler: fastify.verifyJWT }, uploadDocuments);
  fastify.get('/profile', { preHandler: fastify.verifyJWT }, getDriverProfile);
  fastify.put('/profile', { preHandler: fastify.verifyJWT }, updateDriverProfile);
  fastify.delete('/profile', { preHandler: fastify.verifyJWT }, deleteDriver);
}