/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';

export default async function handleError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  if (err.statusCode || err.status) statusCode = err.statusCode || err.status;

  res.status(statusCode);
  const { errors, message } = err;
  res.json({
    message,
    errors,
  });
}
