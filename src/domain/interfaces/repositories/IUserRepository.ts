import { Login } from '../../models/Login';
import { PaginatedList } from '../../models/PaginatedList';
import { User } from '../../models/User';

export default interface IUserRepository {
  list(pageIndex: number, pageSize: number): Promise<PaginatedList<User>>;

  create(user: User): Promise<User>;

  find(id: string): Promise<User>;

  login(login: { email: string; password: string }): Promise<Login>;

  update(id: string, user: User): Promise<User>;
}
