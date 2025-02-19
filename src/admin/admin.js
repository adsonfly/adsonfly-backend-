import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import mongoose from 'mongoose';
import User from '../models/user.js';
import Driver from '../models/driver.js';

AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({
  databases: [mongoose],
  resources: [
    {
      resource: User,
      options: {
        properties: {
          password: { isVisible: false },
        },
      },
    },
    {
      resource: Driver,
      options: {
        properties: {
          password: { isVisible: false },
          documents: {
            properties: {
              license: {
                url: { type: 'string' },
                verified: { type: 'boolean' },
              },
              vehicleRC: {
                url: { type: 'string' },
                verified: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  ],
  rootPath: '/admin',
});

const router = AdminJSExpress.buildRouter(adminJs);

export { adminJs, router };