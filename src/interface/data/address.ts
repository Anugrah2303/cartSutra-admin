import type { AddressType } from "../../enums/address.enum.js";

export interface AddressIF extends Document {
    user: string;
    
    fullName: string;
    phone: string;
    alternatePhone?: string;

    addressLine1: string;
    addressLine2?: string;

    landmark?: string;

    city: string;
    state: string;
    country: string;
    postalCode: string;

    addressType: AddressType;

    deliveryInstructions?: string;

    isDefault: boolean;
}