import { useQuery } from "@tanstack/react-query"
import { companyService } from "../services/company.service"

export function useCompanyApplicationDetail(id?: string | number) {
  return useQuery({
    queryKey: ["company", "application", id],
    queryFn: () =>
      id ? companyService.getApplicationDetail(id) : Promise.reject("No id"),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 3,
  })
}
