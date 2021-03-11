import { Login } from '../../models/Login';
import { User } from '../../models/User';

export default interface IUserRepository {
  list(): Promise<User[]>;

  create(user: User): Promise<User>;

  find(id: string): Promise<User>;

  login(login: { email: string; password: string }): Promise<Login>;

  update(id: string, user: User): Promise<User>;
}
