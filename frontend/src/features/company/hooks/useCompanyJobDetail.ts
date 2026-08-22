import { useQuery } from "@tanstack/react-query"
import { companyService } from "../services/company.service"

export function useCompanyJobDetail(id?: string | number) {
  return useQuery({
    queryKey: ["company", "job", id],
    queryFn: () => (id ? companyService.getJobDetail(id) : Promise.reject("No id")),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 3,
  })
}
