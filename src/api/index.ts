import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import { registry, Lifecycle } from 'tsyringe';

import startConnection from '../infrastructure/database/connection';
import UserRepository from '../infrastructure/repositories/UserRepository';
import handleError from './middlewares/errorHandler';
import { LoginRoutes } from './routes/login.routes';
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

  public loginRoutes: LoginRoutes;

  constructor() {
    this.app = express();
    this.userRoutes = new UserRoutes();
    this.loginRoutes = new LoginRoutes();
  }

  start() {
    startConnection();
    this.app.use(express.json());
    this.app.use('/users', this.userRoutes.registerUserRoutes());
    this.app.use('/login', this.loginRoutes.registerLoginRoutes());
    this.app.listen(process.env.PORT || 3333);
    this.app.use(handleError);
  }
}

new Server().start();
