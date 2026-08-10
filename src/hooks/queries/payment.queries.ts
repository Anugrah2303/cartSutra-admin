import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";

export const useRefundPayment = () =>
  useApiMutation(
    ({ id, amount, reason }: { id: string; amount?: number; reason?: string }) =>
      new HttpService(ENDPOINTS.PAYMENT.REFUND(id), true).patch({ amount, reason }),
    { onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ORDER] }) }
  );