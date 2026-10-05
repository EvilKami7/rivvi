import type { VehicleData, VehicleProvider } from '../types/vehicle.types';

export class MockVehicleProvider implements VehicleProvider {
  async lookup(vin: string): Promise<VehicleData> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const catalog = [
      { make: 'Toyota', model: 'Camry', year: 2020 },
      { make: 'Kia', model: 'Sportage', year: 2019 },
      { make: 'Volkswagen', model: 'Polo', year: 2021 },
    ];
    const seed = [...vin].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const vehicle = catalog[seed % catalog.length];

    return { ...vehicle, owners: (seed % 4) + 1, hasAccident: seed % 3 === 0 };
  }
}
