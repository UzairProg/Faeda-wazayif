/**
 * features/university/hooks/useUniversityDepartments.ts
 */
import { useQuery } from "@tanstack/react-query"
import { universityService } from "../services/university.service"

export function useUniversityDepartments() {
  return useQuery({
    queryKey: ["university", "departments"],
    queryFn: () => universityService.getDepartments(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
