import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { ReturnIF } from "../../interface/data/return";
import type { RefundMethod } from "../../enums/return.enum";

interface PaginatedIF<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export interface ReturnFiltersParams {
  search?: string;
  status?: string;
  vendor?: string;
  customer?: string;
  reason?: string;
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

export const useGetReturns = (filters: ReturnFiltersParams) => {
  const query = toQuery(filters);
  return useApiQuery<ResponseIF<PaginatedIF<ReturnIF>>>([QUERY_KEY.RETURN, query], () =>
    new HttpService<PaginatedIF<ReturnIF>>(`${ENDPOINTS.RETURN.FETCH_ADMIN}${query}`).get()
  );
};

// only fetches when a return is actually selected (modal open)
export const useGetReturnById = (id: string | null) =>
  useApiQuery<ResponseIF<ReturnIF>>(
    [QUERY_KEY.RETURN, "detail", id ?? ""],
    () => new HttpService<ReturnIF>(ENDPOINTS.RETURN.DETAIL(id as string)).get(),
    { enabled: !!id }
  );

export const useApproveReturn = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.RETURN.APPROVE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RETURN] }),
  });

export const useRejectReturn = () =>
  useApiMutation(({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
    new HttpService(ENDPOINTS.RETURN.REJECT(id), true).patch({ rejectionReason }), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RETURN] }),
  });

export const useSchedulePickup = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.RETURN.SCHEDULE_PICKUP(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RETURN] }),
  });

export const useMarkPickedUp = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.RETURN.PICKED_UP(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RETURN] }),
  });

export const useMarkReceived = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.RETURN.RECEIVED(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RETURN] }),
  });

export const useProcessReturnRefund = () =>
  useApiMutation(({ id, refundMethod }: { id: string; refundMethod: RefundMethod }) =>
    new HttpService(ENDPOINTS.RETURN.REFUND(id), true).patch({ refundMethod }), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RETURN] }),
  });