import type { ItemIF } from "./item.js";

export interface WishlistIF {
    user: string;
    items: ItemIF[];
}