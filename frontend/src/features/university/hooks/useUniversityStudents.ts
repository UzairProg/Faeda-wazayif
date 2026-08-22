/**
 * features/university/hooks/useUniversityStudents.ts
 */
import { useQuery } from "@tanstack/react-query"
import { universityService } from "../services/university.service"
import type { StudentFilterParams } from "../types/university.types"

export function useUniversityStudents(params?: StudentFilterParams) {
  return useQuery({
    queryKey: ["university", "students", params],
    queryFn: () => universityService.getStudents(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })
}
