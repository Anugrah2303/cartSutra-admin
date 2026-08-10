import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { AdminIF, PromotableUserIF } from "../../interface/data/admin";

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

export const useGetAdmins = (search?: string) =>
  useApiQuery<ResponseIF<PaginatedIF<AdminIF>>>([QUERY_KEY.ADMIN, search ?? ""], () =>
    new HttpService<PaginatedIF<AdminIF>>(`${ENDPOINTS.ADMIN.FETCH}${search ? `?search=${search}` : ""}`).get()
  );

export const useSearchPromotableUsers = (search: string) =>
  useApiQuery<ResponseIF<PromotableUserIF[]>>([QUERY_KEY.ADMIN, "search-users", search], () =>
    new HttpService<PromotableUserIF[]>(`${ENDPOINTS.ADMIN.SEARCH_USERS}?search=${search}`).get()
  );

export const usePromoteToAdmin = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.ADMIN.PROMOTE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ADMIN] }),
  });

export const useDemoteAdmin = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.ADMIN.DEMOTE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ADMIN] }),
  });