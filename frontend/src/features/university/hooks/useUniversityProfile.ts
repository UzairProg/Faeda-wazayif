/**
 * features/university/hooks/useUniversityProfile.ts
 */
import { useQuery } from "@tanstack/react-query"
import { universityService } from "../services/university.service"

export function useUniversityProfile() {
  return useQuery({
    queryKey: ["university", "profile"],
    queryFn: () => universityService.getProfile(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
