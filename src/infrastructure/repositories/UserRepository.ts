import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { ValidationError } from 'yup';

import IUserRepository from '../../domain/interfaces/repositories/IUserRepository';
import { Login } from '../../domain/models/Login';
import { User } from '../../domain/models/User';
import { UserEntity } from '../database/entities/UserEntity';

export default class UserRepository implements IUserRepository {
  private userRepo = () => {
    return getRepository(UserEntity);
  };

  private encryptPassword = (password: string) => {
    const algorithm = 'aes-256-ctr';
    const secretKey = process.env.CRYPTO_KEY;

    const cipher = crypto.createCipher(algorithm, secretKey);
    let crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
  };

  async list(): Promise<User[]> {
    const response = await this.userRepo().find();

    return response;
  }

  async create(user: User): Promise<User> {
    const existingUser = await this.userRepo().findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      return existingUser;
    }

    user.password = this.encryptPassword(user.password);

    const response = await this.userRepo().save(user);
    delete response.password;
    return response;
  }

  async find(id: string): Promise<User> {
    const response = await this.userRepo().findOne({
      where: { id },
    });

    return response;
  }

  async login(login: { email: string; password: string }): Promise<Login> {
    const { email, password } = login;

    const user = await this.userRepo().findOne({
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
