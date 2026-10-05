/**
 * features/market-insights/components/TalentMarketInsightsSection.tsx
 *
 * Job Seeker: Talent & Market Insights section.
 * Automatically ingests candidate profile attributes:
 * role, specialization, skills, experience, location, education.
 * Displays:
 *  - Estimated Market Salary Range (with SAR / ₹ LPA toggle)
 *  - Average Salary
 *  - Skill Demand & Industry Demand
 *  - Profile Match & Profile Strength
 *  - Matching Job Roles
 *  - Salary by Experience & Location
 *  - Interactive Skill-Based Market Analysis (Click-to-view related roles and benchmarks)
 *  - Recommended Skills
 *  - Mandatory Data Freshness & Source labels (Strictly avoiding "worth")
 */

import React, { useState, useEffect } from "react"
import {
  TrendingUp,
  Briefcase,
  Target,
  Sparkles,
  MapPin,
  Clock,
  Award,
  ChevronRight,
  Database,
  Calendar,
  Layers,
  ArrowUpRight,
  BarChart3,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Link } from "react-router-dom"
import type { CandidateMarketInsight, SkillInsight } from "../types/market-insights.types"
import { marketInsightsService } from "../services/market-insights.service"
import { SkillDetailModal } from "./SkillDetailModal"

interface TalentMarketInsightsSectionProps {
  initialData?: CandidateMarketInsight
  candidateProfile?: any
}

export const TalentMarketInsightsSection: React.FC<TalentMarketInsightsSectionProps> = ({
  initialData,
  candidateProfile,
}) => {
  const [insights, setInsights] = useState<CandidateMarketInsight | null>(initialData || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [currencyMode, setCurrencyMode] = useState<"SAR" | "LPA">("LPA")
  const [selectedSkill, setSelectedSkill] = useState<SkillInsight | null>(null)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)

  useEffect(() => {
    if (!initialData) {
      loadInsights()
    }
  }, [initialData])

  const loadInsights = async () => {
    setIsLoading(true)
    try {
      const data = await marketInsightsService.getMyCandidateInsights()
      setInsights(data)
    } catch (err) {
      console.warn("Using fallback candidate market insights:", err)
      // Standard robust fallback
      setInsights({
        candidate_name: candidateProfile?.fullname || "Candidate",
        job_role: candidateProfile?.preferred_field_of_work || "Full Stack Developer",
        specialization: candidateProfile?.department_university || "Software Engineering",
        experience_years: 2,
        preferred_location: candidateProfile?.government || "Riyadh",
        education: candidateProfile?.educational_qualification || "Bachelor's Degree",
        skills: ["React", "Node.js", "TypeScript", "Python"],
        estimated_salary_min: 12500,
        estimated_salary_max: 20800,
        average_salary: 16650,
        currency: "SAR",
        formatted_salary_sar: "12,500 – 20,800 SAR / Month",
        formatted_salary_lpa: "₹6 LPA – ₹10 LPA",
        matching_roles: ["Full Stack Developer", "React Developer", "Node.js Developer", "Frontend Engineer"],
        skill_match_percentage: 82,
        skill_demand: "High",
        industry_demand: "Critical Growth",
        market_position: "Competitive (Top 25%)",
        profile_strength: 84,
        skills_analysis: [
          {
            skill: "React",
            demand_level: "High",
            demand_score: 92,
            salary_benchmark: "14,000 – 18,500 SAR",
            salary_benchmark_lpa: "₹7.5 – ₹10.0 LPA",
            market_trend: "High & Rising",
            growth_percentage: 24,
            related_job_roles: ["Frontend Engineer", "Full Stack Developer", "UI Engineer"],
          },
          {
            skill: "Node.js",
            demand_level: "High",
            demand_score: 88,
            salary_benchmark: "13,500 – 19,000 SAR",
            salary_benchmark_lpa: "₹7.2 – ₹10.2 LPA",
            market_trend: "Surging",
            growth_percentage: 22,
            related_job_roles: ["Backend Developer", "API Engineer", "Full Stack Developer"],
          },
          {
            skill: "TypeScript",
            demand_level: "High",
            demand_score: 90,
            salary_benchmark: "14,500 – 21,000 SAR",
            salary_benchmark_lpa: "₹7.8 – ₹11.3 LPA",
            market_trend: "Surging",
            growth_percentage: 31,
            related_job_roles: ["Senior Frontend Engineer", "Full Stack Specialist"],
          },
          {
            skill: "MongoDB",
            demand_level: "Medium",
            demand_score: 72,
            salary_benchmark: "11,000 – 16,000 SAR",
            salary_benchmark_lpa: "₹5.9 – ₹8.6 LPA",
            market_trend: "Steady",
            growth_percentage: 12,
            related_job_roles: ["Database Specialist", "Backend Developer"],
          },
        ],
        salary_by_experience: [
          { experience_tier: "Entry Level (0–1 Yrs)", salary_range_sar: "8,500 – 12,000 SAR", salary_range_lpa: "₹4.5 – ₹6.4 LPA", avg_salary_sar: 10250 },
          { experience_tier: "Associate (1–3 Yrs)", salary_range_sar: "12,000 – 16,500 SAR", salary_range_lpa: "₹6.4 – ₹8.9 LPA", avg_salary_sar: 14250 },
          { experience_tier: "Mid-Senior (4–6 Yrs)", salary_range_sar: "17,000 – 24,000 SAR", salary_range_lpa: "₹9.1 – ₹12.9 LPA", avg_salary_sar: 20500 },
          { experience_tier: "Senior / Lead (7+ Yrs)", salary_range_sar: "25,000 – 38,000 SAR", salary_range_lpa: "₹13.5 – ₹20.5 LPA", avg_salary_sar: 31500 },
        ],
        salary_by_location: [
          { location: "Riyadh Capital", salary_range_sar: "14,000 – 22,000 SAR", salary_range_lpa: "₹7.5 – ₹11.8 LPA", avg_salary_sar: 18000 },
          { location: "Eastern Province (Dhahran / Khobar)", salary_range_sar: "13,000 – 20,500 SAR", salary_range_lpa: "₹7.0 – ₹11.0 LPA", avg_salary_sar: 16750 },
          { location: "Jeddah & Western Province", salary_range_sar: "12,000 – 18,500 SAR", salary_range_lpa: "₹6.4 – ₹9.9 LPA", avg_salary_sar: 15250 },
          { location: "Remote / Digital Hubs", salary_range_sar: "11,500 – 17,500 SAR", salary_range_lpa: "₹6.2 – ₹9.4 LPA", avg_salary_sar: 14500 },
        ],
        recommended_skills: ["AWS Cloud Architect", "Docker & Kubernetes", "GraphQL", "System Design"],
        market_trends_summary: {
          salary_growth_yoy: "+14.8%",
          hiring_velocity: "Very Active (18 Days Avg. Time to Offer)",
          top_industry: "Fintech, Cloud & Digital Government",
          market_outlook: "Exceptional Demand in Vision 2030 Initiatives",
        },
        data_source: "Market Salary Dataset",
        data_date: "2026-10-02",
        last_updated: "02 Oct 2026",
        is_demo: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkillClick = (skill: SkillInsight) => {
    setSelectedSkill(skill)
    setIsSkillModalOpen(true)
  }

  if (isLoading) {
    return (
      <GlassCard className="p-8 text-center animate-pulse border-white/10">
        <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-primary animate-spin" />
        </div>
        <p className="text-white/70 text-sm">Aggregating Talent & Market Insights from verified benchmarks...</p>
      </GlassCard>
    )
  }

  if (!insights) return null

  return (
    <div className="space-y-6">
      {/* ── Main Header Card: Talent & Market Insights ──────────────── */}
      <GlassCard className="p-6 relative overflow-hidden border border-white/10 bg-gradient-to-br from-[#0B1528] via-[#0F1E36] to-[#0B1528]">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Talent & Market Insights</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Profile Calibrated
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Objective market salary benchmarking and skill demand based on current profile metrics.
            </p>
          </div>

          {/* Controls: Currency switcher & Trends Link */}
          <div className="flex items-center gap-3">
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
              to="/market-trends"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              Market Trends
            </Link>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* 1. Estimated Market Salary */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
            <span className="text-xs font-medium text-white/50 block">Estimated Market Salary</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {currencyMode === "LPA" ? insights.formatted_salary_lpa : insights.formatted_salary_sar}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Benchmark Range</span>
            </div>
          </div>

          {/* 2. Average Salary */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
            <span className="text-xs font-medium text-white/50 block">Average Salary</span>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">
              {currencyMode === "LPA"
                ? `₹${roundNumber(insights.average_salary * 12 * 0.045, 1)} LPA`
                : `${insights.average_salary.toLocaleString()} SAR`}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-white/60">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              <span>For {insights.job_role}</span>
            </div>
          </div>

          {/* 3. Skill Demand */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
            <span className="text-xs font-medium text-white/50 block">Skill Demand</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{insights.skill_demand}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Top Tier
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-white/60">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Industry: {insights.industry_demand}</span>
            </div>
          </div>

          {/* 4. Profile Match & Experience */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">Profile Match</span>
              <span className="text-xs font-bold text-cyan-400">{insights.skill_match_percentage}%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${insights.skill_match_percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2.5 text-[11px] text-white/60">
              <span>Experience: {insights.experience_years} Years</span>
              <span className="text-emerald-400 font-medium">{insights.market_position}</span>
            </div>
          </div>
        </div>

        {/* Matching Roles & Metadata Strip */}
        <div className="mt-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-white/70 flex items-center gap-1 mr-1">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> Matching Roles:
            </span>
            {insights.matching_roles.map((role, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/90"
              >
                {role}
              </span>
            ))}
          </div>

          {/* Data Source & Freshness Metadata Badge */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/50 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-4">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Source: <strong className="text-white/80">{insights.data_source}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Last Updated: <strong className="text-white/80">{insights.last_updated}</strong></span>
            </div>
            {insights.is_demo && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold text-[10px]">
                Demo Data
              </span>
            )}
          </div>
        </div>
      </GlassCard>

      {/* ── 2. Skill-Based Market Analysis ─────────────────────────── */}
      <GlassCard className="p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              Skill-Based Market Analysis
            </h3>
            <p className="text-xs text-white/60 mt-0.5">
              Click any skill to view related roles, detailed salary benchmarks, and hiring trends.
            </p>
          </div>
          <span className="text-xs text-cyan-400/80 bg-cyan-950/40 px-3 py-1 rounded-lg border border-cyan-800/30">
            Interactive Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {insights.skills_analysis.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSkillClick(item)}
              className="text-left p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-cyan-500/40 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                  {item.skill}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.demand_level === "Critical"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : item.demand_level === "High"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {item.demand_level} Demand
                </span>
              </div>

              <div className="mt-3">
                <span className="text-[11px] text-white/50 block">Salary Benchmark</span>
                <div className="text-xs font-semibold text-white/90 mt-0.5">
                  {currencyMode === "LPA" && item.salary_benchmark_lpa
                    ? item.salary_benchmark_lpa
                    : item.salary_benchmark}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-white/50">Market Trend:</span>
                <span className="text-cyan-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {item.market_trend}
                </span>
              </div>

              <div className="mt-2 text-[10px] text-white/40 flex items-center justify-between">
                <span>{item.related_job_roles.length} Related Roles</span>
                <span className="text-cyan-400/80 group-hover:translate-x-0.5 transition-transform flex items-center">
                  View <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* ── 3. Salary Breakdowns: Experience & Location ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Experience-based Salary */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Salary Range by Experience</h3>
          </div>
          <div className="space-y-3">
            {insights.salary_by_experience.map((exp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-white/90 block">{exp.experience_tier}</span>
                  <span className="text-[11px] text-white/50">Industry Benchmark Tier</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-cyan-400 block">
                    {currencyMode === "LPA" ? exp.salary_range_lpa : exp.salary_range_sar}
                  </span>
                  <span className="text-[10px] text-white/40">
                    Avg ~ {currencyMode === "LPA" ? `₹${roundNumber(exp.avg_salary_sar * 12 * 0.045, 1)} LPA` : `${exp.avg_salary_sar.toLocaleString()} SAR`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Location-based Salary */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">Salary Range by Location</h3>
          </div>
          <div className="space-y-3">
            {insights.salary_by_location.map((loc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-white/90 block">{loc.location}</span>
                  <span className="text-[11px] text-white/50">Regional Hub Standard</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">
                    {currencyMode === "LPA" ? loc.salary_range_lpa : loc.salary_range_sar}
                  </span>
                  <span className="text-[10px] text-white/40">
                    Avg ~ {currencyMode === "LPA" ? `₹${roundNumber(loc.avg_salary_sar * 12 * 0.045, 1)} LPA` : `${loc.avg_salary_sar.toLocaleString()} SAR`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── 4. Recommended Skills & Strategic Positioning ───────────── */}
      <GlassCard className="p-5 border border-white/10 bg-gradient-to-r from-cyan-950/20 via-slate-900/50 to-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Recommended High-ROI Skills
          </span>
          <p className="text-xs text-white/60 mt-0.5">
            Acquiring these skills moves your market benchmark toward the top 10th percentile:
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {insights.recommended_skills.map((rec, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-300"
              >
                + {rec}
              </span>
            ))}
          </div>
        </div>

        <Link
          to="/candidate/market-value"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-white text-xs font-bold shadow-lg hover:shadow-cyan-500/25 transition-all shrink-0"
        >
          Open Salary Benchmark Simulator
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </GlassCard>

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
      />
    </div>
  )
}

function roundNumber(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}
