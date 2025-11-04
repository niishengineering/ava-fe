import axios, { AxiosError } from "axios";
import { getUserToken } from "../utilities";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function sendMessageToCustomer(data: any) {
  const token = getUserToken();
  try {
    const response = await axios.post(
      `${backendUrl}/messages/send-message`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}
