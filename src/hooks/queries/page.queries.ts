import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { PageIF } from "../../interface/data/page";

interface PaginatedIF<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export const useGetPages = () =>
  useApiQuery<ResponseIF<PaginatedIF<PageIF>>>([QUERY_KEY.PAGE], () =>
    new HttpService<PaginatedIF<PageIF>>(ENDPOINTS.PAGE.FETCH).get()
  );

export const useCreatePage = () =>
  useApiMutation((data: Record<string, unknown>) => new HttpService(ENDPOINTS.PAGE.CREATE, true).post(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PAGE] }),
  });

export const useUpdatePage = () =>
  useApiMutation(
    ({ id, data }: { id: string; data: Record<string, unknown> }) => new HttpService(ENDPOINTS.PAGE.UPDATE(id), true).put(data),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PAGE] }) }
  );

export const useDeletePage = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.PAGE.DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PAGE] }),
  });

export const useTogglePagePublish = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.PAGE.TOGGLE_PUBLISH(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PAGE] }),
  });