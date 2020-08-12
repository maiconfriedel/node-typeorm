import IUserRepository from '../../domain/interfaces/repositories/IUserRepository';
import { getRepository } from 'typeorm';
import { UserEntity } from '../database/entities/UserEntity';
import { User } from '../../domain/models/User';

export default class UserRepository implements IUserRepository {
  private getUserRepo() {
    return getRepository(UserEntity);
  }

  async list(): Promise<User[]> {
    const response = await this.getUserRepo().find();

    const domainUsers = response.map((user) => {
      return new User(user);
    });

    return domainUsers;
  }
}
