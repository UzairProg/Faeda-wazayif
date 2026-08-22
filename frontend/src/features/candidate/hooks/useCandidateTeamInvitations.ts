import { useQuery } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"

export const CANDIDATE_TEAM_INVITATIONS_QUERY_KEY = ["candidate", "teams", "invitations"] as const

export function useCandidateTeamInvitations() {
  return useQuery({
    queryKey: CANDIDATE_TEAM_INVITATIONS_QUERY_KEY,
    queryFn: () => candidateService.getReceivedInvitations(),
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}
