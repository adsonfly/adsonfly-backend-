import { register, login, verifyOtp } from '../controllers/authController.js';

export default async function authRoutes(fastify, options) {
  fastify.post('/register', register);
  fastify.post('/login', login);
  fastify.post('/verify-otp', verifyOtp);
}