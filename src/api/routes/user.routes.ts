import { Router } from 'express';
import validJwt, { RequestHandler } from 'express-jwt';
import guard from 'express-jwt-permissions';
import { inject, injectable } from 'tsyringe';

import UserController from '../controllers/UserController';

@injectable()
export class UserRoutes {
  private routes: Router = Router();

  private guard: any;

  private validJwtMiddleware: RequestHandler;

  constructor(@inject(UserController) private userController: UserController) {
    this.guard = guard({ permissionsProperty: 'scope' });
    this.validJwtMiddleware = validJwt({
      secret: process.env.JWT_SECRET,
      algorithms: ['HS256'],
    });
  }

  registerUserRoutes(): Router {
    // doesn't need authentication
    this.routes.post('/', (req, res, next) =>
      this.userController.create(req, res, next),
    );
    // must authenticate to the routes below
    this.routes.use(this.validJwtMiddleware);

    this.routes.get('/', this.guard.check('users.read'), (req, res) =>
      this.userController.index(req, res),
    );

    this.routes.get('/:id', this.guard.check('users.read'), (req, res) =>
      this.userController.find(req, res),
    );

    this.routes.put(
      '/:id',
      this.guard.check([['admin'], ['users.write']]),
      (req, res, next) => this.userController.update(req, res, next),
    );

    return this.routes;
  }
}
