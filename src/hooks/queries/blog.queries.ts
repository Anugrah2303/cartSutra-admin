import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { BlogIF } from "../../interface/data/blog";

interface PaginatedIF<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export const useGetBlogs = () =>
  useApiQuery<ResponseIF<PaginatedIF<BlogIF>>>([QUERY_KEY.BLOG], () =>
    new HttpService<PaginatedIF<BlogIF>>(ENDPOINTS.BLOG.FETCH).get()
  );

export const useCreateBlog = () =>
  useApiMutation((data: FormData) => new HttpService(ENDPOINTS.BLOG.CREATE, true, true).post(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BLOG] }),
  });

export const useUpdateBlog = () =>
  useApiMutation(
    ({ id, data }: { id: string; data: FormData }) => new HttpService(ENDPOINTS.BLOG.UPDATE(id), true, true).put(data),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BLOG] }) }
  );

export const useDeleteBlog = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.BLOG.DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BLOG] }),
  });

export const useTogglePublishBlog = () =>
  useApiMutation(
    ({ id, publish }: { id: string; publish: boolean }) =>
      new HttpService(publish ? ENDPOINTS.BLOG.PUBLISH(id) : ENDPOINTS.BLOG.UNPUBLISH(id), true).patch(),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BLOG] }) }
  );

export const useToggleFeaturedBlog = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.BLOG.FEATURED(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BLOG] }),
  });