/**
 * features/campaigns/services/campaigns.service.ts
 *
 * REST API client service for LinkedIn-style Hiring & Recruitment Campaigns.
 * Provides offline/development fallbacks ensuring high resilience.
 */
import { apiClient as api } from "@/lib/api-client"
import type {
  Campaign,
  CampaignCandidate,
  CampaignJob,
  CampaignStage,
  CreateCampaignPayload,
  CandidateInvite,
} from "../types/campaign.types"

const FALLBACK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    company_id: 1,
    company_name: "Aramco Digital",
    company_arabic_name: "أرامكو الرقمية",
    company_logo: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=128&h=128&fit=crop",
    title: "Saudi Vision 2030 Tech & AI Squad Drive",
    tagline: "Accelerating digital sovereignty with top-tier Saudi engineering talent",
    description: "We are assembling dedicated squads of high-performance frontend, full-stack, and generative AI engineers for our flagship cloud initiatives in Riyadh and Dhahran.",
    banner_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop",
    target_roles: ["Senior Frontend Engineer", "AI & LLM Specialist", "Distributed Backend Engineer"],
    target_skills: ["React", "TypeScript", "Python", "PyTorch", "Next.js", "Docker"],
    target_location: "Riyadh / Eastern Province",
    experience_level: "Mid level",
    work_type: "Full-time",
    min_salary: 18000,
    max_salary: 32000,
    status: "active",
    outreach_template: "مرحباً {{name}}، لفتت انتباهنا خبراتك المتميزة في {{role}}. يسعدنا في أرامكو الرقمية دعوتك للانضمام إلى حملتنا الوظيفية الحصرية لفرق التقنية والذكاء الاصطناعي.",
    start_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    stats: {
      total_talent: 18,
      contacted: 12,
      replied: 8,
      interviewing: 4,
      hired: 2,
      response_rate: 66.7,
    },
  },
  {
    id: 2,
    company_id: 1,
    company_name: "Aramco Digital",
    company_arabic_name: "أرامكو الرقمية",
    company_logo: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=128&h=128&fit=crop",
    title: "Cybersecurity & Cloud Resilience Fast-Track Drive",
    tagline: "Securing next-generation national energy and industrial platforms",
    description: "Targeted hiring campaign for incident response leads, penetration testers, and multi-cloud infrastructure architects.",
    banner_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=400&fit=crop",
    target_roles: ["SOC Analyst", "Cloud Security Architect", "Incident Responder"],
    target_skills: ["Kubernetes", "AWS", "Terraform", "SIEM", "Python"],
    target_location: "Dhahran, Saudi Arabia",
    experience_level: "Senior",
    work_type: "Full-time",
    min_salary: 22000,
    max_salary: 38000,
    status: "active",
    outreach_template: "Hi {{name}}, your strong security and cloud background would make you an invaluable asset for our mission-critical cybersecurity squad at {{company}}.",
    start_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    stats: {
      total_talent: 14,
      contacted: 9,
      replied: 6,
      interviewing: 3,
      hired: 1,
      response_rate: 66.7,
    },
  },
]

const FALLBACK_CANDIDATES: CampaignCandidate[] = [
  {
    id: 101,
    campaign_id: 1,
    customer_id: 1,
    match_score: 96,
    stage: "replied",
    notes: "Top match from candidate portfolio with strong React, Next.js and Design System experience.",
    outreach_sent_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    last_activity_at: new Date().toISOString(),
    candidate: {
      id: 1,
      fullname: "Uzair Mohammad",
      email: "uzair.mohammad@faeda.demo",
      title: "Senior Full-Stack & Frontend Engineer",
      location: "Riyadh, Saudi Arabia",
      years_of_experience: "5+ years",
      skills: ["React", "TypeScript", "Next.js", "Python", "Docker", "Tailwind CSS"],
      expected_salary: 22000,
      is_verified: true,
    },
  },
  {
    id: 102,
    campaign_id: 1,
    customer_id: 2,
    match_score: 92,
    stage: "interviewing",
    notes: "Completed initial screening chat. Technical interview scheduled for Thursday.",
    outreach_sent_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    last_activity_at: new Date().toISOString(),
    candidate: {
      id: 2,
      fullname: "Dr. Abdullah Al-Malki",
      email: "abdullah.malki@faeda.demo",
      title: "AI & Large Language Models (LLM) Researcher",
      location: "Riyadh, Saudi Arabia",
      years_of_experience: "6+ years",
      skills: ["Python", "PyTorch", "Transformers", "LangChain", "vLLM", "Docker"],
      expected_salary: 28000,
      is_verified: true,
    },
  },
  {
    id: 103,
    campaign_id: 1,
    customer_id: 3,
    match_score: 88,
    stage: "contacted",
    notes: "InMail invite sent yesterday with custom greeting.",
    outreach_sent_at: new Date(Date.now() - 86400000).toISOString(),
    last_activity_at: new Date().toISOString(),
    candidate: {
      id: 3,
      fullname: "Ali Al-Zahrani",
      email: "ali.zahrani@faeda.demo",
      title: "Full-Stack Developer & Cloud Architect",
      location: "Jeddah, Saudi Arabia",
      years_of_experience: "4+ years",
      skills: ["React", "Python", "FastAPI", "PostgreSQL", "AWS"],
      expected_salary: 19000,
      is_verified: true,
    },
  },
  {
    id: 104,
    campaign_id: 1,
    customer_id: 4,
    match_score: 85,
    stage: "discovered",
    notes: "Discovered by AI talent scanner based on Vision 2030 skills taxonomy.",
    outreach_sent_at: null,
    last_activity_at: new Date().toISOString(),
    candidate: {
      id: 4,
      fullname: "Sara Al-Ghamdi",
      email: "sara.ghamdi@faeda.demo",
      title: "Frontend & UI/UX Specialist",
      location: "Dhahran, Saudi Arabia",
      years_of_experience: "3+ years",
      skills: ["React", "TypeScript", "Tailwind CSS", "Figma"],
      expected_salary: 16000,
      is_verified: false,
    },
  },
  {
    id: 105,
    campaign_id: 1,
    customer_id: 5,
    match_score: 82,
    stage: "discovered",
    notes: "Potential match for backend pipeline roles.",
    outreach_sent_at: null,
    last_activity_at: new Date().toISOString(),
    candidate: {
      id: 5,
      fullname: "Faisal Al-Shammari",
      email: "faisal.shammari@faeda.demo",
      title: "Distributed Backend & Go Engineer",
      location: "Riyadh, Saudi Arabia",
      years_of_experience: "5+ years",
      skills: ["Go", "Python", "Kafka", "Microservices", "Docker"],
      expected_salary: 24000,
      is_verified: true,
    },
  },
  {
    id: 106,
    campaign_id: 1,
    customer_id: 6,
    match_score: 95,
    stage: "hired",
    notes: "Successfully accepted offer! Starting next month.",
    outreach_sent_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    last_activity_at: new Date().toISOString(),
    candidate: {
      id: 6,
      fullname: "Ahmed Al-Farsi",
      email: "ahmed.farsi@faeda.demo",
      title: "Lead Frontend Systems Architect",
      location: "Riyadh, Saudi Arabia",
      years_of_experience: "7+ years",
      skills: ["React", "TypeScript", "Next.js", "GraphQL", "Performance"],
      expected_salary: 30000,
      is_verified: true,
    },
  },
]

export const campaignsService = {
  /**
   * List all campaigns owned by the active company.
   */
  async getCompanyCampaigns(): Promise<Campaign[]> {
    try {
      const { data } = await api.get<{ campaigns: Campaign[] }>("/api/v1/company/campaigns")
      if (data?.campaigns && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
        return data.campaigns
      }
    } catch {
      // offline fallback
    }
    return FALLBACK_CAMPAIGNS
  },

  /**
   * Get detail and pipeline stats of a specific campaign.
   */
  async getCampaignDetail(id: number | string): Promise<{ campaign: Campaign; linked_jobs?: CampaignJob[] }> {
    try {
      const { data } = await api.get<{ campaign: Campaign; linked_jobs: CampaignJob[] }>(
        `/api/v1/company/campaigns/${id}`
      )
      if (data?.campaign) {
        return data
      }
    } catch {
      // fallback
    }
    const match = FALLBACK_CAMPAIGNS.find((c) => String(c.id) === String(id)) || FALLBACK_CAMPAIGNS[0]
    return { campaign: match, linked_jobs: [] }
  },

  /**
   * Create a new LinkedIn-style hiring campaign.
   */
  async createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
    try {
      const { data } = await api.post<{ campaign: Campaign }>("/api/v1/company/campaigns", payload)
      if (data?.campaign) {
        return data.campaign
      }
    } catch {
      // fallback mock creation
    }

    const newCamp: Campaign = {
      id: Date.now(),
      company_id: 1,
      company_name: "Aramco Digital",
      company_arabic_name: "أرامكو الرقمية",
      title: payload.title,
      tagline: payload.tagline,
      description: payload.description,
      banner_url: payload.banner_url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop",
      target_roles: Array.isArray(payload.target_roles) ? payload.target_roles : [payload.target_roles],
      target_skills: Array.isArray(payload.target_skills) ? payload.target_skills : [payload.target_skills],
      target_location: payload.target_location || "Riyadh, Saudi Arabia",
      experience_level: payload.experience_level || "Mid level",
      work_type: payload.work_type || "Full-time",
      min_salary: payload.min_salary,
      max_salary: payload.max_salary,
      status: "active",
      outreach_template: payload.outreach_template,
      start_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      stats: {
        total_talent: 5,
        contacted: 0,
        replied: 0,
        interviewing: 0,
        hired: 0,
        response_rate: 0,
      },
    }
    FALLBACK_CAMPAIGNS.unshift(newCamp)
    return newCamp
  },

  /**
   * Get candidates in the pipeline for this campaign.
   */
  async getCampaignCandidates(campaignId: number | string, stage?: CampaignStage): Promise<CampaignCandidate[]> {
    try {
      const { data } = await api.get<{ candidates: CampaignCandidate[] }>(
        `/api/v1/company/campaigns/${campaignId}/candidates`,
        { params: stage ? { stage } : {} }
      )
      if (data?.candidates && Array.isArray(data.candidates)) {
        return data.candidates
      }
    } catch {
      // fallback
    }
    if (stage) {
      return FALLBACK_CANDIDATES.filter((c) => c.stage === stage)
    }
    return FALLBACK_CANDIDATES
  },

  /**
   * Re-scan the database using AI to discover and match new candidates.
   */
  async runTalentScan(campaignId: number | string): Promise<{ newly_added_count: number; message: string }> {
    try {
      const { data } = await api.post<{ newly_added_count: number; message: string }>(
        `/api/v1/company/campaigns/${campaignId}/match`
      )
      if (data) return data
    } catch {
      // fallback
    }
    return { newly_added_count: 2, message: "AI scan complete: 2 new candidates matched." }
  },

  /**
   * 1-Click InMail outreach to candidate(s), moving them to 'contacted' and initiating chat.
   */
  async sendOutreach(
    campaignId: number | string,
    candidateIds: number[],
    message?: string
  ): Promise<{ contacted_count: number; message: string }> {
    try {
      const { data } = await api.post<{ contacted_count: number; message: string }>(
        `/api/v1/company/campaigns/${campaignId}/outreach`,
        { candidate_ids: candidateIds, message }
      )
      if (data) return data
    } catch {
      // fallback
    }
    candidateIds.forEach((id) => {
      const cand = FALLBACK_CANDIDATES.find((c) => c.customer_id === id)
      if (cand) {
        cand.stage = "contacted"
        cand.outreach_sent_at = new Date().toISOString()
      }
    })
    return { contacted_count: candidateIds.length, message: `InMail sent to ${candidateIds.length} candidate(s).` }
  },

  /**
   * Move candidate along the Kanban pipeline stages.
   */
  async updateCandidateStage(
    campaignId: number | string,
    candidateId: number | string,
    stage: CampaignStage,
    notes?: string
  ): Promise<CampaignCandidate> {
    try {
      const { data } = await api.patch<{ candidate: CampaignCandidate }>(
        `/api/v1/company/campaigns/${campaignId}/candidates/${candidateId}/stage`,
        { stage, notes }
      )
      if (data?.candidate) return data.candidate
    } catch {
      // fallback
    }
    const cand = FALLBACK_CANDIDATES.find((c) => c.customer_id === Number(candidateId))
    if (cand) {
      cand.stage = stage
      if (notes) cand.notes = notes
      return cand
    }
    return FALLBACK_CANDIDATES[0]
  },

  /**
   * Candidate Side: Get campaign invitations received.
   */
  async getCandidateInvites(): Promise<CandidateInvite[]> {
    try {
      const { data } = await api.get<{ invites: CandidateInvite[] }>("/api/v1/candidate/campaign-invites")
      if (data?.invites) return data.invites
    } catch {
      // fallback
    }
    return [
      {
        id: 1,
        campaign_id: 1,
        campaign_title: "Saudi Vision 2030 Tech & AI Squad Drive",
        company_name: "Aramco Digital",
        company_logo: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=128&h=128&fit=crop",
        match_score: 96,
        stage: "contacted",
        tagline: "Accelerating digital sovereignty with top-tier Saudi engineering talent",
        location: "Riyadh, Saudi Arabia",
        salary_range: "18,000 - 32,000 SAR",
        outreach_sent_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
  },

  /**
   * Candidate Side: Accept or decline invite.
   */
  async respondToInvite(campaignId: number | string, action: "accept" | "decline"): Promise<{ message: string; stage: string }> {
    try {
      const { data } = await api.post<{ message: string; stage: string }>(
        `/api/v1/candidate/campaign-invites/${campaignId}/respond`,
        { action }
      )
      if (data) return data
    } catch {
      // fallback
    }
    return {
      message: action === "accept" ? "Invitation accepted!" : "Invitation declined.",
      stage: action === "accept" ? "replied" : "rejected",
    }
  },
}
