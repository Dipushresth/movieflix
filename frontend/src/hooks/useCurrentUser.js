import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../api/authApi";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
