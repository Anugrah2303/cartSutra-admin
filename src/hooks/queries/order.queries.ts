import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { AdminOrderIF } from "../../interface/data/order";
import type { OrderStatus } from "../../enums/order.enum";

interface PaginatedIF<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface OrderFiltersParams {
  search?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string;
  maxAmount?: string;
  page?: number;
  limit?: number;
}

// backend: GET /order/admin/all — reads all these straight off req.query (see order.controller.ts)
export const useGetOrders = (filters: OrderFiltersParams) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });

  const query = params.toString();

  return useApiQuery<ResponseIF<PaginatedIF<AdminOrderIF>>>(
    [QUERY_KEY.ORDER, query],
    () => new HttpService<PaginatedIF<AdminOrderIF>>(`${ENDPOINTS.ORDER.FETCH}${query ? `?${query}` : ""}`).get()
  );
};

// backend: PATCH /order/:id/status — admin + vendor allowed (see admin.routes / order.controller)
export const useUpdateOrderStatus = () =>
  useApiMutation(
    ({ id, status, cancellationReason }: { id: string; status: OrderStatus; cancellationReason?: string }) =>
      new HttpService(ENDPOINTS.ORDER.UPDATE_STATUS(id), true).patch({ status, cancellationReason }),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ORDER] }) }
  );