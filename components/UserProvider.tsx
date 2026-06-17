"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AppSessionUser } from "@/lib/auth-session";

type AppShellData = {
  sessionUser: AppSessionUser | null;
  activeRentalCount: number;
  enrolledEventIds: string[];
  enrolledCampaignIds: string[];
};

type UserContextValue = AppShellData & {
  isAuthenticated: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const empty: AppShellData = {
  sessionUser: null,
  activeRentalCount: 0,
  enrolledEventIds: [],
  enrolledCampaignIds: [],
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppShellData>(empty);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/app-shell", { cache: "no-store" });
      if (!response.ok) return;
      const json = (await response.json()) as AppShellData;
      setData(json);
    } catch {
      setData(empty);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<UserContextValue>(
    () => ({
      ...data,
      isAuthenticated: Boolean(data.sessionUser?.id),
      isLoading,
      refresh,
    }),
    [data, isLoading, refresh],
  );

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
