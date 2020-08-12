import { getRepository } from 'typeorm';

import IUserRepository from '../../domain/interfaces/repositories/IUserRepository';
import { User } from '../../domain/models/User';
import { UserEntity } from '../database/entities/UserEntity';

export default class UserRepository implements IUserRepository {
  private userRepo = () => {
    return getRepository(UserEntity);
  };

  async list(): Promise<User[]> {
    const response = await this.userRepo().find();

    const domainUsers = response.map((user) => {
      return new User(user);
    });

    return domainUsers;
  }

  async create(user: User): Promise<User> {
    const existingUser = await this.userRepo().findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      return new User(existingUser);
    }

    const response = await this.userRepo().save(user);

    const createdDomain = new User(response);

    return createdDomain;
  }

  async find(id: string): Promise<User> {
    const response = await this.userRepo().findOne({ where: { id } });

    return new User(response);
  }
}
