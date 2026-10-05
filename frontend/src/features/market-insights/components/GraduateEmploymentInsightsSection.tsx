/**
 * features/market-insights/components/GraduateEmploymentInsightsSection.tsx
 *
 * University: Graduate Employment Insights section.
 * Shows aggregated, anonymized outcomes for academic leadership and career centers:
 *  - Graduate employment rate (+ vs Vision 2030 benchmark)
 *  - Common job roles with employment rates & average starting salary ranges
 *  - Aggregated salary distribution brackets
 *  - Top hiring industries & companies
 *  - Most demanded skills by employers
 *  - Internship-to-job conversion & placement trends
 *  - Location-wise employment distribution
 *  - Strict privacy compliance badge (Zero individual student salary exposure).
 */

import React, { useState, useEffect } from "react"
import {
  GraduationCap,
  Building2,
  Briefcase,
  Award,
  ShieldCheck,
  MapPin,
  Calendar,
  Database,
  BarChart3,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import type { UniversityGraduateInsight } from "../types/market-insights.types"
import { marketInsightsService } from "../services/market-insights.service"

interface GraduateEmploymentInsightsSectionProps {
  universityId?: string | number
}

export const GraduateEmploymentInsightsSection: React.FC<GraduateEmploymentInsightsSectionProps> = ({
  universityId,
}) => {
  const [data, setData] = useState<UniversityGraduateInsight | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGraduateInsights()
  }, [universityId])

  const loadGraduateInsights = async () => {
    setIsLoading(true)
    try {
      const res = await marketInsightsService.getUniversityGraduateInsights(universityId)
      setData(res)
    } catch (err) {
      console.warn("Using fallback graduate insights:", err)
      setData({
        university_name: "جامعة الملك فيصل (King Faisal University)",
        graduate_employment_rate: {
          overall_rate: 87.6,
          in_field_employment: 74.2,
          out_of_field_employment: 13.4,
          benchmark_vision_2030: 78.0,
          performance_status: "+9.6% Above Vision 2030 National Target",
        },
        common_job_roles: [
          { role: "Software & DevOps Engineer", graduates_count: 184, employment_rate: 92.4, avg_starting_salary: "SAR 14,500" },
          { role: "Cybersecurity & SOC Analyst", graduates_count: 112, employment_rate: 95.1, avg_starting_salary: "SAR 16,000" },
          { role: "Data & AI Associate", graduates_count: 96, employment_rate: 88.5, avg_starting_salary: "SAR 15,200" },
          { role: "ERP & MIS Consultant", graduates_count: 82, employment_rate: 84.0, avg_starting_salary: "SAR 13,000" },
          { role: "Agricultural Tech Specialist", graduates_count: 78, employment_rate: 81.5, avg_starting_salary: "SAR 12,500" },
        ],
        average_salary_ranges: [
          { bracket: "Under SAR 8,000", percentage: 8.2, count: 48 },
          { bracket: "SAR 8,000 – 11,000", percentage: 24.5, count: 145 },
          { bracket: "SAR 11,000 – 15,000", percentage: 46.8, count: 278 },
          { bracket: "Above SAR 15,000", percentage: 20.5, count: 124 },
        ],
        top_hiring_industries: [
          { industry: "Technology & Software Solutions", percentage: 34, hires: 202 },
          { industry: "Energy, Oil & Petrochemicals", percentage: 26, hires: 154 },
          { industry: "Banking, Fintech & Insurance", percentage: 18, hires: 107 },
          { industry: "Government & Defense Entities", percentage: 14, hires: 83 },
          { industry: "Modern Agriculture & Food Processing", percentage: 8, hires: 49 },
        ],
        top_hiring_companies: [
          { company: "Saudi Aramco", graduates_hired: 58, sector: "Energy & Digital R&D" },
          { company: "Solutions by stc", graduates_hired: 44, sector: "Telecom & Cloud" },
          { company: "Elm (علم)", graduates_hired: 36, sector: "Digital Services & AI" },
          { company: "Almarai (المراعي)", graduates_hired: 28, sector: "Supply Chain & Automation" },
          { company: "Alinma Bank (مصرف الإنماء)", graduates_hired: 22, sector: "Fintech & Banking" },
        ],
        most_demanded_skills: [
          { skill: "React & Modern Web Systems", hiring_mentions: 142, demand_level: "High" },
          { skill: "Cloud Infrastructure (AWS / Azure)", hiring_mentions: 128, demand_level: "Critical" },
          { skill: "Cybersecurity & Incident Response", hiring_mentions: 98, demand_level: "Critical" },
          { skill: "Python, Machine Learning & SQL", hiring_mentions: 92, demand_level: "Critical" },
          { skill: "Enterprise ERP & Process Mapping", hiring_mentions: 76, demand_level: "High" },
        ],
        placement_trends: {
          avg_time_to_hire_months: 3.4,
          internship_to_job_conversion_rate: 68.5,
          accredited_partner_companies: 48,
        },
        location_wise_employment: [
          { city: "Eastern Province (Al-Ahsa, Dhahran, Dammam)", percentage: 58 },
          { city: "Riyadh Capital Region", percentage: 32 },
          { city: "Other Regions & Remote", percentage: 10 },
        ],
        data_source: "Market Salary Dataset",
        data_date: "2026-10-02",
        last_updated: "02 Oct 2026",
        privacy_compliance: "Fully anonymized and aggregated. Zero individual candidate salary exposure.",
        is_demo: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <GlassCard className="p-8 text-center animate-pulse border-white/10">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 mx-auto mb-4 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-emerald-400 animate-spin" />
        </div>
        <p className="text-white/70 text-sm">Aggregating Graduate Employment & Market Insights...</p>
      </GlassCard>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* ── Main Header Card: Graduate Employment Insights ─────────── */}
      <GlassCard className="p-6 border border-white/10 bg-gradient-to-br from-[#061B24] via-[#0C2D3B] to-[#061B24] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Graduate Employment Insights</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Aggregated Academic Intelligence
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Comprehensive employment outcomes, industry absorption, and starting compensation benchmarks for university graduates.
            </p>
          </div>

          {/* Privacy Compliance Badge */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-medium">100% Privacy Compliant: Anonymized & Aggregated Data</span>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Overall Employment Rate */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-xs text-white/50 block">Graduate Employment Rate</span>
            <div className="text-2xl font-black text-white mt-1">
              {data.graduate_employment_rate.overall_rate}%
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              {data.graduate_employment_rate.performance_status}
            </div>
          </div>

          {/* In-Field Employment */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-xs text-white/50 block">In-Field Specialization Fit</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">
              {data.graduate_employment_rate.in_field_employment}%
            </div>
            <div className="text-[11px] text-white/60 mt-1">
              Out-of-field: {data.graduate_employment_rate.out_of_field_employment}%
            </div>
          </div>

          {/* Internship Conversion */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-xs text-white/50 block">Internship-to-Job Conversion</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {data.placement_trends.internship_to_job_conversion_rate}%
            </div>
            <div className="text-[11px] text-white/60 mt-1">
              Avg Time to Hire: {data.placement_trends.avg_time_to_hire_months} Months
            </div>
          </div>

          {/* Partner Employers */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-xs text-white/50 block">Accredited Hiring Partners</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {data.placement_trends.accredited_partner_companies}
            </div>
            <div className="text-[11px] text-white/60 mt-1">Active Enterprise Recruiters</div>
          </div>
        </div>

        {/* Metadata Footer */}
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
              Demo Academic Benchmarks
            </span>
          )}
        </div>
      </GlassCard>

      {/* ── Section: Common Job Roles & Salary Ranges ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Job Roles */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" /> Common Graduate Job Roles
            </h3>
            <span className="text-xs text-white/50">Top 5 Placements</span>
          </div>
          <div className="space-y-3">
            {data.common_job_roles.map((r, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-white/90 block">{r.role}</span>
                  <span className="text-[11px] text-white/50">
                    {r.graduates_count} graduates hired • {r.employment_rate}% placement rate
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">{r.avg_starting_salary}</span>
                  <span className="text-[10px] text-white/40">Avg Starting Monthly</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Aggregated Salary Distribution Brackets */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" /> Average Graduate Salary Ranges
            </h3>
            <span className="text-[11px] text-white/50">Aggregated Percentages</span>
          </div>
          <div className="space-y-3">
            {data.average_salary_ranges.map((bracket, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/80">{bracket.bracket}</span>
                  <span className="font-bold text-cyan-400">
                    {bracket.percentage}% ({bracket.count} graduates)
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full"
                    style={{ width: `${bracket.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Section: Top Hiring Industries & Top Companies ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Hiring Industries */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" /> Top Hiring Industries
          </h3>
          <div className="space-y-3">
            {data.top_hiring_industries.map((ind, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-white/90">{ind.industry}</span>
                </div>
                <span className="text-xs font-bold text-indigo-400">
                  {ind.percentage}% ({ind.hires} hires)
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Top Hiring Companies */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Top Hiring Employers
          </h3>
          <div className="space-y-3">
            {data.top_hiring_companies.map((comp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-white/90 block">{comp.company}</span>
                  <span className="text-[11px] text-white/50">{comp.sector}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-300">
                  {comp.graduates_hired} Hired
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Section: Most Demanded Skills & Location Distribution ──── */}
      <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Most Demanded Skills by Employers</h3>
            <div className="flex flex-wrap gap-2">
              {data.most_demanded_skills.map((s, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white flex items-center gap-2"
                >
                  <span>{s.skill}</span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded">
                    {s.hiring_mentions} Mentions
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-3">Location-Wise Employment</h3>
            <div className="space-y-2">
              {data.location_wise_employment.map((loc, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-white/80 p-2 rounded bg-white/[0.02]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {loc.city}
                  </span>
                  <span className="font-bold text-white">{loc.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
