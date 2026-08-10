import { OrderStatus } from "../../enums/order.enum";

export interface SalesDayWiseIF {
  _id: string; // date string YYYY-MM-DD
  revenue: number;
  orders: number;
  itemsSold: number;
}

export interface SalesTotalsIF {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
}

export interface SalesAnalyticsIF {
  range: { start: string; end: string };
  dayWise: SalesDayWiseIF[];
  totals: SalesTotalsIF;
}

export interface TopProductIF {
  _id: string;
  title: string;
  thumbnail: string;
  unitsSold: number;
  revenue: number;
}

export interface TopVendorIF {
  _id: string;
  unitsSold: number;
  revenue: number;
  vendor: {
    shopName: string;
    vendorId: string;
    shopLogo?: { URL: string; PUBLIC_ID: string };
  };
}

export interface CategorySalesIF {
  _id: string | null;
  categoryName: string | null;
  revenue: number;
  unitsSold: number;
}

export interface CustomerGrowthPointIF {
  _id: string; // date string
  newCustomers: number;
}

export interface OrderStatusDistributionIF {
  _id: OrderStatus;
  count: number;
}

export interface LowStockAnalyticsIF {
  _id: string;
  title: string;
  slug: string;
  stock: number;
  lowStockAlert: number;
  seller: string;
}