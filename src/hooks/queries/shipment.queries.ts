import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { ShipmentIF } from "../../interface/data/shipment";
import type { ShipmentStatus, ShippingCarrier } from "../../enums/shipment.enum";

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

export interface ShipmentFiltersParams {
  search?: string;
  status?: string;
  carrier?: string;
  vendor?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// backend: GET /shipments/admin/all — reads all these straight off req.query (see shipment.controller.ts)
export const useGetShipments = (filters: ShipmentFiltersParams) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });

  const query = params.toString();

  return useApiQuery<ResponseIF<PaginatedIF<ShipmentIF>>>(
    [QUERY_KEY.SHIPMENT, query],
    () => new HttpService<PaginatedIF<ShipmentIF>>(`${ENDPOINTS.SHIPMENT.FETCH}${query ? `?${query}` : ""}`).get()
  );
};

// backend: PATCH /shipments/:id/status — vendor + admin (updateShipmentStatusModule)
export const useUpdateShipmentStatus = () =>
  useApiMutation(
    ({ id, status, location, description, failureReason }: {
      id: string;
      status: ShipmentStatus;
      location?: string;
      description?: string;
      failureReason?: string;
    }) => new HttpService(ENDPOINTS.SHIPMENT.UPDATE_STATUS(id), true).patch({ status, location, description, failureReason }),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SHIPMENT] }) }
  );

// backend: PATCH /shipments/:id/assign-courier
export const useAssignCourier = () =>
  useApiMutation(
    ({ id, carrier, trackingNumber, trackingUrl }: {
      id: string;
      carrier: ShippingCarrier;
      trackingNumber: string;
      trackingUrl?: string;
    }) => new HttpService(ENDPOINTS.SHIPMENT.ASSIGN_COURIER(id), true).patch({ carrier, trackingNumber, trackingUrl }),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SHIPMENT] }) }
  );

// backend: PATCH /shipments/:id/cancel — only PENDING/PACKED shipments are cancellable
export const useCancelShipment = () =>
  useApiMutation((id: string) => new HttpService(ENDPOINTS.SHIPMENT.CANCEL(id), true).patch(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SHIPMENT] }),
  });