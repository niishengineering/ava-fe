import { AxiosError } from "axios";

import {
  getWidgetProperty,
  updateWidgetProperty,
} from "../Services/propertyChatServices";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export function useGetWidgetProperty(id: any) {
  return useQuery({
    queryFn: () => getWidgetProperty(id),
    queryKey: ["get-widget-chat", id],
    enabled: !!id,
  });
}

export function useUpdateWidgetProperty() {
  return useMutation({
    mutationFn: updateWidgetProperty,
  });
}
