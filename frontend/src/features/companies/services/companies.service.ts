import { apiClient as api } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  Company,
  CompanyDetail,
  CompanyFilter,
  CompanyListResponse,
  CompanySuggestion,
} from "../types/company.types"

const FALLBACK_COMPANIES: CompanyDetail[] = [
  {
    id: "comp-1",
    name: "أرامكو الرقمية | Aramco Digital",
    arabicName: "أرامكو الرقمية",
    englishName: "Aramco Digital",
    faedaName: "aramco-digital",
    logoUrl: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=128&h=128&fit=crop",
    description: "الذراع الرقمية لشركة أرامكو السعودية لتطوير الابتكارات والحلول السحابية والذكاء الاصطناعي في قطاع الطاقة والصناعة.",
    location: "الظهران",
    country: "المملكة العربية السعودية",
    companyType: "مؤسسة شبه حكومية / طاقة وتقنية",
    companySize: "+10,000 موظف",
    companyField: "تقنية المعلومات وحلول الطاقة الرقمية",
    website: "https://aramcodigital.com",
    twitter: "https://twitter.com/AramcoDigital",
    instagram: null,
    isVerified: true,
    verifiedAt: "2024-01-15T00:00:00Z",
    openJobsCount: 14,
    createdAt: "2024-01-01T00:00:00Z",
    jobs: [],
  },
  {
    id: "comp-2",
    name: "الهيئة السعودية للبيانات والذكاء الاصطناعي | SDAIA",
    arabicName: "سدايا",
    englishName: "SDAIA",
    faedaName: "sdaia",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
    description: "الجهة الوطنية المسؤولة عن قيادة أجندة البيانات والذكاء الاصطناعي في المملكة العربية السعودية وصناع منظومة علام.",
    location: "الرياض",
    country: "المملكة العربية السعودية",
    companyType: "جهة حكومية",
    companySize: "1,000 - 5,000 موظف",
    companyField: "الذكاء الاصطناعي وعلوم البيانات",
    website: "https://sdaia.gov.sa",
    twitter: "https://twitter.com/SDAIA_SA",
    instagram: null,
    isVerified: true,
    verifiedAt: "2023-05-10T00:00:00Z",
    openJobsCount: 22,
    createdAt: "2023-01-01T00:00:00Z",
    jobs: [],
  },
  {
    id: "comp-3",
    name: "شركة الاتصالات السعودية | stc",
    arabicName: "إس تي سي",
    englishName: "stc group",
    faedaName: "stc",
    logoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&h=128&fit=crop",
    description: "الممكن الرقمي الرائد في منطقة الشرق الأوسط وشمال أفريقيا في مجالات الاتصالات والتقنية المالية والحوسبة السحابية.",
    location: "الرياض",
    country: "المملكة العربية السعودية",
    companyType: "شركة مساهمة عامة",
    companySize: "+20,000 موظف",
    companyField: "الاتصالات والتقنية الرقمية",
    website: "https://stc.com.sa",
    twitter: "https://twitter.com/stc",
    instagram: null,
    isVerified: true,
    verifiedAt: "2023-03-20T00:00:00Z",
    openJobsCount: 31,
    createdAt: "2023-01-01T00:00:00Z",
    jobs: [],
  },
  {
    id: "comp-4",
    name: "نيوم | NEOM",
    arabicName: "نيوم",
    englishName: "NEOM",
    faedaName: "neom",
    logoUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&h=128&fit=crop",
    description: "مشروع المستقبل العالمي الرائد لمدن ومجتمعات المستقبل المستدامة على ساحل البحر الأحمر شمال غرب المملكة.",
    location: "نيوم",
    country: "المملكة العربية السعودية",
    companyType: "مشروع استثماري وطني",
    companySize: "+5,000 موظف",
    companyField: "تطوير المدن الذكية والاستدامة",
    website: "https://neom.com",
    twitter: "https://twitter.com/NEOM",
    instagram: null,
    isVerified: true,
    verifiedAt: "2023-02-12T00:00:00Z",
    openJobsCount: 45,
    createdAt: "2023-01-01T00:00:00Z",
    jobs: [],
  },
  {
    id: "comp-5",
    name: "هنقرستيشن | HungerStation",
    arabicName: "هنقرستيشن",
    englishName: "HungerStation",
    faedaName: "hungerstation",
    logoUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&h=128&fit=crop",
    description: "أكبر وأعرق منصة لتوصيل الطعام والسلع السريعة في المملكة العربية السعودية مع حلول لوجستية ذكية.",
    location: "الرياض",
    country: "المملكة العربية السعودية",
    companyType: "شركة تقنية خاصة",
    companySize: "1,000 - 5,000 موظف",
    companyField: "التجارة الإلكترونية والتوصيل السريع",
    website: "https://hungerstation.com",
    twitter: "https://twitter.com/HungerStation",
    instagram: null,
    isVerified: true,
    verifiedAt: "2023-06-18T00:00:00Z",
    openJobsCount: 18,
    createdAt: "2023-01-01T00:00:00Z",
    jobs: [],
  },
  {
    id: "comp-6",
    name: "شركة علم | Elm",
    arabicName: "علم لأمن المعلومات",
    englishName: "Elm",
    faedaName: "elm",
    logoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&h=128&fit=crop",
    description: "الشركة الرائدة في تقديم الحلول الرقمية الآمنة، وخدمات أمن المعلومات، والمنظومات الحكومية المتكاملة بالمملكة.",
    location: "الرياض",
    country: "المملكة العربية السعودية",
    companyType: "شركة مساهمة عامة",
    companySize: "5,000 - 10,000 موظف",
    companyField: "الحلول الرقمية والتحول السيبراني",
    website: "https://elm.sa",
    twitter: "https://twitter.com/Elm",
    instagram: null,
    isVerified: true,
    verifiedAt: "2023-04-14T00:00:00Z",
    openJobsCount: 19,
    createdAt: "2023-01-01T00:00:00Z",
    jobs: [],
  },
]

function filterFallbackCompanies(filter: CompanyFilter = {}): CompanyListResponse {
  let list = [...FALLBACK_COMPANIES]

  if (filter.query && filter.query.trim()) {
    const q = filter.query.trim().toLowerCase()
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.companyField && c.companyField.toLowerCase().includes(q))
    )
  }

  if (filter.location && filter.location.trim()) {
    const loc = filter.location.trim().toLowerCase()
    list = list.filter((c) => c.location && c.location.toLowerCase().includes(loc))
  }

  if (filter.verified !== undefined) {
    list = list.filter((c) => c.isVerified === filter.verified)
  }

  if (filter.hasJobs) {
    list = list.filter((c) => c.openJobsCount > 0)
  }

  const total = list.length
  const page = filter.page && filter.page > 0 ? filter.page : 1
  const pageSize = filter.pageSize && filter.pageSize > 0 ? filter.pageSize : 9
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const paged = list.slice(start, start + pageSize)

  return {
    companies: paged,
    total,
    page,
    pageSize,
    totalPages,
  }
}

function buildCompanyParams(filter: CompanyFilter): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}
  if (filter.query) params.q = filter.query
  if (filter.location) params.location = filter.location
  if (filter.verified !== undefined) params.verified = filter.verified
  if (filter.hasJobs !== undefined) params.has_jobs = filter.hasJobs
  if (filter.page) params.page = filter.page
  if (filter.pageSize) params.page_size = filter.pageSize
  return params
}

/**
 * Fetch a paginated list of public companies with offline fallback.
 */
export async function getCompanies(filter: CompanyFilter = {}): Promise<CompanyListResponse> {
  try {
    const { data } = await api.get<CompanyListResponse>(API_CONFIG.ENDPOINTS.COMPANIES.LIST, {
      params: buildCompanyParams(filter),
    })
    if (data && Array.isArray(data.companies) && data.companies.length > 0) {
      return data
    }
    return filterFallbackCompanies(filter)
  } catch {
    return filterFallbackCompanies(filter)
  }
}

/**
 * Fetch a single company by ID including its available jobs with offline fallback.
 */
export async function getCompanyById(id: string): Promise<CompanyDetail> {
  try {
    const { data } = await api.get<CompanyDetail>(API_CONFIG.ENDPOINTS.COMPANIES.DETAIL(id))
    if (data && data.id) {
      return data
    }
  } catch {
    // offline fallback
  }

  const match = FALLBACK_COMPANIES.find(
    (c) => c.id === id || c.faedaName === id || String(c.id) === String(id)
  )
  if (match) return match

  return { ...FALLBACK_COMPANIES[0], id }
}

/**
 * Fetch debounced autocomplete suggestions for company search.
 */
export async function getCompanySuggestions(query: string): Promise<CompanySuggestion[]> {
  if (!query || query.trim().length < 2) return []
  const cleanQ = query.trim().toLowerCase()

  try {
    const { data } = await api.get<{ suggestions: CompanySuggestion[] }>(
      API_CONFIG.ENDPOINTS.COMPANIES.SUGGESTIONS,
      { params: { q: cleanQ } }
    )
    if (data?.suggestions && data.suggestions.length > 0) {
      return data.suggestions
    }
  } catch {
    // fallback
  }

  return FALLBACK_COMPANIES.filter(
    (c) =>
      c.name.toLowerCase().includes(cleanQ) ||
      (c.englishName && c.englishName.toLowerCase().includes(cleanQ))
  ).map((c) => ({
    id: c.id,
    label: c.name,
    subLabel: c.companyField || "شركة معتمدة",
    category: "شركة",
    value: c.name,
    location: c.location,
  }))
}

export type { Company, CompanyDetail, CompanyFilter, CompanyListResponse, CompanySuggestion }

