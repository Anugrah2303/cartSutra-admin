export interface WarehouseAddressIF {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface WarehouseIF {
  _id: string;
  vendor: string;
  code: string;
  name: string;
  address: WarehouseAddressIF;
  contactPerson: string;
  contactPhone: string;
  totalCapacity?: number | null;
  isDefault: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}