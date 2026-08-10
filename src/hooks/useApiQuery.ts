import { useQuery } from "@tanstack/react-query"

interface ApiQueryOptions {
    enabled?: boolean;
    refetchInterval?: number;
}

const useApiQuery = <TData>(
    queryKey: string[],
    queryFn: () => Promise<TData>,
    options?: ApiQueryOptions
) => {
    const query = useQuery({
        queryKey,
        queryFn,
        retry: 1,
        enabled: options?.enabled,
        refetchInterval: options?.refetchInterval,
    })

    return query
}

export default useApiQuery