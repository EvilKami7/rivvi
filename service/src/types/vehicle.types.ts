export type VehicleData = {
  make: string;
  model: string;
  year: number;
  owners: number;
  hasAccident: boolean;
};

export type VehicleProvider = {
  lookup(vin: string): Promise<VehicleData>;
};
