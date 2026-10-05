import cors from 'cors';
import express from 'express';
import type { CheckController } from './controllers/check.controller.js';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error-handler.js';
import { createCheckRouter } from './routes/check.routes.js';

export function createApp(checkController: CheckController) {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/checks', createCheckRouter(checkController));
  app.use(errorHandler);

  return app;
}
