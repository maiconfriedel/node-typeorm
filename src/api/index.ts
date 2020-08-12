import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import { registry, Lifecycle } from 'tsyringe';

import startConnection from '../infrastructure/database/connection';
import UserRepository from '../infrastructure/repositories/UserRepository';
import { UserRoutes } from './routes/user.routes';

dotenv.config();

@registry([
  {
    token: 'IUserRepository',
    useClass: UserRepository,
    options: {
      lifecycle: Lifecycle.Transient,
    },
  },
])
class Server {
  public app: Application;

  public userRoutes: UserRoutes;

  constructor() {
    this.app = express();
    this.userRoutes = new UserRoutes();
  }

  start() {
    startConnection();
    this.app.use('/users', this.userRoutes.registerUserRoutes());
    this.app.listen(3333);
  }
}

new Server().start();
