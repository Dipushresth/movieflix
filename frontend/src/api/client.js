const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
async function apiClient(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: { "content-type": "application/json", ...options.headers },
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
}

export default apiClient;
