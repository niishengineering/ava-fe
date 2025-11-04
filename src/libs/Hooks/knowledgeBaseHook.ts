import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  getKnowledgeBase,
  createKnowledgeBase,
  updateKnowledgeBase,
  deleteKnowledgeBase,
} from "../Services/knowledgeBaseService";

export function useCreateKnowledgeBase() {
  return useMutation({
    mutationFn: createKnowledgeBase,
  });
}

export function useUpdateKnowledgeBase() {
  return useMutation({
    mutationFn: updateKnowledgeBase,
  });
}

export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteKnowledgeBase(id),
    onSuccess: () => {
      // ✅ Invalidate KB list so UI refreshes automatically
      queryClient.invalidateQueries({ queryKey: ["get-Knowledge-base"] });
    },
  });
}

export function useGetKonwledgeBase(id: string) {
  return useQuery({
    queryFn: () => getKnowledgeBase(id),
    queryKey: ["get-Knowledge-base", id],
    enabled: !!id,
  });
}
