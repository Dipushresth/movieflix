import apiClient from "./client";
export const login = (credentials) => {
  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};
export const register = (userData) => {
  return apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const logout = () => {
  return apiClient("/auth/logout", {
    method: "POST",
  });
};
