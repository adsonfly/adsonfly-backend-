import { register, loginUser,loginDriver, verifyOtp } from '../controllers/authController.js';

export default async function authRoutes(fastify, options) {
  fastify.post('/register', register);
  fastify.post('/login-user', loginUser);
  fastify.post('/login-driver', loginDriver);
  fastify.post('/verify-otp', verifyOtp);
}