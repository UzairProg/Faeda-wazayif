/**
 * features/university/hooks/useUniversityOpportunities.ts
 */
import { useQuery } from "@tanstack/react-query"
import { universityService } from "../services/university.service"

export function useUniversityOpportunities(params?: { q?: string; work_type?: string }) {
  return useQuery({
    queryKey: ["university", "opportunities", params],
    queryFn: () => universityService.getOpportunities(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
