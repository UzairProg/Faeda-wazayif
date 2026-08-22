/**
 * features/university/hooks/useUniversityDashboard.ts
 */
import { useQuery } from "@tanstack/react-query"
import { universityService } from "../services/university.service"

export function useUniversityDashboard() {
  return useQuery({
    queryKey: ["university", "dashboard"],
    queryFn: () => universityService.getDashboard(),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })
}
