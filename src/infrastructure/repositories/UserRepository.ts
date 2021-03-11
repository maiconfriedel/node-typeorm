import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { ValidationError } from 'yup';

import IUserRepository from '../../domain/interfaces/repositories/IUserRepository';
import { Login } from '../../domain/models/Login';
import { PaginatedList } from '../../domain/models/PaginatedList';
import { User } from '../../domain/models/User';
import { UserEntity } from '../database/entities/UserEntity';

export default class UserRepository implements IUserRepository {
  private encryptPassword = (password: string) => {
    const algorithm = 'aes-256-ctr';
    const secretKey = process.env.CRYPTO_KEY;

    const cipher = crypto.createCipher(algorithm, secretKey);
    let crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
  };

  async list(
    pageIndex: number,
    pageSize: number,
  ): Promise<PaginatedList<User>> {
    const response = await UserEntity.find({
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });

    return new PaginatedList(
      response,
      pageIndex,
      pageSize,
      await UserEntity.count(),
    );
  }

  async create(user: User): Promise<User> {
    const existingUser = await UserEntity.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      return existingUser;
    }

    if (!user.scopes) user.scopes = [];

    user.password = this.encryptPassword(user.password);

    const response = UserEntity.create(user);

    await response.save();

    delete response.password;
    return response;
  }

  async find(id: string): Promise<User> {
    const response = await UserEntity.findOne({
      where: { id },
    });

    return response;
  }

  async update(id: string, user: User): Promise<User> {
    let userEntity = await UserEntity.findOne({
      where: { id },
    });

    if (!userEntity) {
      throw new ValidationError([`User with id ${id} not found`], id, 'id');
    }

    if (user.email || user.password)
      throw new ValidationError(
        'Email or password cannot be updated',
        user.email,
        'email_password',
      );

    const updatedEntity = UserEntity.merge(userEntity, UserEntity.create(user));

    userEntity = updatedEntity;

    return userEntity.save();
  }

  async login(login: { email: string; password: string }): Promise<Login> {
    const { email, password } = login;

    const user = await UserEntity.findOne({
      where: { email, password: this.encryptPassword(password) },
    });

    if (!user) {
      throw new ValidationError(
        ['Invalid email and password provided'],
        email,
        'email_password',
      );
    }

    const accessToken = jwt.sign(
      {
        user,
        scope: user.scopes,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    return {
      user,
      accessToken,
    };
  }
}
