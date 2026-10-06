const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function apiClient(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "content-type": "application/json" }),
      ...options.headers,
    },
    credentials: "include",
  });
  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Server returned non-JSON response");
  }

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

export default apiClient;
