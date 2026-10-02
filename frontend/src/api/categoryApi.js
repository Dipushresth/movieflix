import apiClient from "./client";

export function createCategory(categoryData) {
  return apiClient("/category", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
}

export function getCategories() {
  return apiClient("/categories");
}
