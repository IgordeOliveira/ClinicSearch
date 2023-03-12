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
  const allowedQuerys = ['name', 'state', 'from', 'to'];

  // verify if the querys contains at least one of the allowed ones
  if (!Object.keys(req.query).some(query => allowedQuerys.includes(query))) {
    return res.status(400).send({ error: 'NO_SEARCH_PARAMS' });
  }

  if ((req.query.from && !req.query.to) || (req.query.to && !req.query.from)) {
    return res.status(400).send({ error: 'MUST_HAVE_FROM_AND_TO' });
  }

  Object.keys(req.query).forEach(queryName => {
    req.query[queryName] = req.query[queryName]?.toString().toLowerCase();
  });

  next();
}
