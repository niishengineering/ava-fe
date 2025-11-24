import axios, { AxiosError } from "axios";
import { getUserToken } from "../utilities";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface PageVisitInterface {
  pageUrl: string;
  customerId: string;
}

export async function trackCustomerPageVisits(data: PageVisitInterface) {
  const token = getUserToken();
  try {
    const response = await axios.post(
      `${backendUrl}/page-tracker/record-visit`,
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

export async function getCustomerPageVisits(customerId: string) {
  const token = getUserToken();
  if (!token) return;
  try {
    const response = await axios.get(
      `${backendUrl}/page-tracker/get-visits/${customerId}/`,
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
