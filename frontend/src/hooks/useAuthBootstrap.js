import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { refresh, getCurrentUser } from "../api/authApi";
import { setAccessToken, clearAccessToken } from "../api/client";

export const useAuthBootstrap = () => {
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const bootstrapAuth = async () => {
      try {
        const refreshResponse = await refresh();
        setAccessToken(refreshResponse.accessToken);
        const userResponse = await getCurrentUser();
        const user = userResponse.data;

        if (!cancelled) {
          queryClient.setQueryData(["currentUser"], user);
        }
      } catch (error) {
        clearAccessToken();

        if (!cancelled) {
          queryClient.setQueryData(["currentUser"], null);
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, [queryClient]);

  return { isInitializing };
};
