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


