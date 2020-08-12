import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ValidationError } from 'yup';

import IUserRepository from '../../domain/interfaces/repositories/IUserRepository';
import { UserSchema } from '../../domain/models/User';

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

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedUser = await UserSchema.validate(req.body);

      const createdUser = await this.userRepository.create(validatedUser);

      return res.status(201).json(createdUser);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.statusCode = 400;
        next(err);
      }
    }
  }
}
