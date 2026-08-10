import { useState } from "react";
import Heading2 from "../components/common/Headings/Heading2";
import DateRangeFilter from "../components/reports/DateRangeFilter";
import SalesSummaryReport from "../components/reports/SalesSummaryReport";
import TopProductsReport from "../components/reports/TopProductsReport";
import TopVendorsReport from "../components/reports/TopVendorsReport";
import CategorySalesReport from "../components/reports/CategorySalesReport";
import CustomerGrowthReport from "../components/reports/CustomerGrowthReport";
import OrderStatusReport from "../components/reports/OrderStatusReport";
import LowStockReport from "../components/reports/LowStockReport";
import Card from "../components/common/Card";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonChart from "../components/common/skeletons/SkeletonChart";
import SkeletonListRows from "../components/common/skeletons/SkeletonListRows";
import {
  useGetSalesAnalytics,
  useGetTopProducts,
  useGetTopVendors,
  useGetCategorySales,
  useGetCustomerGrowth,
  useGetOrderStatusDistribution,
  useGetLowStockAnalytics,
  type DateRangeParams,
} from "../hooks/queries/analytics.queries";

const TABS = [
  { label: "Overview", value: "overview" },
  { label: "Products & Vendors", value: "products" },
  { label: "Customers", value: "customers" },
  { label: "Inventory", value: "inventory" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

const Reports = () => {
  const [range, setRange] = useState<DateRangeParams>({});
  const [tab, setTab] = useState<TabValue>("overview");

  const { data: salesData, isLoading: salesLoading } = useGetSalesAnalytics(range);
  const { data: productsData, isLoading: productsLoading } = useGetTopProducts(range);
  const { data: vendorsData, isLoading: vendorsLoading } = useGetTopVendors(range);
  const { data: categoryData, isLoading: categoryLoading } = useGetCategorySales(range);
  const { data: growthData, isLoading: growthLoading } = useGetCustomerGrowth(range);
  const { data: statusData, isLoading: statusLoading } = useGetOrderStatusDistribution(range);
  const { data: lowStockData, isLoading: lowStockLoading } = useGetLowStockAnalytics();

  return (
    <div className="flex flex-col gap-6">
      <Heading2 title="Reports" subtitle="Analytics and insights across sales, vendors, customers, and inventory" />

      <DateRangeFilter range={range} onChange={setRange} />

      <div className="flex gap-1 border-b overflow-x-auto" style={{ borderColor: "var(--border-light)" }}>
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className="px-4 py-2.5 text-sm font-medium cursor-pointer border-b-2 -mb-px whitespace-nowrap"
            style={{
              color: tab === t.value ? "var(--color-primary)" : "var(--text-muted)",
              borderColor: tab === t.value ? "var(--color-primary)" : "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          {salesLoading || !salesData?.data ? (
            <SkeletonStatsGrid count={4} />
          ) : (
            <SalesSummaryReport data={salesData.data} />
          )}

          {statusLoading || !statusData?.data ? (
            <Card title="Order status distribution"><SkeletonChart height="h-56" /></Card>
          ) : (
            <OrderStatusReport data={statusData.data} />
          )}
        </>
      )}

      {tab === "products" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {productsLoading || !productsData?.data ? (
            <Card title="Top products"><SkeletonListRows rows={6} hasAvatar /></Card>
          ) : (
            <TopProductsReport products={productsData.data} />
          )}

          {vendorsLoading || !vendorsData?.data ? (
            <Card title="Top vendors"><SkeletonListRows rows={6} hasAvatar /></Card>
          ) : (
            <TopVendorsReport vendors={vendorsData.data} />
          )}

          <div className="lg:col-span-2">
            {categoryLoading || !categoryData?.data ? (
              <Card title="Sales by category"><SkeletonChart /></Card>
            ) : (
              <CategorySalesReport data={categoryData.data} />
            )}
          </div>
        </div>
      )}

      {tab === "customers" && (
        <>
          {growthLoading || !growthData?.data ? (
            <Card title="Customer growth"><SkeletonChart /></Card>
          ) : (
            <CustomerGrowthReport data={growthData.data} />
          )}
        </>
      )}

      {tab === "inventory" && (
        <>
          {lowStockLoading || !lowStockData?.data ? (
            <Card title="Low stock products"><SkeletonListRows rows={6} /></Card>
          ) : (
            <LowStockReport products={lowStockData.data} />
          )}
        </>
      )}
    </div>
  );
};

export default Reports;