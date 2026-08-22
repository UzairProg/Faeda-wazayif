import { useMutation, useQueryClient } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"
import type {
  CreateTeamPayload,
  UpdateTeamPayload,
  InviteMemberPayload,
} from "../types/candidate.types"
import { CANDIDATE_TEAMS_QUERY_KEY } from "./useCandidateTeams"
import { CANDIDATE_TEAM_INVITATIONS_QUERY_KEY } from "./useCandidateTeamInvitations"

export function useCandidateTeamActions(teamId?: string | number) {
  const queryClient = useQueryClient()

  const invalidateTeamQueries = (specificTeamId?: string | number) => {
    queryClient.invalidateQueries({ queryKey: CANDIDATE_TEAMS_QUERY_KEY })
    queryClient.invalidateQueries({ queryKey: CANDIDATE_TEAM_INVITATIONS_QUERY_KEY })
    if (specificTeamId || teamId) {
      const idToInvalidate = specificTeamId ?? teamId
      queryClient.invalidateQueries({
        queryKey: ["candidate", "teams", "detail", String(idToInvalidate)],
      })
    }
  }

  const createTeamMutation = useMutation({
    mutationFn: (payload: CreateTeamPayload) => candidateService.createTeam(payload),
    onSuccess: (data) => {
      invalidateTeamQueries(data.teamId)
    },
  })

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdateTeamPayload }) =>
      candidateService.updateTeam(id, payload),
    onSuccess: (_, variables) => {
      invalidateTeamQueries(variables.id)
    },
  })

  const deleteTeamMutation = useMutation({
    mutationFn: (id: string | number) => candidateService.deleteTeam(id),
    onSuccess: (_, id) => {
      invalidateTeamQueries(id)
    },
  })

  const leaveTeamMutation = useMutation({
    mutationFn: (id: string | number) => candidateService.leaveTeam(id),
    onSuccess: (_, id) => {
      invalidateTeamQueries(id)
    },
  })

  const removeMemberMutation = useMutation({
    mutationFn: ({ id, memberUserId }: { id: string | number; memberUserId: string }) =>
      candidateService.removeTeamMember(id, memberUserId),
    onSuccess: (_, variables) => {
      invalidateTeamQueries(variables.id)
    },
  })

  const inviteMemberMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: InviteMemberPayload }) =>
      candidateService.inviteCandidateToTeam(id, payload),
    onSuccess: (_, variables) => {
      invalidateTeamQueries(variables.id)
    },
  })

  const respondInvitationMutation = useMutation({
    mutationFn: ({ invId, action }: { invId: number; action: "accept" | "reject" }) =>
      candidateService.respondToInvitation(invId, action),
    onSuccess: () => {
      invalidateTeamQueries()
    },
  })

  const cancelInvitationMutation = useMutation({
    mutationFn: (invId: number) => candidateService.cancelInvitation(invId),
    onSuccess: () => {
      invalidateTeamQueries()
    },
  })

  return {
    createTeamMutation,
    updateTeamMutation,
    deleteTeamMutation,
    leaveTeamMutation,
    removeMemberMutation,
    inviteMemberMutation,
    respondInvitationMutation,
    cancelInvitationMutation,
  }
}
