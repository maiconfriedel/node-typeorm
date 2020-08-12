import { User } from '../../models/User';

export default interface IUserRepository {
  list(): Promise<User[]>;
}
