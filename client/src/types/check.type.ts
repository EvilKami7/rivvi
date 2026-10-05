import type { CheckStatus } from './check-status.type.ts';

export type Check = {
  id: string;
  vin: string;
  status: CheckStatus;
  make: string | null;
  model: string | null;
  year: number | null;
  owners: number | null;
  hasAccident: boolean | null;
  createdAt: string;
  completedAt: string | null;
};
