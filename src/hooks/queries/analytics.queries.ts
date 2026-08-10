import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import HttpService from "../../services/http.service";
import type { ResponseIF } from "../../interface/response";
import type {
  SalesAnalyticsIF,
  TopProductIF,
  TopVendorIF,
  CategorySalesIF,
  CustomerGrowthPointIF,
  OrderStatusDistributionIF,
  LowStockAnalyticsIF,
} from "../../interface/data/analytics";

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

const toQuery = (params: object) => {
  const search = new URLSearchParams();
  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

export const useGetSalesAnalytics = (range: DateRangeParams) => {
  const query = toQuery(range);
  return useApiQuery<ResponseIF<SalesAnalyticsIF>>([QUERY_KEY.ANALYTICS, "sales", query], () =>
    new HttpService<SalesAnalyticsIF>(`${ENDPOINTS.ANALYTICS.SALES}${query}`).get()
  );
};

export const useGetTopProducts = (range: DateRangeParams, limit = 10) => {
  const query = toQuery({ ...range, limit });
  return useApiQuery<ResponseIF<TopProductIF[]>>([QUERY_KEY.ANALYTICS, "top-products", query], () =>
    new HttpService<TopProductIF[]>(`${ENDPOINTS.ANALYTICS.TOP_PRODUCTS}${query}`).get()
  );
};

export const useGetTopVendors = (range: DateRangeParams, limit = 10) => {
  const query = toQuery({ ...range, limit });
  return useApiQuery<ResponseIF<TopVendorIF[]>>([QUERY_KEY.ANALYTICS, "top-vendors", query], () =>
    new HttpService<TopVendorIF[]>(`${ENDPOINTS.ANALYTICS.TOP_VENDORS}${query}`).get()
  );
};

export const useGetCategorySales = (range: DateRangeParams) => {
  const query = toQuery(range);
  return useApiQuery<ResponseIF<CategorySalesIF[]>>([QUERY_KEY.ANALYTICS, "category-sales", query], () =>
    new HttpService<CategorySalesIF[]>(`${ENDPOINTS.ANALYTICS.CATEGORY_SALES}${query}`).get()
  );
};

export const useGetCustomerGrowth = (range: DateRangeParams) => {
  const query = toQuery(range);
  return useApiQuery<ResponseIF<CustomerGrowthPointIF[]>>([QUERY_KEY.ANALYTICS, "customer-growth", query], () =>
    new HttpService<CustomerGrowthPointIF[]>(`${ENDPOINTS.ANALYTICS.CUSTOMER_GROWTH}${query}`).get()
  );
};

export const useGetOrderStatusDistribution = (range: DateRangeParams) => {
  const query = toQuery(range);
  return useApiQuery<ResponseIF<OrderStatusDistributionIF[]>>([QUERY_KEY.ANALYTICS, "order-status", query], () =>
    new HttpService<OrderStatusDistributionIF[]>(`${ENDPOINTS.ANALYTICS.ORDER_STATUS}${query}`).get()
  );
};

// note: backend's low-stock analytics endpoint takes no date range — it's a live snapshot
export const useGetLowStockAnalytics = () =>
  useApiQuery<ResponseIF<LowStockAnalyticsIF[]>>([QUERY_KEY.ANALYTICS, "low-stock"], () =>
    new HttpService<LowStockAnalyticsIF[]>(ENDPOINTS.ANALYTICS.LOW_STOCK).get()
  );