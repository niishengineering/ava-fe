import axios, { AxiosError } from "axios";
import { getUserToken } from "../utilities";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export async function getAllTickets(siteId: any, page = 1, filter:boolean = false, searchTerm:string) {
  const token = getUserToken();
  if (!token) return;

  try {
    const response = await axios.get(`${backendUrl}/tickets/get-tickets/${siteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        filter,
        searchTerm
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('An unexpected error occurred');
  }
}


export async function createTicket(data:any) {
    try {
        const token = getUserToken()
        if(!token) return
        const response = await axios.post(`${backendUrl}/tickets/create-ticket`,data,{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data
    } catch (error) {
        throw new Error('An unexpected error occoured')
    }
}