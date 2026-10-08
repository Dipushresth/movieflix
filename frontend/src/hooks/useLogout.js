import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["currentUser"],
      });

      navigate("/login");
    },
  });
};
