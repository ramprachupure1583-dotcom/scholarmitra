"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import type { PublicUser } from "@/lib/types";

/* ------------------------------ Toasts ------------------------------ */

type Toast = { id: number; message: string; type: "success" | "error" | "info" };
type ToastCtx = { toast: (message: string, type?: Toast["type"]) => void };
const ToastContext = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside AppProviders");
  return ctx;
}

function ToastViewport({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-md ${
              t.type === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
                : t.type === "error"
                  ? "border-red-200 bg-red-50/95 text-red-700"
                  : "border-blue-200 bg-blue-50/95 text-blue-800"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0" strokeWidth={2.2} />
            ) : t.type === "error" ? (
              <XCircle className="h-4.5 w-4.5 shrink-0" strokeWidth={2.2} />
            ) : (
              <Info className="h-4.5 w-4.5 shrink-0" strokeWidth={2.2} />
            )}
            <span className="leading-snug">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------- Auth ------------------------------- */

type AuthCtx = {
  user: PublicUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthCtx | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AppProviders");
  return ctx;
}

/* ------------------------------- Saved ------------------------------ */

type SavedCtx = {
  savedIds: Set<number>;
  savedSlugs: Map<number, string>;
  toggle: (s: { id: number; slug: string; name: string }) => Promise<void>;
  loaded: boolean;
};
const SavedContext = createContext<SavedCtx | null>(null);

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used inside AppProviders");
  return ctx;
}

/* ------------------------------ Compare ----------------------------- */

type CompareCtx = {
  slugs: string[];
  toggle: (slug: string) => void;
  clear: () => void;
};
const CompareContext = createContext<CompareCtx | null>(null);

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside AppProviders");
  return ctx;
}

/* ------------------------------ Provider ---------------------------- */

export default function AppProviders({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [savedSlugs, setSavedSlugs] = useState<Map<number, string>>(new Map());
  const [loadedSaved, setLoadedSaved] = useState(false);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);

  const toast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setSavedIds(new Set());
    setSavedSlugs(new Map());
    setLoadedSaved(false);
  }, []);

  useEffect(() => {
    refresh();
    try {
      const raw = localStorage.getItem("sm_compare");
      if (raw) setCompareSlugs(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [refresh]);

  useEffect(() => {
    if (!user || loadedSaved) return;
    (async () => {
      try {
        const res = await fetch("/api/saved", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const ids = new Set<number>();
          const slugs = new Map<number, string>();
          for (const row of data.saved ?? []) {
            ids.add(row.scholarship.id);
            slugs.set(row.scholarship.id, row.scholarship.slug);
          }
          setSavedIds(ids);
          setSavedSlugs(slugs);
        }
      } catch {
        /* ignore */
      } finally {
        setLoadedSaved(true);
      }
    })();
  }, [user, loadedSaved]);

  const toggleSaved = useCallback(
    async (s: { id: number; slug: string; name: string }) => {
      if (!user) {
        toast("Log in or create a free account to save scholarships.", "info");
        return;
      }
      const isSaved = savedIds.has(s.id);
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (isSaved) next.delete(s.id);
        else next.add(s.id);
        return next;
      });
      setSavedSlugs((prev) => {
        const next = new Map(prev);
        if (isSaved) next.delete(s.id);
        else next.set(s.id, s.slug);
        return next;
      });
      try {
        const res = await fetch("/api/saved", {
          method: isSaved ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scholarshipId: s.id }),
        });
        if (!res.ok) throw new Error();
        toast(isSaved ? "Removed from saved scholarships." : `"${s.name}" saved to your dashboard.`, "success");
      } catch {
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (isSaved) next.add(s.id);
          else next.delete(s.id);
          return next;
        });
        toast("Could not update. Please try again.", "error");
      }
    },
    [user, savedIds, toast],
  );

  const toggleCompare = useCallback(
    (slug: string) => {
      setCompareSlugs((prev) => {
        let next: string[];
        if (prev.includes(slug)) next = prev.filter((s) => s !== slug);
        else if (prev.length >= 3) {
          toast("You can compare up to 3 scholarships at a time.", "info");
          return prev;
        } else next = [...prev, slug];
        try {
          localStorage.setItem("sm_compare", JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [toast],
  );

  const clearCompare = useCallback(() => {
    setCompareSlugs([]);
    try {
      localStorage.removeItem("sm_compare");
    } catch {
      /* ignore */
    }
  }, []);

  const authValue = useMemo(
    () => ({ user, loading: loadingUser, refresh, logout }),
    [user, loadingUser, refresh, logout],
  );
  const savedValue = useMemo(
    () => ({ savedIds, savedSlugs, toggle: toggleSaved, loaded: loadedSaved }),
    [savedIds, savedSlugs, toggleSaved, loadedSaved],
  );
  const compareValue = useMemo(
    () => ({ slugs: compareSlugs, toggle: toggleCompare, clear: clearCompare }),
    [compareSlugs, toggleCompare, clearCompare],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      <AuthContext.Provider value={authValue}>
        <SavedContext.Provider value={savedValue}>
          <CompareContext.Provider value={compareValue}>
            {children}
            <ToastViewport toasts={toasts} />
          </CompareContext.Provider>
        </SavedContext.Provider>
      </AuthContext.Provider>
    </ToastContext.Provider>
  );
}
