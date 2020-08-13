import { Router } from 'express';
import validJwt from 'express-jwt';
import guard from 'express-jwt-permissions';
import { container } from 'tsyringe';

import UserController from '../controllers/UserController';

export class UserRoutes {
  private routes: Router = Router();

  private guard: any;

  private userController: UserController;

  constructor() {
    this.userController = container.resolve(UserController);
    this.guard = guard({ permissionsProperty: 'scope' });
  }

  registerUserRoutes(): Router {
    this.routes.get(
      '/',
      validJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
      this.guard.check('users.read'),
      (req, res) => this.userController.index(req, res),
    );

    this.routes.get(
      '/:id',
      validJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
      this.guard.check('users.read'),
      (req, res) => this.userController.find(req, res),
    );

    this.routes.post('/', (req, res, next) =>
      this.userController.create(req, res, next),
    );
    return this.routes;
  }
}
