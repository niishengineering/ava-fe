import { useMutation, useQueryClient ,useQuery} from '@tanstack/react-query';
import { recordAnalytics,getPropertyChatOverview,getPropertyChatHistoricalAnalysis } from '../Services/analyticServices';

export  function useRecordAnalytics(){
  return useMutation({
    mutationFn:recordAnalytics
  });

};



export function useGerPropertyChatOverview (id:string){
  return useQuery({
    queryFn : ()=>getPropertyChatOverview(id),
    queryKey:['get-website-data',id],
    enabled: !!id
  })
}

export function useGerPropertyChatHistoricalAnalysis (id:string){
  return useQuery({
    queryFn : ()=>getPropertyChatHistoricalAnalysis(id),
    queryKey:['get-historical-data',id],
    enabled: !!id
  })
}