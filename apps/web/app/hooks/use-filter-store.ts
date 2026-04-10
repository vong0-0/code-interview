import { create } from "zustand";
import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterState {
  filters: Record<string, any[]>;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
  hasFilters: boolean;
  setFilter: (key: string, value: any[]) => void;
  setSearch: (value: string) => void;
  setSorting: (sortBy: string, sortOrder: "asc" | "desc") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  getFilter: <T>(key: string, defaultValue: T[]) => T[];
  resetFilters: () => void;
  computeFacets: <T extends Record<string, any>>(
    data: T[],
    configs: Record<string, any[]>,
  ) => Record<string, Record<string, number>>;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: {},
  search: "",
  sortBy: "",
  sortOrder: "desc",
  page: 1,
  limit: 50,
  hasFilters: false,
  setFilter: (key, value) => {
    set((state) => {
      const nextFilters = { ...state.filters, [key]: value };
      const hasFilters =
        Object.values(nextFilters).some((v) => v.length > 0) ||
        state.search.length > 0;
      return { filters: nextFilters, hasFilters, page: 1 }; // Reset page on filter change
    });
  },
  setSearch: (value) => {
    set((state) => ({
      search: value,
      page: 1, // Reset page on search change
      hasFilters:
        value.length > 0 ||
        Object.values(state.filters).some((v) => v.length > 0),
    }));
  },
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  getFilter: (key, defaultValue) => get().filters[key] || defaultValue,
  resetFilters: () =>
    set({
      filters: {},
      search: "",
      sortBy: "",
      sortOrder: "desc",
      page: 1,
      hasFilters: false,
    }),
  computeFacets: (data, configs) => {
    const results: Record<string, Record<string, number>> = {};

    Object.entries(configs).forEach(([key, options]) => {
      results[key] = Object.fromEntries(
        options.map((option) => {
          const value = typeof option === "object" ? option.value : option;
          return [value, data.filter((item) => item[key] === value).length];
        }),
      );
    });

    return results;
  },
}));

/**
 * Hook to sync useFilterStore with URL search params
 */
export function useFilterUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    filters,
    search,
    sortBy,
    sortOrder,
    page,
    limit,
    setFilter,
    setSearch,
    setSorting,
    setPage,
    setLimit,
  } = useFilterStore();

  // Hydrate from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Search
    const s = params.get("search");
    if (s !== null && s !== search) {
      setSearch(s);
    }

    // Sort
    const sb = params.get("sortBy");
    const so = params.get("sortOrder") as "asc" | "desc";
    if (sb && so) {
      setSorting(sb, so);
    }

    // Pagination
    const p = params.get("page");
    const l = params.get("limit");
    if (p) setPage(parseInt(p));
    if (l) setLimit(parseInt(l));

    // Filters (comma separated in URL)
    params.forEach((value, key) => {
      if (["search", "sortBy", "sortOrder", "page", "limit"].includes(key))
        return;
      const values = value ? value.split(",") : [];
      const currentValues = filters[key] || [];
      if (JSON.stringify(values) !== JSON.stringify(currentValues)) {
        setFilter(key, values);
      }
    });

    // Handle missing filters that were in store but not in URL (on initial load)
    // Actually, we usually want URL to be the source of truth on load.
  }, []); // Only run once on mount

  // Sync to URL whenever store changes
  useEffect(() => {
    const params = new URLSearchParams();

    // Search
    if (search) {
      params.set("search", search);
    }

    // Sort
    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }

    // Pagination
    if (page > 1) {
      params.set("page", page.toString());
    }
    if (limit !== 50) {
      params.set("limit", limit.toString());
    }

    // Filters
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        params.set(key, values.join(","));
      }
    });

    const queryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (queryString !== currentQueryString) {
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(url, { scroll: false });
    }
  }, [
    filters,
    search,
    sortBy,
    sortOrder,
    page,
    limit,
    pathname,
    router,
    searchParams,
  ]);
}
