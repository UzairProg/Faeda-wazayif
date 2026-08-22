import { useQuery } from "@tanstack/react-query"
import { companyService } from "../services/company.service"

export function useCompanyDashboard() {
  return useQuery({
    queryKey: ["company", "dashboard"],
    queryFn: companyService.getDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
