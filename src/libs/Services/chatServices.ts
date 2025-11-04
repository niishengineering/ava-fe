import axios, { AxiosError } from "axios";
import { getUserToken } from "../utilities";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllCustomersChat(
  siteId: any,
  page: number,
  filter: boolean,
  searchTerm: string
) {
  const token = getUserToken();
  if (!token) return;

  try {
    const response = await axios.get(
      `${backendUrl}/chats/get-all-customers-chat/${siteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          filter,
          searchTerm,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occured");
  }
}

export async function getChatMessages(id: any) {
  try {
    const response = await axios.get(
      `${backendUrl}/chats/get-chat-messages/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occured");
  }
}

export async function getAnalyticsChatVolume({
  days,
  siteId,
}: {
  days: string;
  siteId: string;
}) {
  try {
    const token = getUserToken();
    if (!token) return;
    if (!siteId) return;
    const response = await axios.get(
      `${backendUrl}/chats/get-analytic-chat-volume/${siteId}?days=${days}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("An unexpected error occured");
  }
}

export async function startChat({
  id,
  propertyChatId,
}: {
  id: string;
  propertyChatId: string;
}) {
  try {
    const response = await axios.post(`${backendUrl}/chats/start-chat`, {
      id,
      propertyChatId,
    });
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occured");
  }
}

export async function updateChat({ id, mode }: { id: string; mode: string }) {
  const token = getUserToken();
  if (!token) return;
  try {
    const response = await axios.post(
      `${backendUrl}/chats/update-chat/${id}`,
      {
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occured");
  }
}
