import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type BrandIF from "../../interface/data/brand";
import type { PaginatedIF } from "../../interface/pagination";


export const useGetBrands = (path?: string, enabled: boolean = true) =>
  useApiQuery<ResponseIF<PaginatedIF<BrandIF>>>([QUERY_KEY.BRAND, path ?? ""], () =>
    new HttpService<PaginatedIF<BrandIF>>(`${ENDPOINTS.BRAND.FETCH}${path ?? ""}`).get(),
    { enabled }
  );

export const useCreateBrand = () =>
  useApiMutation((data: FormData) => new HttpService(ENDPOINTS.BRAND.CREATE, true, true).post(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BRAND] }),
  });

// 👇 backend route is PUT /brand/update/:id — must match the HTTP method exactly
export const useUpdateBrand = () =>
  useApiMutation(
    ({ id, data }: { id: string; data: FormData }) =>
      new HttpService(ENDPOINTS.BRAND.UPDATE(id), true, true).put(data),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BRAND] }) }
  );

export const useDeleteBrand = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.BRAND.DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BRAND] }),
  });

  export const useRestoreBrand = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.BRAND.RESTORE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BRAND] }),
  });

export const useDeleteBrandPermanently = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.BRAND.PERMANENT_DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BRAND] }),
  });