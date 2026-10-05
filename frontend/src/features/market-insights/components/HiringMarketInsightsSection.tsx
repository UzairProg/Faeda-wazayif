/**
 * features/market-insights/components/HiringMarketInsightsSection.tsx
 *
 * Company: Hiring Market Insights & Talent Requirements section.
 * Automatically ingests company's job requirements / openings.
 * Displays:
 *  1. Role-by-role Market Hiring Benchmarks:
 *     - Role, Skills, Experience, Location, Openings
 *     - Estimated Market Salary Range & Average Salary
 *     - Talent Availability & Skill Demand
 *     - Hiring Competition
 *     - Estimated Annual Hiring Cost (with 1.15x onboarding factor)
 *     - Source & Last Updated
 *  2. Company Talent Requirements:
 *     - Most requested skills with clickable candidate count
 *     - Hard-to-find skills with talent acquisition strategies
 *     - Candidate experience distribution
 *     - Location-wise talent availability
 *  3. Interactive Matching Candidates Modal triggered on skill click
 *  4. Action buttons: View Matching Candidates, Create Job, Compare Salary, View Talent Pool
 */

import React, { useState, useEffect } from "react"
import {
  Briefcase,
  Users,
  MapPin,
  Clock,
  PlusCircle,
  BarChart3,
  Sparkles,
  Database,
  Calendar,
  ChevronRight,
  ShieldAlert,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Link } from "react-router-dom"
import type {
  CompanyHiringInsightResponse,
  MatchingCandidate,
} from "../types/market-insights.types"
import { marketInsightsService } from "../services/market-insights.service"
import { MatchingCandidatesModal } from "./MatchingCandidatesModal"

interface HiringMarketInsightsSectionProps {
  companyId?: string | number
}

export const HiringMarketInsightsSection: React.FC<HiringMarketInsightsSectionProps> = ({ companyId }) => {
  const [data, setData] = useState<CompanyHiringInsightResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currencyMode, setCurrencyMode] = useState<"SAR" | "LPA">("LPA")
  const [selectedSkill, setSelectedSkill] = useState<string>("React")
  const [matchingCandidates, setMatchingCandidates] = useState<MatchingCandidate[]>([])
  const [isCandidatesModalOpen, setIsCandidatesModalOpen] = useState(false)
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false)

  useEffect(() => {
    loadCompanyInsights()
  }, [companyId])

  const loadCompanyInsights = async () => {
    setIsLoading(true)
    try {
      const res = await marketInsightsService.getCompanyHiringInsights(companyId)
      setData(res)
    } catch (err) {
      console.warn("Using fallback company hiring insights:", err)
      setData({
        hiring_roles: [
          {
            job_id: 1,
            job_role: "React Developer",
            specialization: "Frontend Engineering",
            required_skills: ["React", "JavaScript", "TypeScript"],
            experience_required: "2–4 Years",
            location: "Riyadh",
            openings: 10,
            salary_min: 11000,
            salary_max: 18500,
            average_salary: 14500,
            currency: "SAR",
            talent_availability: "High",
            skill_demand: "High",
            hiring_competition: "Medium",
            estimated_annual_hiring_cost: 2001000,
            formatted_salary_sar: "11,000 – 18,500 SAR",
            formatted_salary_lpa: "₹6 LPA – ₹10 LPA",
            data_source: "Market Salary Dataset",
            last_updated: "02 Oct 2026",
            is_demo: true,
          },
          {
            job_id: 2,
            job_role: "Cloud Solutions Architect",
            specialization: "Cloud & DevOps",
            required_skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
            experience_required: "3–6 Years",
            location: "Eastern Province",
            openings: 3,
            salary_min: 20000,
            salary_max: 35000,
            average_salary: 27000,
            currency: "SAR",
            talent_availability: "Scarce",
            skill_demand: "Critical",
            hiring_competition: "High",
            estimated_annual_hiring_cost: 1117800,
            formatted_salary_sar: "20,000 – 35,000 SAR",
            formatted_salary_lpa: "₹10.8 – ₹18.9 LPA",
            data_source: "Vision 2030 Cloud Benchmark",
            last_updated: "02 Oct 2026",
            is_demo: true,
          },
          {
            job_id: 3,
            job_role: "AI & Machine Learning Engineer",
            specialization: "Data Science",
            required_skills: ["Python", "PyTorch", "LLMs", "RAG"],
            experience_required: "2–5 Years",
            location: "Riyadh",
            openings: 4,
            salary_min: 18000,
            salary_max: 30000,
            average_salary: 24000,
            currency: "SAR",
            talent_availability: "Scarce",
            skill_demand: "Critical",
            hiring_competition: "High",
            estimated_annual_hiring_cost: 1324800,
            formatted_salary_sar: "18,000 – 30,000 SAR",
            formatted_salary_lpa: "₹9.7 – ₹16.2 LPA",
            data_source: "SDAIA Regional AI Index",
            last_updated: "02 Oct 2026",
            is_demo: true,
          },
        ],
        talent_requirements: {
          most_requested_skills: [
            { skill: "React", count: 1250, demand: "High", availability: "High" },
            { skill: "Node.js", count: 980, demand: "High", availability: "Moderate" },
            { skill: "Cybersecurity", count: 320, demand: "Critical", availability: "Very Scarce" },
            { skill: "TypeScript", count: 890, demand: "High", availability: "Moderate" },
            { skill: "Python & AI", count: 1420, demand: "Critical", availability: "Moderate" },
          ],
          hard_to_find_skills: [
            { skill: "Cybersecurity & NCA Audit", count: 320, scarcity: "Very High", rec_action: "Partner with accredited university talent centers" },
            { skill: "Kubernetes & Cloud FinOps", count: 410, scarcity: "High", rec_action: "Offer competitive signing packages and remote flexibility" },
            { skill: "Deep Learning & Generative Models", count: 280, scarcity: "Very High", rec_action: "Academic research internships and thesis campaigns" },
          ],
          candidate_experience_distribution: [
            { tier: "Junior (0–2 Yrs)", percentage: 42, candidate_count: 1764 },
            { tier: "Mid-level (3–5 Yrs)", percentage: 36, candidate_count: 1512 },
            { tier: "Senior (6–8 Yrs)", percentage: 15, candidate_count: 630 },
            { tier: "Lead & Architect (9+ Yrs)", percentage: 7, candidate_count: 294 },
          ],
          location_wise_talent: [
            { location: "Riyadh Capital", candidate_count: 2016, percentage: 48 },
            { location: "Eastern Province (Dhahran/Khobar)", candidate_count: 1176, percentage: 28 },
            { location: "Jeddah & Western Province", candidate_count: 756, percentage: 18 },
            { location: "Other / Remote", candidate_count: 252, percentage: 6 },
          ],
        },
        total_openings: 17,
        data_source: "Market Salary Dataset",
        data_date: "2026-10-02",
        last_updated: "02 Oct 2026",
        is_demo: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenSkillCandidates = async (skillName: string) => {
    setSelectedSkill(skillName)
    setIsCandidatesModalOpen(true)
    setIsLoadingCandidates(true)
    try {
      const res = await marketInsightsService.getCandidatesBySkill(skillName)
      setMatchingCandidates(res.candidates)
    } catch (err) {
      console.warn("Failed fetching candidates for skill:", err)
      setMatchingCandidates([
        {
          id: 101,
          fullname: "عمر بن خالد المنصور",
          user_id: "cand_omar",
          job_role: `${skillName} Specialist`,
          specialization: "هندسة البرمجيات",
          experience_years: "3",
          location: "الظهران",
          is_verified: true,
          educational_qualification: "بكالوريوس",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        },
        {
          id: 102,
          fullname: "سارة بنت منصور العتيبي",
          user_id: "cand_sara",
          job_role: `Lead ${skillName} Engineer`,
          specialization: "علوم الحاسب والذكاء الاصطناعي",
          experience_years: "4",
          location: "الرياض",
          is_verified: true,
          educational_qualification: "ماجستير",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        },
      ])
    } finally {
      setIsLoadingCandidates(false)
    }
  }

  if (isLoading) {
    return (
      <GlassCard className="p-8 text-center animate-pulse border-white/10">
        <div className="w-12 h-12 rounded-full bg-cyan-500/20 mx-auto mb-4 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
        <p className="text-white/70 text-sm">Aggregating Hiring Market Benchmarks & Talent Metrics...</p>
      </GlassCard>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* ── Main Header Card: Hiring Market Insights ────────────────── */}
      <GlassCard className="p-6 border border-white/10 bg-gradient-to-br from-[#0A1B3A] via-[#0C234C] to-[#0A1B3A] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Hiring Market Insights</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Employer Intelligence
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Market benchmarks, talent availability, and projected hiring costs calibrated to your active open roles.
            </p>
          </div>

          {/* Action buttons & currency toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setCurrencyMode("LPA")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  currencyMode === "LPA"
                    ? "bg-cyan-500 text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                ₹ LPA
              </button>
              <button
                type="button"
                onClick={() => setCurrencyMode("SAR")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  currencyMode === "SAR"
                    ? "bg-cyan-500 text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                SAR (Monthly)
              </button>
            </div>

            <Link
              to="/company/jobs"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create Job
            </Link>

            <Link
              to="/company/talent"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              View Talent Pool
            </Link>

            <Link
              to="/market-trends"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              Compare Salary
            </Link>
          </div>
        </div>

        {/* Roles Market Benchmark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {data.hiring_roles.map((role, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-white">{role.job_role}</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
                    {role.openings} Openings
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1.5 text-xs text-white/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-white/40" />
                    {role.experience_required}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {role.location}
                  </span>
                </div>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {role.required_skills.map((s, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleOpenSkillCandidates(s)}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 border border-white/10 text-white/80 hover:text-cyan-300 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Benchmark Salary */}
                <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[11px] text-white/50 block">Market Salary Benchmark</span>
                  <div className="text-sm font-black text-white mt-0.5">
                    {currencyMode === "LPA" ? role.formatted_salary_lpa : role.formatted_salary_sar}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">
                    Average:{" "}
                    {currencyMode === "LPA"
                      ? `₹${roundNumber(role.average_salary * 12 * 0.045, 1)} LPA`
                      : `${role.average_salary.toLocaleString()} SAR/mo`}
                  </div>
                </div>

                {/* Indicators: Availability, Demand, Competition */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="p-2 rounded bg-white/[0.02]">
                    <span className="text-[10px] text-white/40 block">Talent Pool</span>
                    <span className="text-xs font-semibold text-emerald-400">{role.talent_availability}</span>
                  </div>
                  <div className="p-2 rounded bg-white/[0.02]">
                    <span className="text-[10px] text-white/40 block">Demand</span>
                    <span className="text-xs font-semibold text-cyan-400">{role.skill_demand}</span>
                  </div>
                  <div className="p-2 rounded bg-white/[0.02]">
                    <span className="text-[10px] text-white/40 block">Competition</span>
                    <span className="text-xs font-semibold text-amber-400">{role.hiring_competition}</span>
                  </div>
                </div>
              </div>

              {/* Estimated Hiring Cost & Actions */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Est. Annual Hiring Cost:</span>
                  <span className="font-bold text-emerald-400">
                    {currencyMode === "LPA"
                      ? `₹${roundNumber(role.estimated_annual_hiring_cost * 0.045, 1)} Lakhs`
                      : `${role.estimated_annual_hiring_cost.toLocaleString()} SAR`}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenSkillCandidates(role.required_skills[0] || role.job_role)}
                    className="flex-1 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium border border-cyan-500/30 transition-colors flex items-center justify-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    View Matching Candidates
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Source metadata banner */}
        <div className="mt-5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              Source: <strong className="text-white/80">{data.data_source}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Last Updated: <strong className="text-white/80">{data.last_updated}</strong>
            </span>
          </div>
          {data.is_demo && (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold text-[10px]">
              Demo Benchmark Data
            </span>
          )}
        </div>
      </GlassCard>

      {/* ── Section 4: Company Talent Requirements ──────────────────── */}
      <GlassCard className="p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Company Talent Requirements & Sourcing Engine
            </h3>
            <p className="text-xs text-white/60 mt-0.5">
              Click any skill to instantly view candidates from the verified regional talent pipeline.
            </p>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-800/30">
            Interactive Talent Mapping
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Requested Skills (Clickable for candidate modal) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Most Requested Skills in Openings
            </h4>
            <div className="space-y-2">
              {data.talent_requirements.most_requested_skills.map((skillItem, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOpenSkillCandidates(skillItem.skill)}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-cyan-500/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {skillItem.skill}
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Demand: {skillItem.demand} • Availability: {skillItem.availability}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <span className="text-xs font-bold text-cyan-400 block">
                        {skillItem.count.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-white/40">matching candidates</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hard-to-find Skills */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5 text-rose-300">
              <ShieldAlert className="w-3.5 h-3.5" /> Hard-to-Find & Critical Skills
            </h4>
            <div className="space-y-2.5">
              {data.talent_requirements.hard_to_find_skills.map((hard, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-rose-950/15 border border-rose-500/20 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{hard.skill}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Scarcity: {hard.scarcity} ({hard.count} Candidates)
                    </span>
                  </div>
                  <div className="mt-2 text-white/70 text-[11px] flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Recommended Action:</strong> {hard.rec_action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Talent Distribution: Experience & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/10">
          {/* Experience Distribution */}
          <div>
            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">
              Candidate Experience Distribution
            </h4>
            <div className="space-y-2">
              {data.talent_requirements.candidate_experience_distribution.map((tier, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/80">{tier.tier}</span>
                    <span className="font-bold text-cyan-400">
                      {tier.percentage}% ({tier.candidate_count.toLocaleString()} candidates)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: `${tier.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location-wise Talent */}
          <div>
            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">
              Location-Wise Talent Availability
            </h4>
            <div className="space-y-2">
              {data.talent_requirements.location_wise_talent.map((loc, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/80">{loc.location}</span>
                    <span className="font-bold text-emerald-400">
                      {loc.percentage}% ({loc.candidate_count.toLocaleString()})
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${loc.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Matching Candidates Modal */}
      <MatchingCandidatesModal
        skill={selectedSkill}
        candidates={matchingCandidates}
        isOpen={isCandidatesModalOpen}
        onClose={() => setIsCandidatesModalOpen(false)}
        isLoading={isLoadingCandidates}
      />
    </div>
  )
}

function roundNumber(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}
