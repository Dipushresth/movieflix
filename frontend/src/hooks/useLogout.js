import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { clearAccessToken } from "../api/client";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,

    // onSuccess: () => {
    //   queryClient.removeQueries({
    //     queryKey: ["currentUser"],
    //   });

    //   navigate("/login");
    // },
    onSuccess: () => {
      clearAccessToken();
      queryClient.setQueryData(["currentUser"], null);
      navigate("/login");
    },
  });
};
