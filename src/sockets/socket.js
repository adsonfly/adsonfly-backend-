import { Server as socketIo } from 'socket.io';

export const setupSocket = (server) => {
  const io = new socketIo(server);

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-room', (driverId) => {
      socket.join(driverId);
      console.log(`Driver ${driverId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};