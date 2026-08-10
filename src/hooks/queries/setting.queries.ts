import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ResponseIF } from "../../interface/response";
import type { SettingIF } from "../../interface/data/setting";

export const useGetSettings = () => useApiQuery<ResponseIF<SettingIF>>([QUERY_KEY.SETTING], () => new HttpService<SettingIF>(ENDPOINTS.SETTING.GET).get());

export const useUpdateSettings = () =>
  useApiMutation((data: Record<string, unknown>) => new HttpService(ENDPOINTS.SETTING.UPDATE, true).put(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SETTING] }),
  });

export const useUpdateSettingsMedia = () =>
  useApiMutation((data: FormData) => new HttpService(ENDPOINTS.SETTING.MEDIA, true, true).patch(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SETTING] }),
  });