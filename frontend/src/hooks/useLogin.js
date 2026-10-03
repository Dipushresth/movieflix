import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
export function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}
