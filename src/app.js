import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from 'fastify-jwt';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import fastifyExpress from '@fastify/express';
import fastifyAuth from '@fastify/auth'; // Import fastify-auth
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dotenv from 'dotenv';
import { setupSocket } from './sockets/socket.js';
import { adminJs, router } from './admin/admin.js';
import express from 'express';
import {
  loggingMiddleware,
  authenticationMiddleware,
  errorHandlingMiddleware,
} from './middlewares/middlewares.js';

dotenv.config();

// Suppress deprecation warnings
process.removeAllListeners('warning');

// Initialize Fastify
const fastifyServer = fastify({
  logger: true,
});

// Register fastify-express plugin
fastifyServer.register(fastifyExpress);

// Register plugins
fastifyServer.register(fastifyCors, {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Register fastify-jwt plugin
fastifyServer.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
});

// Register fastify-auth plugin
fastifyServer.register(fastifyAuth);

// Add JWT verification middleware
fastifyServer.decorate('verifyJWT', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
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

// Initialize Socket.IO
const io = setupSocket(fastifyServer.server);
fastifyServer.decorate('io', io);

// Create an Express app for AdminJS
const adminApp = express();
adminApp.use(adminJs.options.rootPath, router);

// Register the Express app as a Fastify plugin
fastifyServer.register((instance, opts, done) => {
  instance.use(adminJs.options.rootPath, adminApp);
  done();
});

// Register middlewares
fastifyServer.addHook('onRequest', loggingMiddleware); // Logging middleware (applied globally)
fastifyServer.addHook('preHandler', (request, reply, done) => {
  // Skip authentication for the registration, login, and driver registration routes
  if (
    request.url === '/api/register' ||
    request.url === '/api/login-user' ||
    request.url === '/' ||
    request.url === '/docs' ||
    request.url === '/api/driver/register' ||
    request.url === '/api/login-driver' 
  ) {
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
fastifyServer.register(adminRoutes, { prefix: '/api/admin' });

// Start server
const start = async () => {
  try {
    console.log('Starting server...');
    await fastifyServer.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
    console.log(`AdminJS panel available at http://localhost:${process.env.PORT || 3000}/admin`);
  } catch (err) {
    console.error('Error starting server:', err.message);
    console.error(err.stack);
    fastifyServer.log.error(err);
    process.exit(1);
  }
};


start();