/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

type ApiResponse = {
  response_code?: number;
  success?: boolean;
  message: string;
};

export const handleToastResponse = (
  response: ApiResponse,
  onClose?: () => void
) => {
  if (response.success !== undefined) {
    if (response.success) {
      toast.success(response.message);
      if (onClose) {
        onClose();
      }
    } else {
      toast.error(response.message);
    }
  } else {
    toast.error(response.message || "Unknown response structure.");
  }
};

export const handleToastPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  onSuccess?: (data: T) => void,
  onError?: (error: any) => void
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
      return messages.success;
    },
    error: (error) => {
      if (onError) {
        onError(error);
      }
      return messages.error;
    },
  });
};
