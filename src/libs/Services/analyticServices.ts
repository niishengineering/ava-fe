import axios, { AxiosError } from "axios";
import { getUserToken } from "../utilities";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function recordAnalytics(data: any) {
  try {
    const response = await axios.post(
      `${backendUrl}/analytics/record-analytics`,
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
    console.error(error);
    throw new Error("An unexpected error occurred");
  }
}

export async function getPropertyChatOverview(id: string) {
  try {
    const token = getUserToken();
    if (!token) return;

    const response = await axios.get(
      `${backendUrl}/analytics/get-website-data/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message);
    }

    throw new Error("An Unexpected Error Occured");
  }
}
export async function getPropertyChatHistoricalAnalysis(id: string) {
  try {
    const token = getUserToken();
    if (!token) return;

    const response = await axios.get(
      `${backendUrl}/analytics/get-historical-analysis/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message);
    }

    throw new Error("An Unexpected Error Occured");
  }
}
