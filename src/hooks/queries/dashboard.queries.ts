import ENDPOINTS from "../../constants/endpoints";
import QUERY_KEY from "../../constants/queryKey";
import useApiQuery from "../useApiQuery";
import HttpService from "../../services/http.service";
import type { ResponseIF } from "../../interface/response";
import type { DashboardOverviewIF } from "../../interface/data/dashboard";

export const useGetDashboardOverview = () => useApiQuery<ResponseIF<DashboardOverviewIF>>([QUERY_KEY.DASHBOARD, "overview"], () => new HttpService<DashboardOverviewIF>(ENDPOINTS.DASHBOARD.OVERVIEW).get());