import axios, { AxiosError } from "axios";
import { getUserToken } from "../utilities";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const token = getUserToken();

export async function getWidgetProperty(id: any) {
  try {
    const response = await axios.get(
      `${backendUrl}/property-chat/get-property/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occoured");
  }
}

export async function updateWidgetProperty({
  id,
  data,
}: {
  id: string;
  data: FormData;
}) {
  try {
    const response = await axios.patch(
      `${backendUrl}/property-chat/update-property/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "An unexpected error occurred"
    );
  }
}
