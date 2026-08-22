import { useQuery } from "@tanstack/react-query"
import { companyService } from "../services/company.service"

export function useCompanyTeams(params?: {
  q?: string
  specialization?: string
  page?: number
  page_size?: number
}) {
  return useQuery({
    queryKey: ["company", "teams", params],
    queryFn: () => companyService.getTeams(params),
    staleTime: 1000 * 60 * 3,
  })
}

export function useCompanyTeamDetail(id?: string | number) {
  return useQuery({
    queryKey: ["company", "team", id],
    queryFn: () => (id ? companyService.getTeamDetail(id) : Promise.reject("No id")),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}
