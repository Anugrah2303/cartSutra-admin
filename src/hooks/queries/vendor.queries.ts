import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { VendorIF } from "../../interface/data/vendor";

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

export const useGetVendors = (search?: string, approvalStatus?: string) => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (approvalStatus) params.set("approvalStatus", approvalStatus);
  const query = params.toString();

  return useApiQuery<ResponseIF<PaginatedIF<VendorIF>>>([QUERY_KEY.VENDOR, search ?? "", approvalStatus ?? ""], () =>
    new HttpService<PaginatedIF<VendorIF>>(`${ENDPOINTS.VENDOR.FETCH}${query ? `?${query}` : ""}`).get()
  );
};

export const useApproveVendor = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.VENDOR.APPROVE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.VENDOR] }),
  });

export const useRejectVendor = () =>
  useApiMutation(({ id, rejectedReason }: { id: string; rejectedReason: string }) =>
    new HttpService(ENDPOINTS.VENDOR.REJECT(id), true).patch({ rejectedReason }), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.VENDOR] }),
  });

export const useBlockVendor = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.VENDOR.BLOCK(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.VENDOR] }),
  });

export const useUpdateVendorStatus = () =>
  useApiMutation(({ id, isActive }: { id: string; isActive: boolean }) =>
    new HttpService(ENDPOINTS.VENDOR.STATUS(id), true).patch({ isActive }), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.VENDOR] }),
  });

export const useDeleteVendor = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.VENDOR.DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.VENDOR] }),
  });

export const useGetVendorById = (id: string) =>
  useApiQuery<ResponseIF<VendorIF>>([QUERY_KEY.VENDOR, "detail", id], () =>
    new HttpService<VendorIF>(ENDPOINTS.VENDOR.BY_ID(id)).get()
  );