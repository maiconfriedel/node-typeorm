import 'reflect-metadata';
import express, { Application } from 'express';
import { UserRoutes } from './routes/user.routes';
import startConnection from '../infrastructure/database/connection';
import ServiceExtensions from './ServiceExtensions';

class Server {
  public app: Application;
  public userRoutes: UserRoutes;

  constructor() {
    this.app = express();
    this.userRoutes = new UserRoutes();
  }

  start() {
    new ServiceExtensions();
    startConnection();
    this.app.use('/users', this.userRoutes.registerUserRoutes());
    this.app.listen(3333);
  }
}

new Server().start();
