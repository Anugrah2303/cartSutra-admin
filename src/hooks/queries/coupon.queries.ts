import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { CouponIF } from "../../interface/data/coupon";

interface PaginatedIF<T> {
  coupons: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}


export const useCreateCoupon = () =>
  useApiMutation((data: Record<string, unknown>) => new HttpService(ENDPOINTS.COUPON.CREATE, true).post(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.COUPON] }),
  });

export const useUpdateCoupon = () =>
  useApiMutation(
    ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      new HttpService(ENDPOINTS.COUPON.UPDATE(id), true).put(data),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.COUPON] }) }
  );

export const useDeleteCoupon = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.COUPON.DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.COUPON] }),
  });

export const useToggleCoupon = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.COUPON.TOGGLE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.COUPON] }),
  });

export const useGetCoupons = (path: string = "") =>
  useApiQuery<ResponseIF<PaginatedIF<CouponIF>>>([QUERY_KEY.COUPON, path], () =>
    new HttpService<PaginatedIF<CouponIF>>(`${ENDPOINTS.COUPON.FETCH}${path}`).get()
  );

export const useRestoreCoupon = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.COUPON.RESTORE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.COUPON] }),
  });

export const useDeleteCouponPermanently = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.COUPON.PERMANENT_DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.COUPON] }),
  });