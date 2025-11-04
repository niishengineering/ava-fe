import { useMutation, useQueryClient ,useQuery} from '@tanstack/react-query';
import { sendMessageToCustomer } from '../Services/messageService';

export  function useSendMessage(){
  return useMutation({
    mutationFn:sendMessageToCustomer,
  });
};

