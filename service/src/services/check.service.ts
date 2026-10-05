import type { PrismaClient, VehicleCheck } from '@prisma/client';
import type { Server } from 'socket.io';
import type { VehicleProvider } from '../types/vehicle.types';

export class CheckService {
  constructor(
    private readonly db: PrismaClient,
    private readonly provider: VehicleProvider,
    private readonly io: Server,
  ) {}

  async create(vin: string) {
    const check = await this.db.vehicleCheck.create({ data: { vin, status: 'created' } });
    this.emitUpdatedCheck(check);
    void this.process(check.id, vin);
    return check;
  }

  list() {
    return this.db.vehicleCheck.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
  }

  getById(id: string) {
    return this.db.vehicleCheck.findUnique({ where: { id } });
  }

  private async process(id: string, vin: string) {
    try {
      const processingCheck = await this.db.vehicleCheck.update({
        where: { id },
        data: { status: 'processing' },
      });
      this.emitUpdatedCheck(processingCheck);

      const result = await this.provider.lookup(vin);
      const completedCheck = await this.db.vehicleCheck.update({
        where: { id },
        data: { ...result, status: 'completed', completedAt: new Date() },
      });
      this.emitUpdatedCheck(completedCheck);
    } catch (error) {
      console.error('Vehicle lookup failed', error);
      const failedCheck = await this.db.vehicleCheck.update({
        where: { id },
        data: { status: 'failed' },
      });
      this.emitUpdatedCheck(failedCheck);
    }
  }

  private emitUpdatedCheck(check: VehicleCheck) {
    this.io.emit('check:updated', check);
  }
}
