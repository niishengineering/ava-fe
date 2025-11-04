import { useMutation, useQueryClient ,useQuery} from '@tanstack/react-query';
import { getAllTickets,createTicket } from '../Services/ticketsServices';




export function useGetAllTickets(siteId: any, page:number, filter:boolean = false , searchTerm:string) {
  const queryClient = useQueryClient();

  const queryKey = ['get-all-tickets', siteId, page, filter,searchTerm];

  const query = useQuery({
    queryFn: () => getAllTickets(siteId, page, filter,searchTerm),
    queryKey,
    enabled: !!siteId,
  });



  return {
    ...query,
  };
}

  export function useCreateTicket(){
    return useMutation({
      mutationFn:createTicket
    })
    
  }