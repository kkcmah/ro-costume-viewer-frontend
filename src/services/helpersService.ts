import axios from "axios";

// TODO perhaps use axios interceptors instead?
export const formatErrorAsString = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    console.error(error?.response?.data || "Unrecognized axios error");
    return String(error?.response?.data?.error) || "Unrecognized axios error";
  } else {
    console.error("Unknown error", error);
    return "Unknown error";
  }
};
