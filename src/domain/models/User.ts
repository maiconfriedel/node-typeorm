export class User {
  id: number;

  firstName: string;

  lastName: string;

  age: number;

  constructor(user: Omit<User, 'id'>) {
    Object.assign(this, user);
  }
}
