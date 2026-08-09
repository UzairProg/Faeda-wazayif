/**
 * features/companies/hooks/useCompanies.ts
 *
 * Custom React hooks for fetching companies, single company details,
 * and debounced autocomplete suggestions for search.
 */
import { useState, useEffect, useCallback, useRef } from "react"
import {
  getCompanies,
  getCompanyById,
  getCompanySuggestions,
} from "../services/companies.service"
import type {
  CompanyDetail,
  CompanyFilter,
  CompanyListResponse,
  CompanySuggestion,
} from "../types/company.types"

interface UseCompaniesResult {
  data: CompanyListResponse | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch paginated companies based on active filters.
 */
export function useCompanies(filter: CompanyFilter = {}): UseCompaniesResult {
  const [data, setData] = useState<CompanyListResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  // Serialize filter to memoize dependency
  const filterKey = JSON.stringify(filter)

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getCompanies(filter)
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("تعذر تحميل البيانات"))
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [filterKey])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  return { data, isLoading, error, refetch: fetchCompanies }
}

interface UseCompanyDetailResult {
  company: CompanyDetail | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch a single company detail by ID.
 */
export function useCompanyDetail(id: string | undefined): UseCompanyDetailResult {
  const [company, setCompany] = useState<CompanyDetail | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDetail = useCallback(async () => {
    if (!id) {
      setIsLoading(false)
      setError(new Error("معرّف الشركة غير صحيح"))
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await getCompanyById(id)
      setCompany(res)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("لم يتم العثور على الشركة"))
      setCompany(null)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return { company, isLoading, error, refetch: fetchDetail }
}

interface UseCompanyAutocompleteResult {
  suggestions: CompanySuggestion[]
  isLoading: boolean
}

/**
 * Debounced hook for fetching company search autocomplete suggestions.
 */
export function useCompanyAutocomplete(query: string, delayMs = 250): UseCompanyAutocompleteResult {
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([])
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
        const results = await getCompanySuggestions(trimmed)
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
