// src/library/useApiMutation.ts
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import type { AxiosError } from "axios";
import { toast } from "sonner";

const useApiMutation = <TVariables = void, TData = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options: UseMutationOptions<TData, Error, TVariables> = {}
) => {

    return useMutation({
        mutationFn,
        ...options,
        onError: (error) => {
            const err = error as AxiosError<{
                success: boolean;
                message: string;
            }>;

            toast.error(
                err.response?.data?.message ?? err.message
            );
        }
    })
}

export default useApiMutation;