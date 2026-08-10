import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { RefundIF } from "../../interface/data/refund";

interface PaginatedIF<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export interface RefundFiltersParams {
  search?: string;
  status?: string;
  source?: string;
  customer?: string;
  vendor?: string;
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

export const useGetRefunds = (filters: RefundFiltersParams) => {
  const query = toQuery(filters);
  return useApiQuery<ResponseIF<PaginatedIF<RefundIF>>>([QUERY_KEY.REFUND, query], () =>
    new HttpService<PaginatedIF<RefundIF>>(`${ENDPOINTS.REFUND.FETCH_ADMIN}${query}`).get()
  );
};

export const useProcessRefund = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.REFUND.PROCESS(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.REFUND] }),
  });

export const useRetryRefund = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.REFUND.RETRY(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.REFUND] }),
  });

export const useCancelRefund = () =>
  useApiMutation(({ id, reason }: { id: string; reason?: string }) =>
    new HttpService(ENDPOINTS.REFUND.CANCEL(id), true).patch({ reason }), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.REFUND] }),
  });