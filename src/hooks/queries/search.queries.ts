import { useQueries } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import HttpService from "../../services/http.service";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  path: string;
}

export interface SearchCategoryConfig<T = unknown> {
  key: string;
  label: string;
  icon: LucideIcon;
  endpoint: string;
  // most admin list endpoints respond { data: { data: [...], meta } };
  // a few (coupons) respond { data: { coupons: [...], meta } } — extract handles the difference
  extract: (res: unknown) => T[];
  toResult: (raw: T) => SearchResultItem;
}

// Lets each config be declared with its own concrete raw type in searchConfig.ts,
// while still living together in one SearchCategoryConfig[] (T erased to unknown) here.
export function defineSearchCategory<T>(cfg: SearchCategoryConfig<T>): SearchCategoryConfig {
  return cfg as SearchCategoryConfig;
}

export const useGlobalSearch = (configs: SearchCategoryConfig[], term: string, enabled: boolean) => {
  const results = useQueries({
    queries: configs.map((cfg) => ({
      queryKey: ["global-search", cfg.key, term],
      queryFn: () =>
        new HttpService<unknown>(
          `${cfg.endpoint}${cfg.endpoint.includes("?") ? "&" : "?"}search=${encodeURIComponent(term)}&limit=5`
        ).get(),
      enabled,
      staleTime: 15000,
      retry: 0,
    })),
  });

  return configs.map((cfg, idx) => {
    const query = results[idx];

    const items: SearchResultItem[] = (() => {
      try {
        const rawList = cfg.extract(query.data) ?? [];
        return rawList.map(cfg.toResult);
      } catch {
        return [];
      }
    })();

    return {
      key: cfg.key,
      label: cfg.label,
      icon: cfg.icon,
      isLoading: query.isFetching,
      isError: query.isError,
      items,
    };
  });
};