import { User } from '../../models/User';

export default interface IUserRepository {
  list(): Promise<User[]>;

  create(user: User): Promise<User>;

  find(id: string): Promise<User>;
}
