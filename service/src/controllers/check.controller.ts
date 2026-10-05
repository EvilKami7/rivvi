import type { NextFunction, Request, Response } from 'express';
import type { CheckService } from '../services/check.service.js';
import { createCheckSchema } from '../validators/check.schema.js';

export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { vin } = createCheckSchema.parse(req.body);
      const check = await this.checkService.create(vin);
      res.status(202).json(check);
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.checkService.list());
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== 'string') {
        res.status(400).json({ message: 'Invalid check id' });
        return;
      }

      const check = await this.checkService.getById(id);
      if (!check) {
        res.status(404).json({ message: 'Check not found' });
        return;
      }
      res.json(check);
    } catch (error) {
      next(error);
    }
  };
}
