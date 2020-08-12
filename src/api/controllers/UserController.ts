import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';

import IUserRepository from '../../domain/interfaces/repositories/IUserRepository';

@injectable()
export default class UserController {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async index(req: Request, res: Response) {
    const response = await this.userRepository.list();

    return res.json(response);
  }
}
