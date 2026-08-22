import { useQuery } from "@tanstack/react-query"
import { companyService } from "../services/company.service"

export function useCompanyTalent(params?: {
  q?: string
  skill?: string
  field?: string
  location?: string
  experience?: string
  education?: string
  verified?: boolean
  page?: number
  page_size?: number
}) {
  return useQuery({
    queryKey: ["company", "talent", params],
    queryFn: () => companyService.getTalent(params),
    staleTime: 1000 * 60 * 2,
  })
}
