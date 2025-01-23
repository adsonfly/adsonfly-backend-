import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from 'fastify-jwt';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import dotenv from 'dotenv';
import {
  loggingMiddleware,
  authenticationMiddleware,
  errorHandlingMiddleware,
} from './middlewares/middlewares.js';

// Load environment variables
dotenv.config();

// Initialize Fastify
const fastifyServer = fastify({
  logger: true,
});

// Register plugins
fastifyServer.register(fastifyCors, {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

fastifyServer.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
});

fastifyServer.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

fastifyServer.register(fastifySwagger, {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'Adsonfly Backend API',
      description: 'API documentation for Adsonfly Backend',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true,
});

// MongoDB Connection
connectDB();

// Register middlewares
fastifyServer.addHook('onRequest', loggingMiddleware); // Logging middleware (applied globally)
fastifyServer.addHook('preHandler', (request, reply, done) => {
  // Skip authentication for the registration and login routes
  if (request.url === '/api/register' || request.url === '/api/login') {
    return done();
  }
  authenticationMiddleware(request, reply, done);
});
fastifyServer.addHook('onError', errorHandlingMiddleware); // Error handling middleware

// Define routes
fastifyServer.get('/', async (request, reply) => {
  return { message: 'Welcome to the Adsonfly Backend!' };
});

// Register routes with prefix
fastifyServer.register(authRoutes, { prefix: '/api' });
fastifyServer.register(userRoutes, { prefix: '/api/user' });
fastifyServer.register(driverRoutes, { prefix: '/api/driver' });

// Start server
const start = async () => {
  try {
    await fastifyServer.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
  } catch (err) {
    fastifyServer.log.error(err);
    process.exit(1);
  }
};

start();