import { useNavigate } from "react-router-dom";
import ENDPOINTS from "../../constants/endpoints"
import QUERY_KEY from "../../constants/queryKey"
import useApiQuery from "../useApiQuery";
import HttpService from "../../services/http.service";
import useApiMutation from "../useApiMutation";
import type { LoginForm } from "../../validator/login.validator";

export const useGetUser = <T>() => useApiQuery([QUERY_KEY.USER], () => new HttpService<T>(ENDPOINTS.USER.PROFILE).get());

export const useLogin = () => {
    const navigate = useNavigate()

    return useApiMutation((data: LoginForm) => new HttpService(ENDPOINTS.AUTH.LOGIN, true).post(data), {
        onSuccess: (data) => {
            if (data?.success) navigate("/admin/")
        }
    })
}


export const useLogout = () => new HttpService(ENDPOINTS.AUTH.LOGOUT, true).post()