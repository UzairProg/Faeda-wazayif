/**
 * features/university/hooks/useUniversityStudentDetail.ts
 */
import { useQuery } from "@tanstack/react-query"
import { universityService } from "../services/university.service"

export function useUniversityStudentDetail(id?: string | number) {
  return useQuery({
    queryKey: ["university", "students", id],
    queryFn: () => universityService.getStudentDetail(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })
}
