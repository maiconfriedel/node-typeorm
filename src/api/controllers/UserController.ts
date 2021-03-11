/* eslint-disable radix */
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
    let pageIndex = 1;
    let pageSize = 10;

    if (req.query.pageIndex) {
      pageIndex = parseInt(req.query.pageIndex?.toString());
    }

    if (req.query.pageSize) {
      pageSize = parseInt(req.query.pageSize?.toString());
    }

    return res.json(await this.userRepository.list(pageIndex, pageSize));
  }

  async find(req: Request, res: Response) {
    return res.json(await this.userRepository.find(req.params.id));
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      return res.json(
        await this.userRepository.update(req.params.id, req.body),
      );
    } catch (err) {
      if (err instanceof ValidationError) {
        next(new BadRequest(err.message, err.errors));
      } else {
        next(err);
      }
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedUser = await UserSchema.validate(req.body, {
        abortEarly: false,
      });

      return res
        .status(201)
        .json(await this.userRepository.create(validatedUser));
    } catch (err) {
      if (err instanceof ValidationError) {
        next(new BadRequest(err.message, err.errors));
      } else {
        next(err);
      }
    }
  }
}
