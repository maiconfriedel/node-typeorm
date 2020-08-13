import { Request } from 'express';

import { User } from '../../domain/models/User';

export interface IRequest extends Request {
  user: { user: User; scope: string[]; iat: Date; exp: Date };
}
