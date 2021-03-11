import * as yup from 'yup';

export class User {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  password: string;

  scopes: string[];
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
  password: yup
    .string()
    .required('Password is required')
    .trim()
    .min(4, 'Password must have at least 4 characters'),
  scopes: yup.array(yup.string()),
});
