import { useQuery } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"

export const CANDIDATE_TEAM_DETAIL_QUERY_KEY = (id: string | number) => ["candidate", "teams", "detail", String(id)] as const

export function useCandidateTeamDetail(id?: string | number) {
  return useQuery({
    queryKey: CANDIDATE_TEAM_DETAIL_QUERY_KEY(id ?? ""),
    queryFn: () => candidateService.getTeamDetail(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
