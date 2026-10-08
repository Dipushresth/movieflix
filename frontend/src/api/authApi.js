import apiClient, { clearAccessToken, setAccessToken } from "./client";
export const login = async (credentials) => {
  const data = await apiClient("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  setAccessToken(data.accessToken);
  return data;
};
export const register = (userData) => {
  return apiClient("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

let refreshPromise = null;

export const refresh = async () => {
  // If a refresh request is already running,
  // return the same promise instead of making another request.
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const data = await apiClient("/refresh", {
        method: "POST",
      });

      setAccessToken(data.accessToken);

      return data;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const getCurrentUser = async () => {
  return apiClient("/me", {
    method: "GET",
  });
};

export const logout = async () => {
  try {
    await apiClient("/logout", {
      method: "POST",
    });
  } finally {
    clearAccessToken();
  }
};
