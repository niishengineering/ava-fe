import axios, { AxiosError } from "axios";
import { getUserToken } from "../utilities";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface KnowledgeBaseCreateData {
  question: string;
  answer: string;
  siteId: string;
}
export interface KnowledgeBaseEditData {
  question?: string;
  answer?: string;
  id: string;
}

export async function getKnowledgeBase(id: string) {
  try {
    const response = await axios.get(`${backendUrl}/knowledge-base/site/${id}`); // Add http://
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

export async function createKnowledgeBase(data: KnowledgeBaseCreateData) {
  try {
    const token = getUserToken();
    if (!token) return;
    const response = await axios.post(
      `${backendUrl}/knowledge-base/create`,
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

export async function updateKnowledgeBase(data: KnowledgeBaseEditData) {
  try {
    const token = getUserToken();
    if (!token) return;
    const response = await axios.patch(
      `${backendUrl}/knowledge-base/${data.id}`,
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

export async function deleteKnowledgeBase(id: string) {
  try {
    const token = getUserToken();
    if (!token) return;
    const response = await axios.delete(`${backendUrl}/knowledge-base/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
