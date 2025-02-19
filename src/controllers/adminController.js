import Driver from '../models/driver.js';

export const verifyDocuments = async (request, reply) => {
  const { driverId } = request.params;
  const { documentType, verified } = request.body;

  const driver = await Driver.findById(driverId);
  if (!driver) return reply.code(404).send({ error: 'Driver not found' });

  driver.documents[documentType].verified = verified;
  await driver.save();

  // Notify driver via Socket.IO
  request.io.to(driverId).emit('document-verified', { documentType, verified });

  reply.send({ message: 'Document verification updated', driver });
};