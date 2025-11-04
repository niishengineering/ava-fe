import { useMutation, useQueryClient ,useQuery} from '@tanstack/react-query';
import {getCustomerSession} from '../Services/sessionServices';

export function useGetCustomerSession(id:any){
    return useQuery({
      queryFn:()=>getCustomerSession(id),
      queryKey:['get-customer-session',id],
      enabled : !!id
    })
  }