import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { ReviewIF } from "../../interface/data/review";

interface PaginatedIF<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export interface ReviewFiltersParams {
  search?: string;
  rating?: string;
  isReported?: string;
  isApproved?: string;
  page?: number;
  limit?: number;
}

const toQuery = (params: object) => {
  const search = new URLSearchParams();
  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

export const useGetReviews = (filters: ReviewFiltersParams) => {
  const query = toQuery(filters);
  return useApiQuery<ResponseIF<PaginatedIF<ReviewIF>>>([QUERY_KEY.REVIEW, query], () =>
    new HttpService<PaginatedIF<ReviewIF>>(`${ENDPOINTS.REVIEW.FETCH_ADMIN}${query}`).get()
  );
};

export const useGetReportedReviews = (filters: Pick<ReviewFiltersParams, "page" | "limit">) => {
  const query = toQuery(filters);
  return useApiQuery<ResponseIF<PaginatedIF<ReviewIF>>>([QUERY_KEY.REVIEW, "reported", query], () =>
    new HttpService<PaginatedIF<ReviewIF>>(`${ENDPOINTS.REVIEW.FETCH_REPORTED}${query}`).get()
  );
};

export const useToggleReviewApproval = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.REVIEW.TOGGLE_APPROVAL(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.REVIEW] }),
  });

export const useResolveReport = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.REVIEW.RESOLVE_REPORT(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.REVIEW] }),
  });

export const useAdminDeleteReview = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.REVIEW.DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.REVIEW] }),
  });