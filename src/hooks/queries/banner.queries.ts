import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { BannerIF } from "../../interface/data/banner";

interface PaginatedIF<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export const useGetBanners = () =>
  useApiQuery<ResponseIF<PaginatedIF<BannerIF>>>([QUERY_KEY.BANNER], () =>
    new HttpService<PaginatedIF<BannerIF>>(ENDPOINTS.BANNER.FETCH).get()
  );

export const useCreateBanner = () =>
  useApiMutation((data: FormData) => new HttpService(ENDPOINTS.BANNER.CREATE, true, true).post(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BANNER] }),
  });

export const useUpdateBanner = () =>
  useApiMutation(
    ({ id, data }: { id: string; data: FormData }) => new HttpService(ENDPOINTS.BANNER.UPDATE(id), true, true).put(data),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BANNER] }) }
  );

export const useDeleteBanner = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.BANNER.DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BANNER] }),
  });

export const useToggleBanner = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.BANNER.TOGGLE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BANNER] }),
  });