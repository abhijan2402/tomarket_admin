// src/components/ui/use-toast.tsx
import { toast } from "react-hot-toast";

export const useToast = () => {
  return {
    toast: ({ description, variant }) => {
      const toastType = variant === "destructive" ? "error" : "success";
      toast[toastType](description);
    },
  };
};
