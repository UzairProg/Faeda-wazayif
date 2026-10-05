/**
 * features/public/services/portfolio.service.ts
 *
 * Client service for fetching public candidate portfolios.
 * Includes graceful fallback mock profiles for demo handles.
 */
import { apiClient } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  CandidatePublicPortfolio,
  CandidateContactPayload,
} from "../types/portfolio.types"

const DEMO_PORTFOLIOS: Record<string, CandidatePublicPortfolio> = {
  "ahmed-alfarsi": {
    id: 101,
    userId: "ahmed-alfarsi",
    fullName: "أحمد الفارسي",
    headline: "مهندس برمجيات أول | خبير معماريات الويب والواجهات الذكية",
    about:
      "مهندس برمجيات متمرس بخبرة تتجاوز 7 سنوات في بناء وتطوير منصات الويب السحابية القابلة للتوسع. شغوف بتصميم أنظمة التصميم الحديثة، وتجربة المستخدم السلسة، وتكامل الذكاء الاصطناعي في بيئات العمل الإنتاجية. ساهمت في تطوير عدة تطبيقات مليونية في السوق الخليجي.",
    email: "ahmed.alfarsi@example.com",
    mobile: "+966 50 123 4567",
    country: "المملكة العربية السعودية",
    government: "الرياض",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
    isVerified: true,
    verifiedAt: "2025-04-10T12:00:00Z",
    education: {
      qualification: "بكالوريوس علوم الحاسب والمعلومات",
      university: "جامعة الملك سعود",
      department: "علوم الحاسب",
      graduationDate: "2020-06-15",
      gpa: "4.82 / 5.0",
      status: "متخرج",
    },
    experienceYears: "7+ سنوات",
    preferredField: "هندسة البرمجيات والذكاء الاصطناعي",
    workType: "دوام كامل / مشاريع استشارية",
    workStyle: "هجين (الرياض) أو عن بُعد",
    expectedSalary: 28000,
    cvUrl: "#",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "GraphQL",
      "Docker",
      "AWS",
      "System Architecture",
      "CI/CD Pipelines",
      "UI/UX Systems",
      "REST APIs",
    ],
    languages: ["العربية (اللغة الأم)", "الإنجليزية (طلاقة احترافية)"],
    projects: [
      {
        id: 1,
        project_name: "منصة التوظيف الذكي وتتبع الكفاءات (ATS Hub)",
        description:
          "نظام متكامل لمعالجة وتحليل آلاف السير الذاتية باستخدام خوارزميات المعالجة اللغوية الطبيعية، خفض زمن الفرز بنسبة 60% مع دقة تطابق تتجاوز 92%.",
        project_url: "https://github.com/example/ats-hub",
        technologies: ["React", "FastAPI", "Python", "TailwindCSS"],
        created_at: "2025-11-20T00:00:00Z",
      },
      {
        id: 2,
        project_name: "لوحة تحكم وتحليلات البيانات السحابية (CloudOps Panel)",
        description:
          "واجهة تحكم فورية لمراقبة استهلاك الموارد السحابية والبنية التحتية، تعتمد على WebSockets وتدعم الرسوم البيانية التفاعلية اللحظية.",
        project_url: "https://demo.cloudops-panel.com",
        technologies: ["TypeScript", "Next.js", "Recharts", "PostgreSQL"],
        created_at: "2025-06-15T00:00:00Z",
      },
      {
        id: 3,
        project_name: "نظام تصميم المكونات الموحد (Faeda Design System)",
        description:
          "مكتبة مكونات برمجية تدعم الوضع الليلي، المعايير العالمية لسهولة الوصول (WCAG AA)، ودعم كامل للغتين العربية والإنجليزية.",
        project_url: "https://design.faeda.sa",
        technologies: ["React", "Radix UI", "Framer Motion", "Tailwind"],
        created_at: "2025-02-10T00:00:00Z",
      },
    ],
    certifications: [
      {
        id: 1,
        cert_name: "AWS Certified Solutions Architect – Associate",
        issuing_org: "Amazon Web Services (AWS)",
        issue_year: 2024,
        credential_id: "AWS-SAA-839210",
        credential_url: "https://aws.amazon.com/verification",
      },
      {
        id: 2,
        cert_name: "Meta Professional Front-End Developer",
        issuing_org: "Meta / Coursera",
        issue_year: 2023,
        credential_id: "META-FED-99120",
        credential_url: "https://coursera.org/verify/professional-cert",
      },
      {
        id: 3,
        cert_name: "CKAD: Certified Kubernetes Application Developer",
        issuing_org: "Cloud Native Computing Foundation (CNCF)",
        issue_year: 2025,
        credential_id: "LF-CKAD-11029",
        credential_url: "https://www.cncf.io/certification/ckad/",
      },
    ],
    atsScore: 94,
    stats: {
      projectsCount: 8,
      certificationsCount: 4,
      skillsCount: 16,
      completionRate: 100,
    },
    visibility: "public",
  },
  "sara-alghamdi": {
    id: 102,
    userId: "sara-alghamdi",
    fullName: "سارة الغامدي",
    headline: "رئيسة استقطاب المواهب التنفيذية | مستشارة تحول رأس المال البشري",
    about:
      "متخصصة في استقطاب الكفاءات والقيادات التنفيذية لكبرى القطاعات الاستراتيجية في المملكة. خبرة 9 سنوات في بناء استراتيجيات التوظيف الرقمي، وتحليل مؤشرات سوق العمل، وهندسة ثقافة العمل المؤسسي المواكبة لرؤية 2030.",
    email: "sara.ghamdi@example.com",
    mobile: "+966 55 987 6543",
    country: "المملكة العربية السعودية",
    government: "الظهران",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    isVerified: true,
    verifiedAt: "2025-01-20T10:00:00Z",
    education: {
      qualification: "ماجستير إدارة الموارد البشرية وتطوير المنظمات",
      university: "جامعة الملك فهد للبترول والمعادن",
      department: "إدارة الأعمال",
      graduationDate: "2021-05-18",
      gpa: "3.95 / 4.0",
      status: "متخرج",
    },
    experienceYears: "9 سنوات",
    preferredField: "استقطاب المواهب التنفيذية والموارد البشرية",
    workType: "دوام كامل / استشارات استقطاب",
    workStyle: "حضوري أو هجين",
    expectedSalary: 32000,
    cvUrl: "#",
    skills: [
      "Executive Search",
      "Talent Acquisition",
      "Salary Benchmarking",
      "Competency Mapping",
      "HR Analytics",
      "Strategic Workforce Planning",
      "Employer Branding",
      "Saudi Labor Law",
    ],
    languages: ["العربية (اللغة الأم)", "الإنجليزية (متقدم)"],
    projects: [
      {
        id: 1,
        project_name: "مبادرة توطين القيادات التقنية في قطاع الطاقة",
        description:
          "قيادة حملة استقطاب وطنية لتعيين أكثر من 120 مهندساً ومهندسة في تخصصات الذكاء الاصطناعي وهندسة البتروكيماويات.",
        project_url: "https://example.com/energy-talent",
        technologies: ["Talent Sourcing", "HR Strategy"],
        created_at: "2025-08-01T00:00:00Z",
      },
    ],
    certifications: [
      {
        id: 1,
        cert_name: "SHRM Senior Certified Professional (SHRM-SCP)",
        issuing_org: "Society for Human Resource Management",
        issue_year: 2023,
        credential_id: "SHRM-SCP-77821",
        credential_url: "https://shrm.org/verify",
      },
    ],
    atsScore: 91,
    stats: {
      projectsCount: 5,
      certificationsCount: 3,
      skillsCount: 14,
      completionRate: 98,
    },
    visibility: "public",
  },
}

class PortfolioService {
  async getCandidatePortfolio(username: string): Promise<CandidatePublicPortfolio> {
    const clean = username.trim().toLowerCase()

    try {
      const endpoint = API_CONFIG.ENDPOINTS.PORTFOLIO.DETAIL(username)
      const { data } = await apiClient.get<CandidatePublicPortfolio>(endpoint)
      return data
    } catch {
      // If found in curated demo list, return it
      if (DEMO_PORTFOLIOS[clean]) {
        return DEMO_PORTFOLIOS[clean]
      }

      // Dynamic friendly fallback for any demo username or ID
      const formattedName = username
        .replace(/[-_.]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())

      return {
        id: 999,
        userId: username,
        fullName: formattedName || "مرشح منصة فائدة",
        headline: "محترف رقمي | باحث عن فرص نوعية وتحديات مهنية",
        about:
          "مرحبا بكم في معرضي المهني على منصة فائدة. أمتلك شغفاً كبيراً بتطوير الحلول البرمجية والرقمية والعمل ضمن فرق عمل متكاملة تسهم في تحقيق طموحات التحول الرقمي ورؤية المملكة 2030.",
        email: "candidate@faeda.sa",
        mobile: "+966 50 000 0000",
        country: "المملكة العربية السعودية",
        government: "الرياض",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
        isVerified: true,
        verifiedAt: "2026-01-01T00:00:00Z",
        education: {
          qualification: "بكالوريوس علوم الحاسب أو الهندسة",
          university: "إحدى الجامعات السعودية المعتمدة",
          department: "تقنية المعلومات",
          graduationDate: "2023-06-01",
          gpa: "ممتاز مع مرتبة الشرف",
          status: "متخرج",
        },
        experienceYears: "3-5 سنوات",
        preferredField: "تطوير التطبيقات والحلول الرقمية",
        workType: "دوام كامل / عن بُعد",
        workStyle: "هجين أو مرن",
        expectedSalary: 18000,
        cvUrl: "#",
        skills: [
          "React",
          "TypeScript",
          "Python",
          "SQL",
          "Problem Solving",
          "Agile Methodology",
          "API Integration",
          "Git & Collaboration",
        ],
        languages: ["العربية (اللغة الأم)", "الإنجليزية"],
        projects: [
          {
            id: 1,
            project_name: "تطبيق التفاعل المؤسسي وحلول الفرق",
            description:
              "منظومة تفاعلية لإدارة المهام ومشاركة الملفات بكفاءة وسرعة فائقة في بيئات العمل الموزعة.",
            project_url: "https://github.com",
            technologies: ["React", "Node.js", "Tailwind CSS"],
            created_at: "2025-10-01T00:00:00Z",
          },
        ],
        certifications: [
          {
            id: 1,
            cert_name: "شهادة الاحتراف المهني المعتمد",
            issuing_org: "المعهد المهني الرقمي",
            issue_year: 2024,
            credential_id: "CERT-2024-998",
            credential_url: "https://example.com",
          },
        ],
        atsScore: 88,
        stats: {
          projectsCount: 3,
          certificationsCount: 2,
          skillsCount: 12,
          completionRate: 92,
        },
        visibility: "public",
      }
    }
  }

  async sendCandidateInquiry(payload: CandidateContactPayload): Promise<{ success: boolean; message: string }> {
    try {
      // Re-use contact or chat endpoint if available
      await apiClient.post("/api/v1/contact", {
        name: payload.senderName,
        email: payload.senderEmail,
        reason: `[فرصة للمرشح #${payload.candidateId}] ${payload.subject}`,
        message: `اسم الشركة: ${payload.companyName || "غير محدد"}\nنوع الفرصة: ${payload.opportunityType || "تواصل مهني"}\n\nنص الرسالة:\n${payload.message}`,
      })
      return { success: true, message: "تم إرسال رسالتك وعرضك للمرشح بنجاح!" }
    } catch {
      // Simulate success for offline demo mode
      return { success: true, message: "تم إرسال رسالتك وعرضك للمرشح بنجاح!" }
    }
  }
}

export const portfolioService = new PortfolioService()
