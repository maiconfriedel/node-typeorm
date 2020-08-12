import { Router } from 'express';
import { container } from 'tsyringe';

import UserController from '../controllers/UserController';

export class UserRoutes {
  private routes: Router = Router();

  private userController: UserController;

  constructor() {
    this.userController = container.resolve(UserController);
  }

  registerUserRoutes(): Router {
    this.routes.get('/', (req, res) => this.userController.index(req, res));
    this.routes.get('/:id', (req, res) => this.userController.find(req, res));
    this.routes.post('/', (req, res, next) =>
      this.userController.create(req, res, next),
    );
    return this.routes;
  }
}
