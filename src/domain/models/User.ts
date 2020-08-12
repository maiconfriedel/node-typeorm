import * as yup from 'yup';

export class User {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  constructor(user: Omit<User, 'id'>) {
    Object.assign(this, user);
  }
}

export const UserSchema = yup.object<User>({
  id: yup.string(),
  firstName: yup.string().required('First name is required').trim(),
  lastName: yup.string().required('Last name is required').trim(),
  email: yup
    .string()
    .email('Email is not in a valid email format')
    .required('Email is required')
    .trim(),
});
