import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { TicketListItemIF, TicketDetailIF } from "../../interface/data/ticket";
import type { TicketStatus, TicketPriority } from "../../enums/ticket.enum";

interface PaginatedIF<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export interface TicketFiltersParams {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
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

export const useGetTickets = (filters: TicketFiltersParams) => {
  const query = toQuery(filters);
  return useApiQuery<ResponseIF<PaginatedIF<TicketListItemIF>>>([QUERY_KEY.TICKET, query], () =>
    new HttpService<PaginatedIF<TicketListItemIF>>(`${ENDPOINTS.TICKET.FETCH}${query}`).get()
  );
};

// only fetches when a ticket id is actually selected (modal open)
export const useGetTicketById = (id: string | null) =>
  useApiQuery<ResponseIF<TicketDetailIF>>(
    [QUERY_KEY.TICKET, "detail", id ?? ""],
    () => new HttpService<TicketDetailIF>(ENDPOINTS.TICKET.DETAIL(id as string)).get(),
    { enabled: !!id }
  );

// omitting adminId assigns the ticket to the currently logged-in admin (backend default)
export const useAssignTicket = () =>
  useApiMutation(
    ({ id, adminId }: { id: string; adminId?: string }) =>
      new HttpService(ENDPOINTS.TICKET.ASSIGN(id), true).patch({ adminId }),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TICKET] }) }
  );

export const useUpdateTicketStatus = () =>
  useApiMutation(
    ({ id, status }: { id: string; status: TicketStatus }) =>
      new HttpService(ENDPOINTS.TICKET.STATUS(id), true).patch({ status }),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TICKET] }) }
  );

export const useUpdateTicketPriority = () =>
  useApiMutation(
    ({ id, priority }: { id: string; priority: TicketPriority }) =>
      new HttpService(ENDPOINTS.TICKET.PRIORITY(id), true).patch({ priority }),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TICKET] }) }
  );

// multipart — backend accepts optional attachment files alongside the message
export const useReplyTicket = () =>
  useApiMutation(
    ({ id, data }: { id: string; data: FormData }) =>
      new HttpService(ENDPOINTS.TICKET.REPLY(id), true, true).post(data),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TICKET] }) }
  );