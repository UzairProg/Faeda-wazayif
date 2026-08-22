import { useQuery } from "@tanstack/react-query"
import { companyService } from "../services/company.service"

export function useCompanyTalentDetail(id?: string | number) {
  return useQuery({
    queryKey: ["company", "talent", id],
    queryFn: () => (id ? companyService.getTalentDetail(id) : Promise.reject("No id")),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}
