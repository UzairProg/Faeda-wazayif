import { useQuery } from "@tanstack/react-query"
import { companyService } from "../services/company.service"

export function useCompanyApplications(params?: {
  job_id?: number
  status?: string
  q?: string
  page?: number
  page_size?: number
}) {
  return useQuery({
    queryKey: ["company", "applications", params],
    queryFn: () => companyService.getApplications(params),
    staleTime: 1000 * 60 * 2,
  })
}
