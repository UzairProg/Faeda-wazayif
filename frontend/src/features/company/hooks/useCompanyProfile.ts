import { useQuery } from "@tanstack/react-query"
import { companyService } from "../services/company.service"

export function useCompanyProfile() {
  return useQuery({
    queryKey: ["company", "profile"],
    queryFn: companyService.getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
