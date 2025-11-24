import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  trackCustomerPageVisits,
  getCustomerPageVisits,
} from "../Services/pageTrackerServices";

export function useTrackCustomerPageVisits() {
  return useMutation({
    mutationFn: trackCustomerPageVisits,
  });
}

export function useGetCustomerPageVisits(id: string) {
  return useQuery({
    queryFn: () => getCustomerPageVisits(id),
    queryKey: ["get-customer-page-visit", id],
    enabled: !!id,
  });
}
