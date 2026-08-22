/**
 * features/university/hooks/useUniversityVerifications.ts
 */
import { useQuery } from "@tanstack/react-query"
import { universityService } from "../services/university.service"

export function useUniversityVerifications(params?: { status?: string; department?: string; q?: string }) {
  return useQuery({
    queryKey: ["university", "verifications", params],
    queryFn: () => universityService.getVerifications(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })
}
