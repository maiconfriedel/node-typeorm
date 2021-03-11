import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import { registry, Lifecycle, injectable, inject, container } from 'tsyringe';

import startConnection from '../infrastructure/database/connection';
import UserRepository from '../infrastructure/repositories/UserRepository';
import handleError from './middlewares/errorHandler';
import { LoginRoutes } from './routes/login.routes';
import { UserRoutes } from './routes/user.routes';

dotenv.config();

// register dependencies in the DI container
@registry([
  {
    token: 'IUserRepository',
    useClass: UserRepository,
    options: {
      lifecycle: Lifecycle.Transient,
    },
  },
])
@injectable()
class Server {
  public app: Application;

  constructor(
    @inject(UserRoutes) private userRoutes: UserRoutes,
    @inject(LoginRoutes) private loginRoutes: LoginRoutes,
  ) {
    this.app = express();
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

container.resolve(Server).start();
