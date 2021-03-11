import { Router } from 'express';
import { injectable, inject } from 'tsyringe';

import LoginController from '../controllers/LoginController';

@injectable()
export class LoginRoutes {
  private routes: Router = Router();

  constructor(
    @inject(LoginController) private loginController: LoginController,
  ) {}

  registerLoginRoutes(): Router {
    this.routes.post('/', (req, res, next) =>
      this.loginController.create(req, res, next),
    );
    return this.routes;
  }
}
