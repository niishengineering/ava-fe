import axios, { AxiosError } from "axios";
import { getUserToken } from "../utilities";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createNewCustomer(data: any) {
  try {
    const response = await axios.post(`${backendUrl}/customers/sign-up`, data); // Add http://
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

export async function sendMessage(data: any) {
  try {
    const response = await axios.post(
      `${backendUrl}/customers/send-message`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occourred");
  }
}

export async function getCustomerChats(id: any) {
  try {
    const response = await axios.get(
      `${backendUrl}/chats/get-customer-chats/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occoured");
  }
}

export async function getCustomerChatMessages(chatId: string) {
  try {
    if (chatId === "new-chat") return;
    const response = await axios.get(
      `${backendUrl}/chats/get-chat-messages/${chatId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occoured");
  }
}

export async function getAllCustomers(siteId: any) {
  const token = getUserToken();
  if (!token) return;

  try {
    const response = await axios.get(
      `${backendUrl}/customers/get-customers/${siteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occoured");
  }
}

export async function updateCustomer(data: any) {
  const token = getUserToken();

  if (!token) return;

  try {
    const response = await axios.post(
      `${backendUrl}/customers/update-customer/${data.id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "An unexpected error occoured"
    );
  }
}

export async function getAllCustomersList(
  siteId: string,
  page = 1,
  searchTerm: string,
  limit: number
) {
  const token = getUserToken();
  if (!token) return;

  try {
    const response = await axios.get(
      `${backendUrl}/customers/get-all-customer-list/${siteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          searchTerm,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occurred");
  }
}
