export interface CartItemIF {
    product: string;
    variant: string | null;
    quantity: number;
    addedAt: Date;
}

export interface CartIF extends Document {
    user: string;
    items: CartItemIF[];
    _id: string
    createdAt: Date;
    updatedAt: Date;
}