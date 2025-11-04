import axios, { AxiosError } from "axios";
import { getUserToken } from "../utilities";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export async function getCustomerSession(customerId: string) {
  const token = getUserToken();

  if (!token) return;

  try {
    const response = await axios.get(`${backendUrl}/sessions/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('An unexpected error occurred');
  }
}
