// src/layout/searchConfig.ts
import {
  Package, FolderTree, Tags, ShoppingCart, Store, Users, UserCog,
  BadgePercent, Gift, LifeBuoy, RotateCcw, MessageSquareWarning,
  Wallet, Warehouse, Truck, CreditCard, Image, FileText, Newspaper,
} from "lucide-react";
import ENDPOINTS from "../constants/endpoints";
import { defineSearchCategory, type SearchCategoryConfig } from "../hooks/queries/search.queries";

const listOf = (res: unknown, keyPath: string[] = ["data", "data"]): unknown[] => {
  let cur: unknown = res;
  for (const k of keyPath) {
    if (typeof cur !== "object" || cur === null) return [];
    cur = (cur as Record<string, unknown>)[k];
  }
  return Array.isArray(cur) ? cur : [];
};

interface AvatarLike { URL?: string }

interface ProductRaw { _id: string; title: string; price: number; thumbnailImage?: AvatarLike; slug: string }
interface CategoryRaw { _id: string; name: string; level: string; avatar?: AvatarLike }
interface BrandRaw { _id: string; name: string; website?: string; avatar?: AvatarLike }
interface OrderRaw { _id: string; orderNumber: string; totalAmount: number }
interface VendorRaw { _id: string; shopName: string; vendorId: string; shopLogo?: AvatarLike }
interface CustomerRaw { _id: string; firstName: string; lastName: string; email: string; avatar?: AvatarLike }
interface AdminRaw { _id: string; firstName: string; lastName: string; email: string; avatar?: AvatarLike }
interface CouponRaw { _id: string; code: string; discountType: string; discountValue: number }
interface GiftCardRaw { _id: string; code: string; balance: number }
interface TicketRaw { _id: string; subject: string; ticketNumber: string }
interface ReturnRaw { _id: string; returnNumber: string; title?: string; thumbnail?: string }
interface ReviewRaw { _id: string; title?: string; comment?: string; rating: number }
interface RefundRaw { _id: string; refundNumber: string; amount: number }
interface WarehouseRaw { _id: string; name: string; code: string }
interface ShipmentRaw { _id: string; shipmentNumber: string; orderNumber: string }
interface PayoutRaw { _id: string; payoutNumber: string; amount: number }
interface BannerRaw { _id: string; title: string; position: string; image?: AvatarLike }
interface PageRaw { _id: string; title: string; slug: string }
interface BlogRaw { _id: string; title: string; status: string; coverImage?: AvatarLike }

export const SEARCH_CONFIGS: SearchCategoryConfig[] = [
  defineSearchCategory<ProductRaw>({
    key: "products", label: "Products", icon: Package, endpoint: ENDPOINTS.PRODUCTS.FETCH,
    extract: (res) => listOf(res) as ProductRaw[],
    toResult: (p) => ({ id: p._id, title: p.title, subtitle: `₹${p.price}`, image: p.thumbnailImage?.URL, path: `/admin/products/${p.slug}` }),
  }),
  defineSearchCategory<CategoryRaw>({
    key: "categories", label: "Categories", icon: FolderTree, endpoint: ENDPOINTS.CATEGORY.FETCH,
    extract: (res) => listOf(res) as CategoryRaw[],
    toResult: (c) => ({ id: c._id, title: c.name, subtitle: c.level, image: c.avatar?.URL, path: `/admin/categories/${c._id}` }),
  }),
  defineSearchCategory<BrandRaw>({
    key: "brands", label: "Brands", icon: Tags, endpoint: ENDPOINTS.BRAND.FETCH,
    extract: (res) => listOf(res) as BrandRaw[],
    toResult: (b) => ({ id: b._id, title: b.name, subtitle: b.website, image: b.avatar?.URL, path: `/admin/brands` }),
  }),
  defineSearchCategory<OrderRaw>({
    key: "orders", label: "Orders", icon: ShoppingCart, endpoint: ENDPOINTS.ORDER.FETCH,
    extract: (res) => listOf(res) as OrderRaw[],
    toResult: (o) => ({ id: o._id, title: `#${o.orderNumber}`, subtitle: `₹${o.totalAmount?.toLocaleString?.() ?? o.totalAmount}`, path: `/admin/orders` }),
  }),
  defineSearchCategory<VendorRaw>({
    key: "vendors", label: "Vendors", icon: Store, endpoint: ENDPOINTS.VENDOR.FETCH,
    extract: (res) => listOf(res) as VendorRaw[],
    toResult: (v) => ({ id: v._id, title: v.shopName, subtitle: v.vendorId, image: v.shopLogo?.URL, path: `/admin/vendors/${v._id}` }),
  }),
  defineSearchCategory<CustomerRaw>({
    key: "customers", label: "Customers", icon: Users, endpoint: ENDPOINTS.CUSTOMER.FETCH,
    extract: (res) => listOf(res) as CustomerRaw[],
    toResult: (c) => ({ id: c._id, title: `${c.firstName} ${c.lastName}`, subtitle: c.email, image: c.avatar?.URL, path: `/admin/customers` }),
  }),
  defineSearchCategory<AdminRaw>({
    key: "admins", label: "Admins", icon: UserCog, endpoint: ENDPOINTS.ADMIN.FETCH,
    extract: (res) => listOf(res) as AdminRaw[],
    toResult: (a) => ({ id: a._id, title: `${a.firstName} ${a.lastName}`, subtitle: a.email, image: a.avatar?.URL, path: `/admin/admins` }),
  }),
  defineSearchCategory<CouponRaw>({
    key: "coupons", label: "Coupons", icon: BadgePercent, endpoint: ENDPOINTS.COUPON.FETCH,
    extract: (res) => listOf(res, ["data", "coupons"]) as CouponRaw[],
    toResult: (c) => ({ id: c._id, title: c.code, subtitle: c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `₹${c.discountValue}`, path: `/admin/coupons` }),
  }),
  defineSearchCategory<GiftCardRaw>({
    key: "giftCards", label: "Gift Cards", icon: Gift, endpoint: ENDPOINTS.GIFT_CARD.FETCH,
    extract: (res) => listOf(res) as GiftCardRaw[],
    toResult: (g) => ({ id: g._id, title: g.code, subtitle: `₹${g.balance}`, path: `/admin/gift-cards` }),
  }),
  defineSearchCategory<TicketRaw>({
    key: "tickets", label: "Tickets", icon: LifeBuoy, endpoint: ENDPOINTS.TICKET.FETCH,
    extract: (res) => listOf(res) as TicketRaw[],
    toResult: (t) => ({ id: t._id, title: t.subject, subtitle: `#${t.ticketNumber}`, path: `/admin/tickets` }),
  }),
  defineSearchCategory<ReturnRaw>({
    key: "returns", label: "Returns", icon: RotateCcw, endpoint: ENDPOINTS.RETURN.FETCH_ADMIN,
    extract: (res) => listOf(res) as ReturnRaw[],
    toResult: (r) => ({ id: r._id, title: `#${r.returnNumber}`, subtitle: r.title, image: r.thumbnail, path: `/admin/returns` }),
  }),
  defineSearchCategory<ReviewRaw>({
    key: "reviews", label: "Reviews", icon: MessageSquareWarning, endpoint: ENDPOINTS.REVIEW.FETCH_ADMIN,
    extract: (res) => listOf(res) as ReviewRaw[],
    toResult: (r) => ({ id: r._id, title: r.title || r.comment?.slice(0, 40) || "Review", subtitle: `${r.rating}★`, path: `/admin/reviews` }),
  }),
  defineSearchCategory<RefundRaw>({
    key: "refunds", label: "Refunds", icon: Wallet, endpoint: ENDPOINTS.REFUND.FETCH_ADMIN,
    extract: (res) => listOf(res) as RefundRaw[],
    toResult: (r) => ({ id: r._id, title: `#${r.refundNumber}`, subtitle: `₹${r.amount}`, path: `/admin/refunds` }),
  }),
  defineSearchCategory<WarehouseRaw>({
    key: "warehouses", label: "Warehouses", icon: Warehouse, endpoint: ENDPOINTS.WAREHOUSE.FETCH_ADMIN,
    extract: (res) => listOf(res) as WarehouseRaw[],
    toResult: (w) => ({ id: w._id, title: w.name, subtitle: w.code, path: `/admin/warehouses` }),
  }),
  defineSearchCategory<ShipmentRaw>({
    key: "shipments", label: "Shipments", icon: Truck, endpoint: ENDPOINTS.SHIPMENT.FETCH,
    extract: (res) => listOf(res) as ShipmentRaw[],
    toResult: (s) => ({ id: s._id, title: `#${s.shipmentNumber}`, subtitle: `Order #${s.orderNumber}`, path: `/admin/shipping` }),
  }),
  defineSearchCategory<PayoutRaw>({
    key: "payouts", label: "Vendor Payouts", icon: CreditCard, endpoint: ENDPOINTS.PAYOUT.FETCH_ADMIN,
    extract: (res) => listOf(res) as PayoutRaw[],
    toResult: (p) => ({ id: p._id, title: `#${p.payoutNumber}`, subtitle: `₹${p.amount}`, path: `/admin/vendor-payouts` }),
  }),
  defineSearchCategory<BannerRaw>({
    key: "banners", label: "Banners", icon: Image, endpoint: ENDPOINTS.BANNER.FETCH,
    extract: (res) => listOf(res) as BannerRaw[],
    toResult: (b) => ({ id: b._id, title: b.title, subtitle: b.position, image: b.image?.URL, path: `/admin/cms` }),
  }),
  defineSearchCategory<PageRaw>({
    key: "pages", label: "Pages", icon: FileText, endpoint: ENDPOINTS.PAGE.FETCH,
    extract: (res) => listOf(res) as PageRaw[],
    toResult: (p) => ({ id: p._id, title: p.title, subtitle: `/${p.slug}`, path: `/admin/cms` }),
  }),
  defineSearchCategory<BlogRaw>({
    key: "blogs", label: "Blogs", icon: Newspaper, endpoint: ENDPOINTS.BLOG.FETCH,
    extract: (res) => listOf(res) as BlogRaw[],
    toResult: (b) => ({ id: b._id, title: b.title, subtitle: b.status, image: b.coverImage?.URL, path: `/admin/cms` }),
  }),
];