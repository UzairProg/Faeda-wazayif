/**
 * features/teams/hooks/useTeams.ts
 *
 * Custom React hooks for fetching teams, single team details,
 * and debounced autocomplete suggestions for team search.
 */
import { useState, useEffect, useCallback, useRef } from "react"
import {
  getTeams,
  getTeamById,
  getTeamSuggestions,
} from "../services/teams.service"
import type {
  TeamDetail,
  TeamFilter,
  TeamListResponse,
  TeamSuggestion,
} from "../types/team.types"

interface UseTeamsResult {
  data: TeamListResponse | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch paginated teams based on active filters.
 */
export function useTeams(filter: TeamFilter = {}): UseTeamsResult {
  const [data, setData] = useState<TeamListResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const filterKey = JSON.stringify(filter)

  const fetchTeams = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getTeams(filter)
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("تعذر تحميل البيانات"))
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [filterKey])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  return { data, isLoading, error, refetch: fetchTeams }
}

interface UseTeamDetailResult {
  team: TeamDetail | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch a single team detail by ID.
 */
export function useTeamDetail(id: string | undefined): UseTeamDetailResult {
  const [team, setTeam] = useState<TeamDetail | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDetail = useCallback(async () => {
    if (!id) {
      setIsLoading(false)
      setError(new Error("معرّف الفريق غير صحيح"))
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await getTeamById(id)
      setTeam(res)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("لم يتم العثور على الفريق"))
      setTeam(null)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return { team, isLoading, error, refetch: fetchDetail }
}

interface UseTeamAutocompleteResult {
  suggestions: TeamSuggestion[]
  isLoading: boolean
}

/**
 * Debounced hook for fetching team search autocomplete suggestions.
 */
export function useTeamAutocomplete(query: string, delayMs = 250): UseTeamAutocompleteResult {
  const [suggestions, setSuggestions] = useState<TeamSuggestion[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    timeoutRef.current = setTimeout(async () => {
      try {
        const results = await getTeamSuggestions(trimmed)
        setSuggestions(results)
      } catch {
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, delayMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, delayMs])

  return { suggestions, isLoading }
}
