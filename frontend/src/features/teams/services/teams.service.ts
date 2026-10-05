import { apiClient as api } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  Team,
  TeamDetail,
  TeamFilter,
  TeamListResponse,
  TeamSuggestion,
} from "../types/team.types"

const FALLBACK_TEAMS: TeamDetail[] = [
  {
    id: "team-1",
    name: "فريق الابتكار السحابي والذكاء الاصطناعي (Cloud & AI Alpha Squad)",
    about: "فريق متكامل عالي الكفاءة متخصص في بناء ونشر النماذج اللغوية وهندسة البنى السحابية الموزعة للمؤسسات والهيئات الحكومية.",
    achievements: "تسليم 8 منصات ذكاء اصطناعي وطنية، وتحقيق معدل رضا 98% في استشارات الحوسبة السحابية.",
    generalProgram: "تطوير الحلول السحابية المتقدمة",
    semiSpecialProgram: "هندسة النماذج اللغوية (LLMs)",
    specialProgram: "بناء البنى التحتية DevSecOps",
    logoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&h=128&fit=crop",
    memberCount: 6,
    capabilities: ["AI & LLM Fine-Tuning", "Cloud Architecture", "FastAPI / Python", "React / TypeScript", "Kubernetes"],
    location: "الرياض",
    isRemote: true,
    creationDate: "2024-03-10T00:00:00Z",
    members: [
      {
        id: "m-1",
        name: "م. أحمد الفارسي",
        role: "قائد الفريق وكبير مهندسي السحابة",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop",
        skills: ["AWS", "Kubernetes", "DevSecOps"],
      },
      {
        id: "m-2",
        name: "د. سارة الغامدي",
        role: "كبيرة باحثي الذكاء الاصطناعي",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop",
        skills: ["PyTorch", "LLMs", "NLP"],
      },
      {
        id: "m-3",
        name: "عبدالله العتيبي",
        role: "مهندس واجهات أمامية أول",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop",
        skills: ["React", "TypeScript", "TailwindCSS"],
      },
    ],
    jobs: [],
  },
  {
    id: "team-2",
    name: "فرقة تصميم تجربة المنتجات الرقمية (Nexus UX Studio)",
    about: "استوديو تصميم منتجات متكامل يركز على بحوث المستخدمين، نظم التصميم الشاملة، وبناء واجهات سلسة للمنتجات المالية والخدمية.",
    achievements: "إعادة تصميم 5 تطبيقات FinTech سعودية وتجاوزت تقييماتها 4.8 نجوم على المتاجر الرقمية.",
    generalProgram: "تصميم واجهات وتجارب المستخدمين",
    semiSpecialProgram: "تطوير منظومات التصميم (Design Systems)",
    specialProgram: "بحوث المستخدمين واختبارات القابلية",
    logoUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=128&h=128&fit=crop",
    memberCount: 4,
    capabilities: ["Figma Design Systems", "User Research", "Mobile UI/UX", "Prototyping", "Design Ops"],
    location: "جدة",
    isRemote: true,
    creationDate: "2024-01-20T00:00:00Z",
    members: [
      {
        id: "m-4",
        name: "نورة القحطاني",
        role: "قائدة التصميم وتجربة المستخدم",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop",
        skills: ["Figma", "Design Systems", "UX Research"],
      },
      {
        id: "m-5",
        name: "فيصل الشهري",
        role: "مصمم تفاعلي ومحرك واجهات",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
        skills: ["Micro-interactions", "Motion", "Figma"],
      },
    ],
    jobs: [],
  },
  {
    id: "team-3",
    name: "كتيبة التقنية المالية والتجارة الذكية (FinTech Squad)",
    about: "فريق هندسي متخصص في بناء بوابات الدفع الإلكتروني، الربط البنكي المفتوح، ومطابقة الأنظمة المحاسبية للشركات سريعة النمو.",
    achievements: "ربط ومعالجة أكثر من 500,000 عملية دفع ناجحة عبر بوابات مدى وفيزا وماستركارد.",
    generalProgram: "التقنية المالية والمدفوعات الرقمية",
    semiSpecialProgram: "الربط البنكي وحلول الصيرفة المفتوحة",
    specialProgram: "الأمن المالي ومكافحة الاحتيال",
    logoUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=128&h=128&fit=crop",
    memberCount: 5,
    capabilities: ["Payment Gateways", "SAMA Regulations", "Go / Python", "PostgreSQL", "PCI-DSS"],
    location: "الرياض",
    isRemote: false,
    creationDate: "2023-11-05T00:00:00Z",
    members: [
      {
        id: "m-6",
        name: "خالد الحربي",
        role: "كبير مهندسي التقنية المالية",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop",
        skills: ["Payment APIs", "Go", "PCI-DSS"],
      },
    ],
    jobs: [],
  },
]

function filterFallbackTeams(filter: TeamFilter = {}): TeamListResponse {
  let list = [...FALLBACK_TEAMS]

  if (filter.query && filter.query.trim()) {
    const q = filter.query.trim().toLowerCase()
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.about && t.about.toLowerCase().includes(q)) ||
        t.capabilities.some((c) => c.toLowerCase().includes(q))
    )
  }

  if (filter.location && filter.location.trim()) {
    const loc = filter.location.trim().toLowerCase()
    list = list.filter((t) => t.location.toLowerCase().includes(loc))
  }

  const total = list.length
  const page = filter.page && filter.page > 0 ? filter.page : 1
  const pageSize = filter.pageSize && filter.pageSize > 0 ? filter.pageSize : 9
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const paged = list.slice(start, start + pageSize)

  return {
    teams: paged,
    total,
    page,
    pageSize,
    totalPages,
  }
}

function buildTeamParams(filter: TeamFilter): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}
  if (filter.query) params.q = filter.query
  if (filter.location) params.location = filter.location
  if (filter.page) params.page = filter.page
  if (filter.pageSize) params.page_size = filter.pageSize
  return params
}

/**
 * Fetch a paginated list of public teams with offline fallback.
 */
export async function getTeams(filter: TeamFilter = {}): Promise<TeamListResponse> {
  try {
    const { data } = await api.get<TeamListResponse>(API_CONFIG.ENDPOINTS.TEAMS.LIST, {
      params: buildTeamParams(filter),
    })
    if (data && Array.isArray(data.teams) && data.teams.length > 0) {
      return data
    }
    return filterFallbackTeams(filter)
  } catch {
    return filterFallbackTeams(filter)
  }
}

/**
 * Fetch a single team by ID including its members and linked opportunities with offline fallback.
 */
export async function getTeamById(id: string): Promise<TeamDetail> {
  try {
    const { data } = await api.get<TeamDetail>(API_CONFIG.ENDPOINTS.TEAMS.DETAIL(id))
    if (data && data.id) {
      return data
    }
  } catch {
    // fallback
  }

  const match = FALLBACK_TEAMS.find((t) => t.id === id || String(t.id) === String(id))
  if (match) return match

  return { ...FALLBACK_TEAMS[0], id }
}

/**
 * Fetch debounced autocomplete suggestions for team search.
 */
export async function getTeamSuggestions(query: string): Promise<TeamSuggestion[]> {
  if (!query || query.trim().length < 2) return []
  const cleanQ = query.trim().toLowerCase()

  try {
    const { data } = await api.get<{ suggestions: TeamSuggestion[] }>(
      API_CONFIG.ENDPOINTS.TEAMS.SUGGESTIONS,
      { params: { q: cleanQ } }
    )
    if (data?.suggestions && data.suggestions.length > 0) {
      return data.suggestions
    }
  } catch {
    // fallback
  }

  return FALLBACK_TEAMS.filter((t) => t.name.toLowerCase().includes(cleanQ)).map((t) => ({
    id: t.id,
    label: t.name,
    subLabel: `${t.memberCount} أعضاء`,
    category: "فريق عمل",
    value: t.name,
    location: t.location,
  }))
}

export type { Team, TeamDetail, TeamFilter, TeamListResponse, TeamSuggestion }

