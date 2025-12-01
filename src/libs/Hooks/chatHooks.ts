import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  getAllCustomersChat,
  getChatMessages,
  startChat,
  updateChat,
  getAnalyticsChatVolume,
  agentStartChat,
} from "../Services/chatServices";

export function useGetAllCustomersChat(
  siteId: any,
  page: number,
  filter: boolean,
  searchTerm: string
) {
  const queryKey = ["get-all-customer-chat", siteId, page, filter, searchTerm];

  const query = useQuery({
    queryFn: () => getAllCustomersChat(siteId, page, filter, searchTerm),
    queryKey,
    enabled: !!siteId,
  });

  return {
    ...query,
  };
}

export function useGetChatMessages(id: any) {
  return useQuery({
    queryFn: () => getChatMessages(id),
    queryKey: ["get-chat-message", id],
    enabled: !!id,
  });
}

export function useGetAnalyticsChatVolume({
  days,
  siteId,
}: {
  days: string;
  siteId: string;
}) {
  return useQuery({
    queryFn: () => getAnalyticsChatVolume({ days, siteId }),
    queryKey: ["get-chat-anatytics-volume", days, siteId],
    enabled: !!days,
  });
}

export function useStartChat() {
  return useMutation({
    mutationFn: startChat,
  });
}

export function useAgentStartChat() {
  return useMutation({
    mutationFn: agentStartChat,
  });
}

export function useUpdateChat() {
  return useMutation({
    mutationFn: updateChat,
  });
}
