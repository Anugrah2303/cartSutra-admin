import { useGetOrders } from "./order.queries";
import { useGetVendors } from "./vendor.queries";
import { useGetShipments } from "./shipment.queries";
import { useGetUnreadCount } from "./notification.queries";
import { OrderStatus } from "../../enums/order.enum";
import { VendorApprovalStatus } from "../../enums/vendor.enum";
import { ShipmentStatus } from "../../enums/shipment.enum";

export const useNavBadges = (): Record<string, number> => {

  const { data: ordersData } = useGetOrders({ status: OrderStatus.PENDING, limit: 1 });
  const pendingOrders = ordersData?.data?.meta?.total ?? 0;

  const { data: vendorsData } = useGetVendors(undefined, VendorApprovalStatus.PENDING);
  const pendingVendors = vendorsData?.data?.meta?.total ?? 0;

  const { data: shipmentsData } = useGetShipments({ status: ShipmentStatus.FAILED_DELIVERY, limit: 1 });
  const failedShipments = shipmentsData?.data?.meta?.total ?? 0;

  const { data: notificationData } = useGetUnreadCount();
  const unreadNotifications = notificationData?.data?.count ?? 0;

  return {
    "/admin/orders": pendingOrders,
    "/admin/vendors": pendingVendors,
    "/admin/shipping": failedShipments,
    "/admin/notifications": unreadNotifications,
  };
};