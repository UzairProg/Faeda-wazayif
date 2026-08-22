import { useQuery } from "@tanstack/react-query"
import { companyService } from "../services/company.service"

export function useCompanyJobs(params?: {
  status?: string
  q?: string
  page?: number
  page_size?: number
}) {
  return useQuery({
    queryKey: ["company", "jobs", params],
    queryFn: () => companyService.getJobs(params),
    staleTime: 1000 * 60 * 2,
  })
}
