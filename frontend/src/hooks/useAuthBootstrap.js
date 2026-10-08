import { useEffect, useState } from "react";

import { refresh, getCurrentUser } from "../api/authApi";

import { setAccessToken, clearAccessToken } from "../api/client";

export const useAuthBootstrap = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        const refreshResponse = await refresh();
        const newAccessToken = refreshResponse.accessToken;
        setAccessToken(newAccessToken);

        const userResponse = await getCurrentUser();
        if (isMounted) {
          setCurrentUser(userResponse.data);
        }
      } catch (error) {
        clearAccessToken();
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    currentUser,
    isInitializing,
  };
};
