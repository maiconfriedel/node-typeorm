import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ValidationError } from 'yup';

import IUserRepository from '../../domain/interfaces/repositories/IUserRepository';
import { LoginSchema } from '../../domain/models/Login';
import BadRequest from '../helpers/errors/BadRequest';

@injectable()
export default class LoginController {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const loginValidated = await LoginSchema.validate(req.body, {
        abortEarly: false,
      });

      const response = await this.userRepository.login(loginValidated);

      return res.status(201).json(response);
    } catch (err) {
      if (err instanceof ValidationError) {
        next(new BadRequest(err.message, err.errors));
      } else {
        next(err);
      }
    }
  }
}
