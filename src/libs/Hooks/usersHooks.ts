import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  registerUser,
  createNewUserProperty,
  getUserInfo,
  getSupportAgents,
  getAllSupportAgents,
  loginUser,
  logOutUser,
} from "../Services/usersServices";

interface getSupportAgentsParams {
  siteId: string;
}

export function useRegisterUserHook() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useGetAllSupportAgents(
  siteId: any,
  page: number,
  searchTerm: string,
  limit: number
) {
  const queryClient = useQueryClient();

  const queryKey = ["get-all-support-agents", siteId, page, searchTerm, limit];

  const query = useQuery({
    queryFn: () => getAllSupportAgents(siteId, page, searchTerm, limit),
    queryKey,
    enabled: !!siteId,
  });

  return {
    ...query,
  };
}

export function useLoginUser() {
  return useMutation({
    mutationFn: loginUser,
  });
}

export function useLogoutUser() {
  return useMutation({
    mutationFn: logOutUser,
  });
}

export function useCreateNewUserProperty() {
  return useMutation({
    mutationFn: createNewUserProperty,
  });
}

export function useGetSupportAgents(params: getSupportAgentsParams) {
  return useQuery({
    queryFn: () => getSupportAgents(params),
    queryKey: ["get-support-agents"],
  });
}

export function useGetUserInfo() {
  return useQuery({
    queryFn: () => getUserInfo(),
    queryKey: ["get-user-info"],
  });
}
