import { container, Lifecycle } from 'tsyringe';
import UserRepository from '../infrastructure/repositories/UserRepository';

export default class ServiceExtensions {
  constructor() {
    container.register(
      'IUserRepository',
      { useClass: UserRepository },
      {
        lifecycle: Lifecycle.Transient,
      }
    );
  }
}
