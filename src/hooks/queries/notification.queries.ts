// src/hooks/queries/notification.queries.ts
import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { NotificationIF } from "../../interface/data/notification";
import type { CreateNotificationPayload } from "../../enums/notification.enum";
import type { PaginatedIF } from "../../interface/pagination";


export interface NotificationFiltersParams {
  search?: string;
  audience?: string;
  type?: string;
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

// ── admin "all notifications ever sent" view (CMS-style management page) ──
export const useGetNotifications = (filters: NotificationFiltersParams) => {
  const query = toQuery(filters);
  return useApiQuery<ResponseIF<PaginatedIF<NotificationIF>>>([QUERY_KEY.NOTIFICATION, query], () =>
    new HttpService<PaginatedIF<NotificationIF>>(`${ENDPOINTS.NOTIFICATION.FETCH}${query}`).get()
  );
};

// ── self "my notifications" — what the bell icon shows, includes isRead ──
export const useGetMyNotifications = (limit = 8) =>
  useApiQuery<ResponseIF<PaginatedIF<NotificationIF>>>(
    [QUERY_KEY.NOTIFICATION, "my", String(limit)],
    () => new HttpService<PaginatedIF<NotificationIF>>(`${ENDPOINTS.NOTIFICATION.MY}?limit=${limit}`).get(),
    { refetchInterval: 30000 }
  );

export const useGetUnreadCount = () =>
  useApiQuery<ResponseIF<{ count: number }>>(
    [QUERY_KEY.NOTIFICATION, "unread-count"],
    () => new HttpService<{ count: number }>(ENDPOINTS.NOTIFICATION.UNREAD_COUNT).get(),
    { refetchInterval: 30000 }
  );

export const useMarkNotificationRead = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.NOTIFICATION.READ(id), false).patch(), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NOTIFICATION, "my"] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NOTIFICATION, "unread-count"] });
    },
  });

export const useMarkAllNotificationsRead = () =>
  useApiMutation(() => new HttpService(ENDPOINTS.NOTIFICATION.READ_ALL, false).patch(), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NOTIFICATION, "my"] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NOTIFICATION, "unread-count"] });
    },
  });

export const useCreateNotification = () =>
  useApiMutation((data: CreateNotificationPayload) => new HttpService(ENDPOINTS.NOTIFICATION.CREATE, true).post(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NOTIFICATION] }),
  });

export const useDeleteNotification = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.NOTIFICATION.DELETE(id), true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NOTIFICATION] }),
  });


  

  