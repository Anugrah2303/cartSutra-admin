import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiMutation from "../useApiMutation";
import HttpService from "../../services/http.service";
import queryClient from "../../library/queryClient";
import type { ProfileDetailsFormValues } from "../../validator/profile.validator";

export const useUpdateProfile = () =>
  useApiMutation((data: ProfileDetailsFormValues) => new HttpService(ENDPOINTS.USER.UPDATE_PROFILE, true).post(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER] }),
  });

export const useUpdateAvatar = () =>
  useApiMutation((data: FormData) => new HttpService(ENDPOINTS.USER.AVATAR, true, true).patch(data), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER] }),
  });

export const useDeleteAvatar = () =>
  useApiMutation(() => new HttpService(ENDPOINTS.USER.AVATAR, true).delete(), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER] }),
  });

export const useChangePassword = () =>
  useApiMutation((data: { password: string; newPassword: string; conformPassword: string }) =>
    new HttpService(ENDPOINTS.USER.CHANGE_PASSWORD, true).patch(data)
  );