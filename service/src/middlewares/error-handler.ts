import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  void next;

  if (error instanceof ZodError) {
    res.status(400).json({ message: error.issues[0]?.message ?? 'Invalid request' });
    return;
  }

  const message = error instanceof Error ? error.message : 'Unexpected error';
  res.status(500).json({ message });
};
