import { http, type RequestConfig } from '../core/base-api';
import type { Check } from '../types/check.type';

export const checksApi = {
  list: (config?: Omit<RequestConfig, 'data' | 'method'>) =>
    http.get<Check[]>('/api/checks', config),
  create: (vin: string) => http.post<Check>('/api/checks', { vin }),
};
