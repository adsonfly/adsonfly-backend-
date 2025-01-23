import {
    registerDriver,
    getDriverProfile,
    updateDriverProfile,
    deleteDriver,
  } from '../controllers/driverController.js';
  
  export default async function driverRoutes(fastify, options) {
    fastify.post('/register', registerDriver);
    fastify.get('/profile', getDriverProfile);
    fastify.put('/profile', updateDriverProfile);
    fastify.delete('/profile', deleteDriver);
  }