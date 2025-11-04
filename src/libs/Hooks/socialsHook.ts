import { useMutation, useQueryClient ,useQuery} from '@tanstack/react-query';
import { sendMessageToCustomer } from '../Services/messageService';
import { getSocials,updateSocials } from '../Services/socialServices';

export  function useUpdateSocial(){
  return useMutation({
    mutationFn:updateSocials,
  });
};

export function useGetSocials(id:string){
    return useQuery({
      queryFn:()=>getSocials(id),
      queryKey:["get-socials",id],
      enabled: !!id
    })
  }
