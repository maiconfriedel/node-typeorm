import { Router } from 'express';
import { container } from 'tsyringe';

import LoginController from '../controllers/LoginController';

export class LoginRoutes {
  private routes: Router = Router();

  private loginController: LoginController;

  constructor() {
    this.loginController = container.resolve(LoginController);
  }

  registerLoginRoutes(): Router {
    this.routes.post('/', (req, res, next) =>
      this.loginController.create(req, res, next),
    );
    return this.routes;
  }
}
