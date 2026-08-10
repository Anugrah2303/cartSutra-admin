// src/layout/GlobalSearch.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, X } from "lucide-react";
import { useGlobalSearch } from "../hooks/queries/search.queries";
import { SEARCH_CONFIGS } from "./searchConfig";

const GlobalSearch = () => {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), 350);
    return () => clearTimeout(timer);
  }, [term]);

  const enabled = debounced.length >= 2;
  const groups = useGlobalSearch(SEARCH_CONFIGS, debounced, enabled);

  const isLoading = enabled && groups.some((g) => g.isLoading);
  const totalResults = groups.reduce((sum, g) => sum + g.items.length, 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goTo = (path: string) => {
    setOpen(false);
    setTerm("");
    navigate(path);
  };

  return (
    <div className="relative w-full sm:max-w-sm" ref={containerRef}>
      <div className="flex w-full min-w-0 items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-light)" }}>
        <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={term}
          onChange={(e) => { setTerm(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
          placeholder="Search everything..."
          className="w-full min-w-0 bg-transparent text-sm outline-none"
          style={{ color: "var(--text-primary)" }}
        />
        {term && (
          <button onClick={() => { setTerm(""); setDebounced(""); }} className="shrink-0 cursor-pointer">
            <X className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
          </button>
        )}
      </div>

      {open && enabled && (
        <div
          className="absolute left-0 right-0 z-30 mt-2 max-h-112 overflow-y-auto rounded-lg border py-2"
          style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow-md)" }}
        >
          {debounced.length < 2 ? (
            <p className="px-3 py-4 text-center text-xs" style={{ color: "var(--text-muted)" }}>Type at least 2 characters to search</p>
          ) : isLoading && totalResults === 0 ? (
            <p className="flex items-center justify-center gap-2 px-3 py-6 text-xs" style={{ color: "var(--text-muted)" }}>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching everything...
            </p>
          ) : totalResults === 0 ? (
            <p className="px-3 py-4 text-center text-xs" style={{ color: "var(--text-muted)" }}>No results anywhere for "{debounced}"</p>
          ) : (
            groups
              .filter((g) => g.items.length > 0)
              .map((group) => (
                <div key={group.key} className="mb-1 last:mb-0">
                  <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                    {group.label}
                  </p>
                  {group.items.map((item) => (
                    <button
                      key={`${group.key}-${item.id}`}
                      onClick={() => goTo(item.path)}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm cursor-pointer hover:bg-(--bg-soft)"
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-7 w-7 rounded object-cover shrink-0" />
                      ) : (
                        <group.icon className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                      )}
                      <span className="truncate flex-1" style={{ color: "var(--text-primary)" }}>{item.title}</span>
                      {item.subtitle && (
                        <span className="ml-auto shrink-0 truncate max-w-28 text-xs" style={{ color: "var(--text-muted)" }}>{item.subtitle}</span>
                      )}
                    </button>
                  ))}
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;