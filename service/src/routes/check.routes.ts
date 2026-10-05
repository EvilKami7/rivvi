import { Router } from 'express';
import type { CheckController } from '../controllers/check.controller.js';

export function createCheckRouter(controller: CheckController) {
  const router = Router();

  router.post('/', controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);

  return router;
}
