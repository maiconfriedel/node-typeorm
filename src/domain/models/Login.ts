import * as yup from 'yup';

import { User } from './User';

export class Login {
  public user: User;

  public accessToken: string;
}

export const LoginSchema = yup.object({
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
});
