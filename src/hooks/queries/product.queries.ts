import type { AxiosRequestConfig } from "axios";
import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { ProductIF } from "../../interface/data/product";
import { ProductApprovalStatus } from "../../enums/product.enum";

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

export const useGetProducts = (path: string = "", config?: AxiosRequestConfig) =>
  useApiQuery<ResponseIF<PaginatedIF<ProductIF>>>([QUERY_KEY.PRODUCT, path], () =>
    new HttpService<PaginatedIF<ProductIF>>(`${ENDPOINTS.PRODUCTS.FETCH}${path}`).get(config)
  );

// SINGLE — backend: GET /product/:slug (public route, works for admins too)
export const useGetProductBySlug = (slug: string) =>
  useApiQuery<ResponseIF<ProductIF>>([QUERY_KEY.PRODUCT, "detail", slug], () =>
    new HttpService<ProductIF>(ENDPOINTS.PRODUCTS.FETCH_SINGLE(slug)).get()
  );

// CREATE — one multipart call: text fields + thumbnail together (backend: POST /product/add)
export const useCreateProduct = () =>
  useApiMutation((data: FormData) => new HttpService(ENDPOINTS.PRODUCTS.CREATE, true, true).post(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] }),
  });

// UPDATE DETAILS — JSON only, no images (backend: PUT /product/:slug/update)
export const useUpdateProduct = () =>
  useApiMutation(
    ({ slug, data }: { slug: string; data: Record<string, unknown> }) =>
      new HttpService(ENDPOINTS.PRODUCTS.UPDATE(slug), true).put(data),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] }) }
  );

// UPDATE MEDIA — multipart, images only (backend: PATCH /product/:slug/update/media)
export const useUpdateProductMedia = () =>
  useApiMutation(
    ({ slug, data }: { slug: string; data: FormData }) =>
      new HttpService(ENDPOINTS.PRODUCTS.UPDATE_MEDIA(slug), true, true).patch(data),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] }) }
  );

// SOFT DELETE — uses slug, not _id (backend: DELETE /product/:slug/delete)
export const useDeleteProduct = () =>
  useApiMutation((slug: string) => new HttpService(ENDPOINTS.PRODUCTS.DELETE(slug), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] }),
  });

// APPROVE / REJECT — backend: PUT /product/:slug/approve
export const useApproveProduct = () =>
  useApiMutation(
    ({ slug, approvalStatus, rejectedReason }: { slug: string; approvalStatus: ProductApprovalStatus; rejectedReason?: string }) =>
      new HttpService(ENDPOINTS.PRODUCTS.APPROVE(slug), true).put({ approvalStatus, rejectedReason }),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] }) }
  );

// TOGGLE FEATURED — backend: PATCH /product/:slug/featured
export const useToggleProductFeatured = () =>
  useApiMutation((slug: string) => new HttpService(ENDPOINTS.PRODUCTS.TOGGLE_FEATURED(slug), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] }),
  });

// RESTORE — backend: PATCH /product/:slug/restore
export const useRestoreProduct = () =>
  useApiMutation((slug: string) => new HttpService(ENDPOINTS.PRODUCTS.RESTORE(slug), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] }),
  });

// PERMANENT DELETE — backend: DELETE /product/:slug/permanent-delete
export const useDeleteProductPermanently = () =>
  useApiMutation((slug: string) => new HttpService(ENDPOINTS.PRODUCTS.PERMANENT_DELETE(slug), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] }),
  });

export const useDeleteProductImage = () =>
  useApiMutation(
    ({ slug, publicId }: { slug: string; publicId: string }) =>
      new HttpService(ENDPOINTS.PRODUCTS.DELETE_IMAGE(slug), true).delete({ publicId }),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] }) }
  );