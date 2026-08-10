import { IndianRupee, ShoppingCart, Package, Store, Users, RefreshCw } from "lucide-react";
import Heading2 from "../components/common/Headings/Heading2";
import StatCard from "../components/dashboard/StatCard";
import SalesChart from "../components/dashboard/SalesChart";
import RecentOrders from "../components/dashboard/RecentOrders";
import RecentVendors from "../components/dashboard/RecentVendors";
import LowStockAlert from "../components/dashboard/LowStockAlert";
import PendingApprovals from "../components/dashboard/PendingApprovals";
import Card from "../components/common/Card";
import SkeletonStatCard from "../components/common/skeletons/SkeletonStatCard";
import SkeletonChart from "../components/common/skeletons/SkeletonChart";
import SkeletonListRows from "../components/common/skeletons/SkeletonListRows";
import { useGetDashboardOverview } from "../hooks/queries/dashboard.queries";

const Dashboard = () => {
  const { data, isLoading, isError, refetch, isFetching } = useGetDashboardOverview();
  const overview = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Heading2 title="Dashboard" subtitle="A snapshot of how your marketplace is performing" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>

        <Card title="Sales overview">
          <SkeletonChart />
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Recent orders"><SkeletonListRows rows={5} /></Card>
          <Card title="New vendor signups"><SkeletonListRows rows={5} /></Card>
          <Card title="Low stock alerts"><SkeletonListRows rows={5} /></Card>
          <Card title="Products awaiting approval"><SkeletonListRows rows={5} /></Card>
        </div>
      </div>
    );
  }

  if (isError || !overview) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p className="text-sm" style={{ color: "var(--error)" }}>Failed to load dashboard data.</p>
        <button onClick={() => refetch()} className="flex items-center gap-2 rounded-md px-3.5 py-1.5 text-sm text-white cursor-pointer" style={{ backgroundColor: "var(--color-primary)" }}>
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const { stats, salesOverview, recentOrders, recentVendors, lowStockProducts, pendingApprovals } = overview;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Heading2 title="Dashboard" subtitle="A snapshot of how your marketplace is performing" />
        <button onClick={() => refetch()} disabled={isFetching} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer disabled:opacity-50" style={{ borderColor: "var(--border-light)", color: "var(--text-secondary)" }}>
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} change={stats.revenueChangePercent} Icon={IndianRupee} />
        <StatCard label="Orders" value={stats.totalOrders.toLocaleString()} change={stats.ordersChangePercent} Icon={ShoppingCart} />
        <StatCard label="Products" value={stats.totalProducts.toLocaleString()} change={stats.productsChangePercent} Icon={Package} />
        <StatCard label="Vendors" value={stats.totalVendors.toLocaleString()} change={stats.vendorsChangePercent} Icon={Store} />
        <StatCard label="Customers" value={stats.totalCustomers.toLocaleString()} change={stats.customersChangePercent} Icon={Users} />
      </div>

      <SalesChart data={salesOverview} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentOrders orders={recentOrders} />
        <RecentVendors vendors={recentVendors} />
        <LowStockAlert products={lowStockProducts} />
        <PendingApprovals items={pendingApprovals} />
      </div>
    </div>
  );
};

export default Dashboard;