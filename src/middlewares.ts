import { NextFunction, Request, Response } from 'express';

import ErrorResponse from './interfaces/ErrorResponse';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    error: err.message,
  });
}

export function checkSearchParams(req: Request, res: Response, next: NextFunction) {
  if (Object.keys(req.query).length !== 0) {
    Object.keys(req.query).forEach(queryName => {
      req.query[queryName] = req.query[queryName]?.toString().toLowerCase();
    });

    next();
  } else {
    res.status(400).send({ data: 'missing search query params' });
  }

}
