import { Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ValidationError } from 'yup';

import IUserRepository from '../../domain/interfaces/repositories/IUserRepository';
import { UserSchema } from '../../domain/models/User';
import BadRequest from '../helpers/errors/BadRequest';
import { IRequest } from '../routes/IRequest';

@injectable()
export default class UserController {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async index(req: IRequest, res: Response) {
    const response = await this.userRepository.list();

    return res.json(response);
  }

  async find(req: IRequest, res: Response) {
    return res.json(await this.userRepository.find(req.params.id));
  }

  async create(req: IRequest, res: Response, next: NextFunction) {
    try {
      const validatedUser = await UserSchema.validate(req.body, {
        abortEarly: false,
      });

      const createdUser = await this.userRepository.create(validatedUser);

      return res.status(201).json(createdUser);
    } catch (err) {
      if (err instanceof ValidationError) {
        next(new BadRequest(err.message, err.errors));
      } else {
        next(err);
      }
    }
  }
}
