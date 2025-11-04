import axios, { AxiosError } from "axios";
import { getUserToken } from "../utilities";
import { updateSociailaInterface } from "../interface";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getSocials(customerId: string) {
  const token = getUserToken();

  if (!token) return;

  try {
    const response = await axios.get(`${backendUrl}/socials/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occurred");
  }
}

export async function updateSocials(data: updateSociailaInterface) {
  const token = getUserToken();

  if (!token) return;

  try {
    const response = await axios.patch(
      `${backendUrl}/socials/update-socials/${data.customerId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occurred");
  }
}
