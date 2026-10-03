import apiClient from "./client";
export const login = (credentials) => {
  return apiClient("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};
export const register = (userData) => {
  return apiClient("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const logout = () => {
  return apiClient("/logout", {
    method: "POST",
  });
};
