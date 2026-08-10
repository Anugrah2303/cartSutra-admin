// src/hooks/queries/category.queries.ts
import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { categoryIF } from "../../interface/data/category";
import type { PaginatedIF } from "../../interface/pagination";

export const useGetCategories = (path: string = "", enabled: boolean = true) =>
  useApiQuery<ResponseIF<PaginatedIF<categoryIF>>>(
    [QUERY_KEY.CATEGORY, path],
    () => new HttpService<PaginatedIF<categoryIF>>(`${ENDPOINTS.CATEGORY.FETCH}${path}`).get(),
    { enabled }
  );


export const useCreateCategory = () =>
  useApiMutation((data: FormData) => new HttpService(ENDPOINTS.CATEGORY.CREATE, true, true).post(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] }),
  });

export const useGetCategoryById = (id: string) =>
  useApiQuery<ResponseIF<categoryIF>>([QUERY_KEY.CATEGORY, "detail", id], () =>
    new HttpService<categoryIF>(ENDPOINTS.CATEGORY.FETCH_BY_ID(id)).get()
  );


export const useUpdateCategory = () =>
  useApiMutation(
    ({ id, data }: { id: string; data: FormData }) =>
      new HttpService(ENDPOINTS.CATEGORY.UPDATE(id), true, true).put(data),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] }) }
  );

export const useDeleteCategory = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.CATEGORY.DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] }),
  });

export const useRestoreCategory = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.CATEGORY.RESTORE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] }),
  });

export const useDeleteCategoryPermanently = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.CATEGORY.PERMANENT_DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] }),
  });

export const useToggleCategoryActive = () =>
  useApiMutation(
    ({ id, isActive }: { id: string; isActive: boolean }) => {
      const formData = new FormData();
      formData.append("isActive", String(isActive));
      return new HttpService(ENDPOINTS.CATEGORY.UPDATE(id), true, true).put(formData);
    },
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] }) }
  );