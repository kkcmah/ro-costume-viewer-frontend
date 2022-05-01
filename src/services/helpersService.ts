import axios from "axios";

// TODO perhaps use axios interceptors instead?
export const formatErrorAsString = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 500) {
      return "Server is currently down. Please try again later.";
    }
    console.error(error?.response?.data || "Unrecognized axios error");
    return String(error?.response?.data?.error) || "Unrecognized axios error";
  } else {
    console.error("Unknown error", error);
    return "Unknown error";
  }
};
