import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { GiftCardIF } from "../../interface/data/giftCard";

interface PaginatedIF<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export interface GiftCardFiltersParams {
  search?: string;
  status?: string;
  isDeleted?: string; // "true" | "false"
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

export const useGetGiftCards = (filters: GiftCardFiltersParams) => {
  const query = toQuery(filters);
  return useApiQuery<ResponseIF<PaginatedIF<GiftCardIF>>>([QUERY_KEY.GIFT_CARD, query], () =>
    new HttpService<PaginatedIF<GiftCardIF>>(`${ENDPOINTS.GIFT_CARD.FETCH}${query}`).get()
  );
};

export const useCreateGiftCard = () =>
  useApiMutation(
    (data: { initialBalance: number; expiryDate: string; issuedTo?: string }) =>
      new HttpService(ENDPOINTS.GIFT_CARD.CREATE, true).post(data),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GIFT_CARD] }) }
  );

export const useToggleGiftCard = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.GIFT_CARD.TOGGLE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GIFT_CARD] }),
  });

export const useDeleteGiftCard = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.GIFT_CARD.DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GIFT_CARD] }),
  });

export const useRestoreGiftCard = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.GIFT_CARD.RESTORE(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GIFT_CARD] }),
  });

export const useDeleteGiftCardPermanently = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.GIFT_CARD.PERMANENT_DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GIFT_CARD] }),
  });