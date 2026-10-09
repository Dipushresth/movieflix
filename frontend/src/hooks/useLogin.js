import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      console.log("Login successful:", data);
      // await QueryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.setQueryData(["currentUser"], data.data);
      toast.success("Login successful!");
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}
