import { Response, NextFunction, Request } from 'express';
import { injectable, inject } from 'tsyringe';
import { ValidationError } from 'yup';

import IUserRepository from '../../domain/interfaces/repositories/IUserRepository';
import { UserSchema } from '../../domain/models/User';
import BadRequest from '../helpers/errors/BadRequest';

@injectable()
export default class UserController {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async index(req: Request, res: Response) {
    const response = await this.userRepository.list();

    return res.json(response);
  }

  async find(req: Request, res: Response) {
    return res.json(await this.userRepository.find(req.params.id));
  }

  async update(req: Request, res: Response) {
    return res.json(await this.userRepository.update(req.params.id, req.body));
  }

  async create(req: Request, res: Response, next: NextFunction) {
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
