import type { AxiosRequestConfig } from "axios";
import { API, APIMultipart } from "../library/axios.library";
import { toast } from "sonner";
import type { ResponseIF } from "../interface/response";

class HttpService<T> {
    private path: string;
    private client;
    private withToast: boolean

    private handleResponse(res: ResponseIF<T>) {
        if (this.withToast) toast.success(res.message)
        return res
    }

    constructor(path: string, withToast: boolean = false, isMultipart: boolean = false) {
        this.path = path;
        this.withToast = withToast;
        this.client = isMultipart ? APIMultipart : API;
    }

    async get(config?: AxiosRequestConfig) {
        const res = await this.client.get(this.path, config);

        return this.handleResponse(res.data)
    }

    async post<TBody = unknown>(data?: TBody, config?: AxiosRequestConfig) {
        const res = await this.client.post(this.path, data, config);

        return this.handleResponse(res.data)
    }

    async patch<TBody = unknown>(data?: TBody, config?: AxiosRequestConfig) {
        const res = await this.client.patch(this.path, data, config);

        return this.handleResponse(res.data)
    }

    async put<TBody = unknown>(data?: TBody, config?: AxiosRequestConfig) {
        const res = await this.client.put(this.path, data, config);

        return this.handleResponse(res.data)
    }

    async delete<TBody = unknown>(data?: TBody, config?: AxiosRequestConfig) {
        const res = await this.client.delete(this.path, { ...config, data });

        return this.handleResponse(res.data)
    }

}


export default HttpService