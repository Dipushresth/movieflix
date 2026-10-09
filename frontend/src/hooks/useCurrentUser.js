import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => Promise.resolve(null),
    enabled: false,
    initialData: null,
  });
};
