import { useQuery } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"

export const CANDIDATE_TEAMS_QUERY_KEY = ["candidate", "teams"] as const

export function useCandidateTeams() {
  return useQuery({
    queryKey: CANDIDATE_TEAMS_QUERY_KEY,
    queryFn: () => candidateService.getTeams(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
