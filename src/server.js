import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/mongoose'; // Correct named exports
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js'; // Adjust the path if necessary

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
connectDB();

// AdminJS setup
AdminJS.registerAdapter({ Database, Resource });

const adminJs = new AdminJS({
  databases: [],
  rootPath: '/admin',
});
const adminRouter = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, adminRouter);

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
