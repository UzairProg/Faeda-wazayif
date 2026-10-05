/**
 * features/market-insights/pages/MarketTrendsPage.tsx
 *
 * Dedicated Market Trends page (/market-trends).
 * Multi-dimensional analytics:
 *  - Salary trends across years by role
 *  - Salary curves by experience
 *  - Location salary indices
 *  - Skill demand trends & YoY growth
 *  - Emerging high-growth skills
 *  - Industry hiring shares
 * Multi-parameter filters:
 *  - Country, City, Industry, Role, Experience, Skill, Date Range.
 */

import React, { useState, useEffect } from "react"
import {
  TrendingUp,
  Filter,
  BarChart3,
  MapPin,
  Briefcase,
  Layers,
  Database,
  Flame,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import type { MarketTrendsData } from "../types/market-insights.types"
import { marketInsightsService, DEFAULT_MARKET_TRENDS } from "../services/market-insights.service"

export const MarketTrendsPage: React.FC = () => {
  const [trends, setTrends] = useState<MarketTrendsData>(DEFAULT_MARKET_TRENDS)

  // Filters state
  const [country, setCountry] = useState("Saudi Arabia")
  const [city, setCity] = useState("All")
  const [industry, setIndustry] = useState("All")
  const [role, setRole] = useState("All")
  const [experience, setExperience] = useState("All")
  const [skill, setSkill] = useState("All")
  const [dateRange, setDateRange] = useState("Last 12 Months")

  useEffect(() => {
    fetchTrends()
  }, [country, city, industry, role, experience, skill, dateRange])

  const fetchTrends = async () => {
    try {
      const data = await marketInsightsService.getMarketTrends({
        country,
        city,
        industry,
        role,
        experience,
        skill,
        date_range: dateRange,
      })
      setTrends(data)
    } catch (err) {
      console.warn("Using fallback market trends:", err)
      setTrends({
        salary_trends_by_role: [
          { role: "Full Stack Developer", salary_2024: 13500, salary_2025: 14800, salary_2026: 16000, growth_rate: "+18.5%" },
          { role: "Cloud Solutions Architect", salary_2024: 22000, salary_2025: 24500, salary_2026: 27000, growth_rate: "+22.7%" },
          { role: "Cybersecurity Specialist", salary_2024: 18000, salary_2025: 20000, salary_2026: 22000, growth_rate: "+22.2%" },
          { role: "AI / ML Engineer", salary_2024: 17500, salary_2025: 20500, salary_2026: 24000, growth_rate: "+37.1%" },
          { role: "UI/UX Product Designer", salary_2024: 11500, salary_2025: 12500, salary_2026: 13500, growth_rate: "+17.4%" },
        ],
        salary_trends_by_experience: [
          { experience: "0–1 Yrs", salary_sar: 10000, salary_lpa: "₹5.4 LPA" },
          { experience: "2–3 Yrs", salary_sar: 14500, salary_lpa: "₹7.8 LPA" },
          { experience: "4–6 Yrs", salary_sar: 21000, salary_lpa: "₹11.3 LPA" },
          { experience: "7–9 Yrs", salary_sar: 29000, salary_lpa: "₹15.6 LPA" },
          { experience: "10+ Yrs", salary_sar: 38000, salary_lpa: "₹20.5 LPA" },
        ],
        salary_trends_by_location: [
          { location: "Riyadh Capital", index: 118, avg_salary_sar: 18500 },
          { location: "Eastern Province (Dhahran/Khobar)", index: 110, avg_salary_sar: 17200 },
          { location: "Jeddah & Western Province", index: 100, avg_salary_sar: 15600 },
          { location: "Madinah & North", index: 88, avg_salary_sar: 13800 },
          { location: "Southern Region", index: 84, avg_salary_sar: 13100 },
        ],
        skill_demand_trends: [
          { skill: "React & TypeScript", demand_index: 94, trend: "Surging", yoy_change: "+28%" },
          { skill: "Cloud Security & NCA", demand_index: 96, trend: "Critical", yoy_change: "+34%" },
          { skill: "LLM Orchestration & RAG", demand_index: 98, trend: "Explosive", yoy_change: "+52%" },
          { skill: "Kubernetes & DevOps", demand_index: 89, trend: "High Demand", yoy_change: "+21%" },
          { skill: "Python & Data Engineering", demand_index: 91, trend: "High Demand", yoy_change: "+25%" },
        ],
        emerging_skills: [
          { skill: "Generative AI Agents & RAG", category: "Artificial Intelligence", surge_multiplier: "3.4x Demand Growth" },
          { skill: "NCA Cyber Compliance & Zero Trust", category: "Information Security", surge_multiplier: "2.8x Demand Growth" },
          { skill: "FinOps & Cloud Cost Optimization", category: "Cloud Infrastructure", surge_multiplier: "2.5x Demand Growth" },
          { skill: "Rust for High-Frequency Systems", category: "Systems Programming", surge_multiplier: "2.1x Demand Growth" },
        ],
        industry_demand: [
          { industry: "Fintech & Digital Banking", hiring_share: 28, growth: "+31% YoY" },
          { industry: "Government Digital Transformation (Vision 2030)", hiring_share: 26, growth: "+26% YoY" },
          { industry: "Cloud & Enterprise Software", hiring_share: 20, growth: "+22% YoY" },
          { industry: "Energy & Industrial Automation", hiring_share: 16, growth: "+15% YoY" },
          { industry: "Healthcare Tech & Logistics", hiring_share: 10, growth: "+18% YoY" },
        ],
        data_source: "Market Salary Dataset",
        data_date: "2026-10-02",
        last_updated: "02 Oct 2026",
        is_demo: true,
      })
    }
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-white">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Market Trends & Benchmarks</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Regional Index
            </span>
          </div>
          <p className="text-sm text-white/60 mt-1 max-w-2xl">
            Live macroeconomic talent movements, industry demand velocity, and salary compensation trends across roles, locations, and specializations.
          </p>
        </div>

        {/* Source metadata badge */}
        {trends && (
          <div className="flex items-center gap-3 text-xs text-white/50 bg-white/[0.03] border border-white/10 p-3 rounded-xl">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>
              Source: <strong className="text-white/80">{trends.data_source}</strong>
            </span>
            <span className="text-white/20">•</span>
            <span>
              Last Updated: <strong className="text-white/80">{trends.last_updated}</strong>
            </span>
            {trends.is_demo && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                Demo Benchmarks
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Multi-Parameter Filter Bar ─────────────────────────────── */}
      <GlassCard className="p-5 border border-white/10 bg-slate-900/70 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Filter className="w-4 h-4" /> Filter Market Intelligence
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* 1. Country */}
          <div>
            <label className="text-[11px] text-white/50 block mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Saudi Arabia" className="bg-slate-900">Saudi Arabia</option>
              <option value="United Arab Emirates" className="bg-slate-900">UAE</option>
              <option value="India" className="bg-slate-900">India</option>
              <option value="Regional GCC" className="bg-slate-900">Regional GCC</option>
            </select>
          </div>

          {/* 2. City */}
          <div>
            <label className="text-[11px] text-white/50 block mb-1">City / Region</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All" className="bg-slate-900">All Cities</option>
              <option value="Riyadh" className="bg-slate-900">Riyadh</option>
              <option value="Eastern Province" className="bg-slate-900">Eastern Province</option>
              <option value="Jeddah" className="bg-slate-900">Jeddah</option>
            </select>
          </div>

          {/* 3. Industry */}
          <div>
            <label className="text-[11px] text-white/50 block mb-1">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All" className="bg-slate-900">All Industries</option>
              <option value="Information Technology" className="bg-slate-900">Technology & Cloud</option>
              <option value="Fintech" className="bg-slate-900">Fintech & Banking</option>
              <option value="Energy" className="bg-slate-900">Energy & Oil</option>
            </select>
          </div>

          {/* 4. Job Role */}
          <div>
            <label className="text-[11px] text-white/50 block mb-1">Job Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All" className="bg-slate-900">All Roles</option>
              <option value="Full Stack Developer" className="bg-slate-900">Full Stack Developer</option>
              <option value="Cloud Solutions Architect" className="bg-slate-900">Cloud Architect</option>
              <option value="Cybersecurity Specialist" className="bg-slate-900">Cybersecurity</option>
              <option value="AI Engineer" className="bg-slate-900">AI / ML Engineer</option>
            </select>
          </div>

          {/* 5. Experience */}
          <div>
            <label className="text-[11px] text-white/50 block mb-1">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All" className="bg-slate-900">All Levels</option>
              <option value="0-2" className="bg-slate-900">0–2 Years (Junior)</option>
              <option value="3-5" className="bg-slate-900">3–5 Years (Mid-level)</option>
              <option value="6-8" className="bg-slate-900">6–8 Years (Senior)</option>
              <option value="9+" className="bg-slate-900">9+ Years (Lead / Principal)</option>
            </select>
          </div>

          {/* 6. Skill */}
          <div>
            <label className="text-[11px] text-white/50 block mb-1">Skill</label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All" className="bg-slate-900">All Skills</option>
              <option value="React" className="bg-slate-900">React</option>
              <option value="Python" className="bg-slate-900">Python</option>
              <option value="AWS" className="bg-slate-900">AWS Cloud</option>
              <option value="Cybersecurity" className="bg-slate-900">Cybersecurity</option>
            </select>
          </div>

          {/* 7. Date Range */}
          <div>
            <label className="text-[11px] text-white/50 block mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Last 6 Months" className="bg-slate-900">Last 6 Months</option>
              <option value="Last 12 Months" className="bg-slate-900">Last 12 Months</option>
              <option value="2024 - 2026" className="bg-slate-900">2024 – 2026 Trend</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* ── Section 1: Salary Growth by Role & Experience Curve ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Salary Growth */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Salary Benchmarks by Role (2024 → 2026)
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">Monthly SAR Avg</span>
          </div>

          <div className="space-y-3.5">
            {trends?.salary_trends_by_role.map((r, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white/90">{r.role}</span>
                  <span className="font-bold text-emerald-400">{r.growth_rate}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-center text-[11px]">
                  <div className="p-1.5 rounded bg-white/[0.02]">
                    <span className="text-white/40 block">2024</span>
                    <span className="font-medium text-white/70">{(r.salary_2024 ?? (r as any).y2024 ?? 13500).toLocaleString()} SAR</span>
                  </div>
                  <div className="p-1.5 rounded bg-white/[0.02]">
                    <span className="text-white/40 block">2025</span>
                    <span className="font-medium text-white/80">{(r.salary_2025 ?? (r as any).y2025 ?? 14800).toLocaleString()} SAR</span>
                  </div>
                  <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    <span className="text-cyan-400 block font-semibold">2026</span>
                    <span className="font-bold text-white">{(r.salary_2026 ?? (r as any).y2026 ?? 16000).toLocaleString()} SAR</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Experience Curve */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Salary Trends by Experience Tier
            </h3>
            <span className="text-xs text-white/50">Experience Multipliers</span>
          </div>

          <div className="space-y-3">
            {trends?.salary_trends_by_experience.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white/90">{exp.experience}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400">{(exp.salary_sar ?? (exp as any).average_salary ?? 10000).toLocaleString()} SAR/mo</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/30">
                      {exp.salary_lpa ?? (exp as any).range ?? "SAR"}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, (((exp.salary_sar ?? (exp as any).average_salary ?? 10000) / 40000) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Section 2: Skill Demand & Emerging Skills ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Demand Trends */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              High-Velocity Skill Demand
            </h3>
            <span className="text-xs text-white/50">Demand Index</span>
          </div>

          <div className="space-y-3">
            {trends?.skill_demand_trends.map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-white/90 block">{s.skill}</span>
                  <span className="text-[11px] text-cyan-400 font-medium">{s.trend}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">{s.yoy_change} YoY</span>
                  <span className="text-[10px] text-white/40">Score: {s.demand_index}/100</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Emerging Skills Surge */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400" />
              Emerging Skills in Vision 2030 Sectors
            </h3>
            <span className="text-xs text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">
              High Multiplier
            </span>
          </div>

          <div className="space-y-3">
            {trends?.emerging_skills.map((em, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-rose-950/15 border border-rose-500/20 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-white block">{em.skill}</span>
                  <span className="text-[11px] text-white/50">{em.category}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-300">
                  {em.surge_multiplier}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Section 3: Industry Demand & Location Index ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Hiring Share */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" /> Industry Hiring Demand Share
          </h3>
          <div className="space-y-3">
            {trends?.industry_demand.map((ind, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/80">{ind.industry}</span>
                  <span className="font-bold text-cyan-400">{ind.hiring_share ?? 25}% ({ind.growth ?? "+20%"})</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full"
                    style={{ width: `${(ind.hiring_share ?? 25) * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Location Salary Index */}
        <GlassCard className="p-6 border border-white/10 bg-slate-900/60">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" /> Location Salary Benchmarks
          </h3>
          <div className="space-y-3">
            {trends?.salary_trends_by_location.map((loc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-white/90 block">{loc.location ?? (loc as any).city ?? "Riyadh"}</span>
                  <span className="text-[11px] text-white/50">Cost & Compensation Index: {loc.index ?? 100}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">{(loc.avg_salary_sar ?? (loc as any).average_salary ?? 18000).toLocaleString()} SAR</span>
                  <span className="text-[10px] text-white/40">Regional Average</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
