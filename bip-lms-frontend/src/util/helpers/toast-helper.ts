import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const showWarningToast = (message: string) => {
  toast.warning(message);
};

export const showInfoToast = (message: string, duration: number) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, duration)), {
        loading: `Saving ${message}`,
        success: "Done",
        error: "Error",
      })
};

