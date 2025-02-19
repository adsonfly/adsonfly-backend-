import { verifyDocuments } from '../controllers/adminController.js';

export default async function adminRoutes(fastify, options) {
  fastify.put('/verify-documents/:driverId', { preHandler: fastify.verifyJWT }, verifyDocuments);
}