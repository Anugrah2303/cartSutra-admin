import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { CustomerIF } from "../../interface/data/customer";

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

export interface CustomerFiltersParams {
  search?: string;
  accountStatus?: string;
  page?: number;
  limit?: number;
}

export const useGetCustomers = (filters: CustomerFiltersParams) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });

  const query = params.toString();

  return useApiQuery<ResponseIF<PaginatedIF<CustomerIF>>>(
    [QUERY_KEY.CUSTOMER, query],
    () => new HttpService<PaginatedIF<CustomerIF>>(`${ENDPOINTS.CUSTOMER.FETCH}${query ? `?${query}` : ""}`).get()
  );
};

export const useToggleCustomerBlock = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.CUSTOMER.TOGGLE_BLOCK(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CUSTOMER] }),
  });