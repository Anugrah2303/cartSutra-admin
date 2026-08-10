// src/interface/data/dashboard.ts
import type { OrderStatus } from "../../enums/order.enum";
import type { VendorApprovalStatus } from "../../enums/vendor.enum";

export interface DashboardStatsIF {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalVendors: number;
    totalCustomers: number;
    revenueChangePercent: number;
    ordersChangePercent: number;
    productsChangePercent: number;
    vendorsChangePercent: number;
    customersChangePercent: number;
}

export interface SalesOverviewPointIF {
    label: string;
    revenue: number;
}

export interface RecentOrderIF {
    _id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
}

export interface RecentVendorIF {
    _id: string;
    shopName: string;
    approvalStatus: VendorApprovalStatus;
    createdAt: string;
}

export interface LowStockProductIF {
    _id: string;
    title: string;
    stock: number;
    lowStockAlert: number;
}

export interface PendingApprovalIF {
    _id: string;
    title: string;
    sellerName: string;
    createdAt: string;
}

export interface DashboardOverviewIF {
    stats: DashboardStatsIF;
    salesOverview: SalesOverviewPointIF[];
    recentOrders: RecentOrderIF[];
    recentVendors: RecentVendorIF[];
    lowStockProducts: LowStockProductIF[];
    pendingApprovals: PendingApprovalIF[];
}