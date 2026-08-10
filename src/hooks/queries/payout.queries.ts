import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { PayoutIF } from "../../interface/data/payout";

interface PaginatedIF<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export interface PayoutSummaryIF {
  totalPaidOut: number;
  totalPending: number;
  pendingCount: number;
  completedCount: number;
}

export interface VendorPayoutFiltersParams {
  search?: string;
  status?: string;
  method?: string;
  vendor?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

const toQuery = (params: object) => {
  const search = new URLSearchParams();
  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

export const useGetVendorPayouts = (filters: VendorPayoutFiltersParams) => {
  const query = toQuery(filters);
  return useApiQuery<ResponseIF<PaginatedIF<PayoutIF>>>([QUERY_KEY.PAYOUT, query], () =>
    new HttpService<PaginatedIF<PayoutIF>>(`${ENDPOINTS.PAYOUT.FETCH_ADMIN}${query}`).get()
  );
};

export const useGetVendorPayoutSummary = () =>
  useApiQuery<ResponseIF<PayoutSummaryIF>>([QUERY_KEY.PAYOUT, "summary"], () =>
    new HttpService<PayoutSummaryIF>(ENDPOINTS.PAYOUT.SUMMARY).get()
  );

export const useProcessVendorPayout = () =>
  useApiMutation(({ id, transactionRef }: { id: string; transactionRef: string }) =>
    new HttpService(ENDPOINTS.PAYOUT.PROCESS(id), true).patch({ transactionRef }), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PAYOUT] }),
  });

export const useRejectVendorPayout = () =>
  useApiMutation(({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
    new HttpService(ENDPOINTS.PAYOUT.REJECT(id), true).patch({ rejectionReason }), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PAYOUT] }),
  });