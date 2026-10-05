/**
 * features/public/types/posts.types.ts
 *
 * Domain types for Career Articles, Insights, and Community Posts.
 * Supports segmented content by account type (University, Company, Job Seeker)
 * and tailored post sub-types.
 */

export type AccountType = "all" | "university" | "company" | "candidate"

// ── Budget types ──
export type BudgetType = "free" | "total" | "daily"

export interface BudgetConfig {
  budgetType: BudgetType
  totalBudget?: number | null
  dailyBudget?: number | null
  currency?: string      // default 'SAR'
  durationDays?: number | null
  startDate?: string
  endDate?: string
}

/** Estimated/proposed reach — NEVER guaranteed, always labeled as estimate */
export interface ProposedReach {
  isEstimate: true        // always true — never mix with actual views
  label: string           // e.g. "الوصول المقدر (تقديري)"
  min?: number | null
  max?: number | null
}

export type UniversityPostType =
  | "research_paper"
  | "job_fair"
  | "achievement"
  | "innovation"
  | "awards"

export type CompanyPostType =
  | "hiring_general"
  | "hiring_specialized"
  | "brand_image"
  | "talent_pool"
  | "team_spotlight"
  | "company_innovation"
  | "thought_leadership"

export type CandidatePostType =
  | "portfolio_showcase"
  | "seeking_work"
  | "certifications"
  | "career_tips"

export type PostType = UniversityPostType | CompanyPostType | CandidatePostType | string

export interface PostTypeOption {
  key: string
  accountType: "university" | "company" | "candidate"
  iconName?: string
  labels: {
    ar: string
    en: string
    hi: string
  }
  description?: {
    ar: string
    en: string
    hi: string
  }
}

export const ACCOUNT_POST_TYPES: Record<"university" | "company" | "candidate", PostTypeOption[]> = {
  university: [
    {
      key: "research_paper",
      accountType: "university",
      iconName: "FileText",
      labels: {
        ar: "أوراق بحثية ودراسات",
        en: "Research Papers & Studies",
        hi: "शोध पत्र और अध्ययन",
      },
      description: {
        ar: "نشر الأبحاث العلمية المحكمة والدراسات الأكاديمية",
        en: "Peer-reviewed scientific research and academic discoveries",
        hi: "समीक्षित वैज्ञानिक शोध और अकादमिक अध्ययन",
      },
    },
    {
      key: "job_fair",
      accountType: "university",
      iconName: "Calendar",
      labels: {
        ar: "معارض وملتقيات التوظيف",
        en: "Job Fairs & Career Days",
        hi: "रोजगार मेला और करियर दिवस",
      },
      description: {
        ar: "أيام المهن، ملتقيات التوظيف، وبرامج ربط الخريجين بالشركات",
        en: "Career exhibitions, student hiring fairs, and industry networking",
        hi: "करियर प्रदर्शनियां और छात्र भर्ती मेले",
      },
    },
    {
      key: "achievement",
      accountType: "university",
      iconName: "Award",
      labels: {
        ar: "إنجازات واعتمادات أكاديمية",
        en: "Academic Achievements & Accreditations",
        hi: "शैक्षणिक उपलब्धियां व मान्यताएं",
      },
      description: {
        ar: "الاعتمادات المؤسسية الدولية وتخريج الدفعات المتميزة",
        en: "Institutional accreditations and outstanding cohort graduations",
        hi: "संस्थागत मान्यता और उत्कृष्ट छात्र उपलब्धियां",
      },
    },
    {
      key: "innovation",
      accountType: "university",
      iconName: "Lightbulb",
      labels: {
        ar: "ابتكارات وبراءات اختراع",
        en: "Innovations & Patents",
        hi: "नवाचार और पेटेंट",
      },
      description: {
        ar: "مشاريع التخرج الريادية وبراءات الاختراع والحلول التقنية",
        en: "Student graduation innovations, patents, and tech spinoffs",
        hi: "स्नातक नवाचार, पेटेंट और तकनीकी समाधान",
      },
    },
    {
      key: "awards",
      accountType: "university",
      iconName: "Trophy",
      labels: {
        ar: "جوائز وتصنيفات دولية",
        en: "International Awards & Rankings",
        hi: "अंतर्राष्ट्रीय पुरस्कार व रैंकिंग",
      },
      description: {
        ar: "حصد المراكز المتقدمة في التصنيفات العالمية والمسابقات الدولية",
        en: "Global university rankings (QS/THE) and international student awards",
        hi: "वैश्विक विश्वविद्यालय रैंकिंग और अंतर्राष्ट्रीय पुरस्कार",
      },
    },
  ],

  company: [
    {
      key: "hiring_general",
      accountType: "company",
      iconName: "Users",
      labels: {
        ar: "بحث عام عن كفاءات",
        en: "General Talent Hiring",
        hi: "सामान्य प्रतिभा खोज",
      },
      description: {
        ar: "حملات التوظيف المفتوحة والفرص لجميع التخصصات والمستويات",
        en: "Open recruitment campaigns across multiple departments and levels",
        hi: "विभिन्न विभागों के लिए सामान्य भर्ती अभियान",
      },
    },
    {
      key: "hiring_specialized",
      accountType: "company",
      iconName: "Target",
      labels: {
        ar: "استقطاب كفاءات تخصصية",
        en: "Specialized Talent Search",
        hi: "विशिष्ट प्रतिभा खोज",
      },
      description: {
        ar: "فرص وظيفية دقيقة في مجالات الذكاء الاصطناعي، الأمن السيبراني، والسحابة",
        en: "Niche roles in AI, Cloud, Cybersecurity, Fintech, and Engineering",
        hi: "एआई, क्लाउड और साइबर सुरक्षा में विशिष्ट भूमिकाएं",
      },
    },
    {
      key: "brand_image",
      accountType: "company",
      iconName: "Sparkles",
      labels: {
        ar: "ثقافة وبيئة العمل",
        en: "Brand Image & Work Culture",
        hi: "ब्रांड छवि और कार्य संस्कृति",
      },
      description: {
        ar: "استعراض بيئة العمل الجاذبة، مزايا الموظفين، والمبادرات الداخلية",
        en: "Showcasing employer branding, workplace perks, and corporate values",
        hi: "कार्यस्थल संस्कृति, लाभ और कॉर्पोरेट मूल्यों का प्रदर्शन",
      },
    },
    {
      key: "talent_pool",
      accountType: "company",
      iconName: "Database",
      labels: {
        ar: "بناء قاعدة مواهب مستقبلية",
        en: "Talent Community & Pool",
        hi: "टैलेंट पूल और कम्युनिटी निर्माण",
      },
      description: {
        ar: "تسويق المنشأة وبناء علاقات مستدامة مع الكفاءات للتوظيف المستقبلي",
        en: "Building long-term engagement with prospective candidates and graduates",
        hi: "भावी उम्मीदवारों और स्नातकों के साथ दीर्घकालिक जुड़ाव",
      },
    },
    {
      key: "team_spotlight",
      accountType: "company",
      iconName: "UserCheck",
      labels: {
        ar: "التعريف بالفريق والقيادات",
        en: "Team & Leadership Spotlight",
        hi: "टीम और नेतृत्व की पहचान",
      },
      description: {
        ar: "تسليط الضوء على قيادات الشركة، فرق العمل، وقصص النجاح الفردية",
        en: "Spotlighting executives, high-performing teams, and employee stories",
        hi: "अधिकारियों, टीमों और कर्मचारी सफलता की कहानियों पर प्रकाश",
      },
    },
    {
      key: "company_innovation",
      accountType: "company",
      iconName: "Zap",
      labels: {
        ar: "إنجازات وابتكارات المنشأة",
        en: "Corporate Achievements & Innovations",
        hi: "कंपनी उपलब्धियां और नवाचार",
      },
      description: {
        ar: "إطلاق منتجات رقمية جديدة، توسعات السوق، والحلول التقنية المبتكرة",
        en: "New product launches, digital transformations, and industry milestones",
        hi: "नए उत्पाद लॉन्च और डिजिटल नवाचार मील के पत्थर",
      },
    },
    {
      key: "thought_leadership",
      accountType: "company",
      iconName: "Bookmark",
      labels: {
        ar: "رسالة علمية وصناعية ملهمة",
        en: "Scientific & Industry Insight",
        hi: "वैज्ञानिक और उद्योग संदेश",
      },
      description: {
        ar: "رؤى استراتيجية ومقالات قيادية حول مستقبل الصناعة واقتصاد المعرفة",
        en: "Executive thought leadership, market outlooks, and industrial foresight",
        hi: "उद्योग के भविष्य और नवाचार पर रणनीतिक अंतर्दृष्टि",
      },
    },
  ],

  candidate: [
    {
      key: "portfolio_showcase",
      accountType: "candidate",
      iconName: "Briefcase",
      labels: {
        ar: "استعراض مشاريع وأعمال",
        en: "Project & Portfolio Showcase",
        hi: "प्रोजेक्ट और पोर्टफोलियो प्रदर्शन",
      },
      description: {
        ar: "مشاركة المشاريع العملية وحلول المشاكل الواقعية والروابط البرمجية",
        en: "Showcase real-world projects, GitHub repositories, and case studies",
        hi: "वास्तविक दुनिया की परियोजनाओं और कोड का प्रदर्शन",
      },
    },
    {
      key: "seeking_work",
      accountType: "candidate",
      iconName: "Search",
      labels: {
        ar: "متاح لفرص العمل",
        en: "Open to Work",
        hi: "काम के अवसर के लिए उपलब्ध",
      },
      description: {
        ar: "إعلان الجاهزية الوظيفية واستعراض التخصص وسنوات الخبرة",
        en: "Announcing job readiness, target role preferences, and availability",
        hi: "उपलब्धता और लक्षित भूमिका प्राथमिकताओं की घोषणा",
      },
    },
    {
      key: "certifications",
      accountType: "candidate",
      iconName: "ShieldCheck",
      labels: {
        ar: "شهادات وإنجازات مهنية",
        en: "Certifications & Milestones",
        hi: "प्रमाणपत्र और मील के पत्थर",
      },
      description: {
        ar: "توثيق الشهادات الاحترافية (AWS, PMP, CFA) ومسابقات الهاكاثون",
        en: "Professional certifications, hackathon wins, and verified credentials",
        hi: "पेशेवर प्रमाणपत्र और हैकथॉन जीत का सत्यापन",
      },
    },
    {
      key: "career_tips",
      accountType: "candidate",
      iconName: "BookOpen",
      labels: {
        ar: "مقالات وتجارب مهنية",
        en: "Career Insights & Tips",
        hi: "करियर सुझाव और अनुभव",
      },
      description: {
        ar: "مشاركة الدروس المستفادة، نصائح المقابلات، وتجارب التعلم الذاتي",
        en: "Sharing interview lessons, learning journeys, and technical guides",
        hi: "इंटरव्यू टिप्स और सीखने के अनुभवों को साझा करना",
      },
    },
  ],
}

export interface PostAuthor {
  name: string
  title: string
  avatar: string
  isVerified?: boolean
  username: string
  accountType?: "university" | "company" | "candidate"
  organizationName?: string
  badge?: string
}

export interface PostComment {
  id: number
  author: string
  avatar: string
  text: string
  content?: string
  time: string
  createdAt?: string
  authorTitle?: string
  authorUsername?: string
  userType?: string
  userId?: number
  parentId?: number | null
  isOwner?: boolean
  replies?: PostComment[]
}

export type TargetAudienceRole = "all" | "candidate" | "company" | "university"

export interface CampaignAudience {
  roles: ("candidate" | "company" | "university")[]
  targetSpecializations?: string[]
  targetLocations?: string[]
  experienceLevels?: string[]
}

export interface PostArticle {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  category: string
  accountType: "university" | "company" | "candidate"
  postType: string
  postTypeLabel?: {
    ar: string
    en: string
    hi: string
  }
  tags: string[]
  coverImage: string
  mediaType?: "image" | "video"
  videoUrl?: string
  ctaText?: string
  ctaUrl?: string
  targetAudience?: CampaignAudience
  publishedAt: string
  readTime: string
  views: number
  likes: number
  commentsCount?: number
  sharesCount?: number
  savesCount?: number
  isLiked?: boolean
  isSaved?: boolean
  status?: string
  author: PostAuthor
  comments?: PostComment[]
  // ── Budget & Estimated Reach ──
  budget?: BudgetConfig
  proposedReach?: ProposedReach
}

export interface NotificationItem {
  id: number
  recipientType: string
  recipientId: number
  actor: {
    type: string
    id: number
    name: string
    avatar: string
  }
  actionType: "like" | "comment" | "share" | "reply"
  campaignId?: number
  commentId?: number
  title: string
  message: string
  isRead: boolean
  readAt?: string
  createdAt?: string
}

export interface CampaignAnalyticsData {
  campaign_id: number
  title: string
  created_at?: string
  // ── ACTUAL real metrics from DB ──
  actual?: {
    views: number
    likes: number
    comments: number
    shares: number
    saves: number
    total_engagements: number
    engagement_rate: number
  }
  // ── ESTIMATED/PROPOSED reach (budget-based, never guaranteed) ──
  estimated?: {
    isEstimate: true
    label: string
    proposedReachMin?: number | null
    proposedReachMax?: number | null
    budgetType?: string
    totalBudget?: number | null
    dailyBudget?: number | null
    currency?: string
    durationDays?: number | null
  }
  // backward-compat flat fields
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  total_engagements: number
  engagement_rate: number
  recent_likes?: { user_name: string; user_type: string; time: string }[]
  recent_comments?: { author: string; content: string; time: string }[]
  recent_shares?: { user_name: string; quote?: string; time: string }[]
}

export interface PostCategory {
  name: string
  key: string
  count: number
}

export interface TrendingTopic {
  id: number
  title: string
  posts: string
  category: string
}

export interface SuggestedAuthor {
  name: string
  title: string
  avatar: string
  username: string
  articlesCount: number
  isVerified?: boolean
  accountType?: "university" | "company" | "candidate"
}

export interface PostsResponse {
  posts: PostArticle[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  categories: PostCategory[]
  trendingTopics: TrendingTopic[]
  suggestedAuthors: SuggestedAuthor[]
}

export interface PostDetailResponse {
  post: PostArticle
  related: PostArticle[]
}

export interface CreatePostDTO {
  title: string
  summary?: string
  content: string
  category?: string
  accountType?: "university" | "company" | "candidate"
  postType?: string
  coverImage?: string
  mediaType?: "image" | "video"
  videoUrl?: string
  ctaText?: string
  ctaUrl?: string
  targetAudience?: CampaignAudience
  tags?: string[]
  authorName?: string
  authorTitle?: string
  authorUsername?: string
  // ── Budget (optional, flows to backend) ──
  budgetType?: BudgetType
  totalBudget?: number | null
  dailyBudget?: number | null
  currency?: string
  durationDays?: number | null
  startDate?: string
  endDate?: string
}
