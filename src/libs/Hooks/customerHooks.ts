import {
  createNewCustomer,
  sendMessage,
  getCustomerChats,
  getAllCustomers,
  updateCustomer,
  getCustomerChatMessages,
  getAllCustomersList,
} from "../Services/customerService";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export function useCreateNewCustomer() {
  return useMutation({
    mutationFn: createNewCustomer,
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: sendMessage,
  });
}

export function useUpdateCustomer() {
  return useMutation({
    mutationFn: updateCustomer,
  });
}

export function useGetCustomerChats(id: string) {
  return useQuery({
    queryFn: () => getCustomerChats(id),
    queryKey: ["get-customer-chats", id],
    enabled: !!id,
  });
}

export function useGetCustomerChatMessages(chatId: string) {
  return useQuery({
    queryFn: () => getCustomerChatMessages(chatId),
    queryKey: ["get-customer-chat-messages", chatId],
    enabled: !!chatId,
  });
}

export function useGetAllCustomers(siteId: any) {
  return useQuery({
    queryFn: () => getAllCustomers(siteId),
    queryKey: ["get-all-cutomres", siteId],
    enabled: !!siteId,
  });
}

export function useGetAllCustomersList(
  siteId: any,
  page: number,
  searchTerm: string,
  limit: number
) {
  const queryClient = useQueryClient();

  const queryKey = ["get-all-support-agents", siteId, page, searchTerm, limit];

  const query = useQuery({
    queryFn: () => getAllCustomersList(siteId, page, searchTerm, limit),
    queryKey,
    enabled: !!siteId,
  });

  return {
    ...query,
  };
}
