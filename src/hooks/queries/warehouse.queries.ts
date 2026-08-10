import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { WarehouseIF } from "../../interface/data/warehouse";

interface PaginatedIF<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export interface WarehouseFiltersParams {
  search?: string;
  vendor?: string;
  isActive?: string;
  city?: string;
  state?: string;
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

export const useGetWarehouses = (filters: WarehouseFiltersParams) => {
  const query = toQuery(filters);
  return useApiQuery<ResponseIF<PaginatedIF<WarehouseIF>>>([QUERY_KEY.WAREHOUSE, query], () =>
    new HttpService<PaginatedIF<WarehouseIF>>(`${ENDPOINTS.WAREHOUSE.FETCH_ADMIN}${query}`).get()
  );
};

export const useToggleWarehouseStatus = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.WAREHOUSE.TOGGLE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.WAREHOUSE] }),
  });