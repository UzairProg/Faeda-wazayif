/**
 * features/market-insights/components/SkillDetailModal.tsx
 *
 * Interactive modal displayed when a user clicks any skill in the Market Analysis.
 * Displays related roles, demand outlook, and salary benchmarks.
 */

import React from "react"
import { X, TrendingUp, Briefcase, Award, Info } from "lucide-react"
import type { SkillInsight } from "../types/market-insights.types"

interface SkillDetailModalProps {
  skill: SkillInsight | null
  isOpen: boolean
  onClose: () => void
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ skill, isOpen, onClose }) => {
  if (!isOpen || !skill) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary">
              <Award className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">{skill.skill}</h3>
              <p className="text-xs text-white/60">Skill Market Benchmark & Role Fit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-xs text-white/50 block">Market Demand Level</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                    skill.demand_level === "Critical"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {skill.demand_level} Demand
                </span>
                <span className="text-xs text-white/60">({skill.demand_score}/100)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-xs text-white/50 block">Market Trend</span>
              <div className="flex items-center gap-1.5 mt-1 text-cyan-300 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>{skill.market_trend}</span>
                <span className="text-xs text-white/50">+{skill.growth_percentage}% YoY</span>
              </div>
            </div>
          </div>

          {/* Salary Benchmark */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-cyan-500/10 to-transparent border border-cyan-500/20">
            <span className="text-xs uppercase tracking-wider text-cyan-300 font-medium">Estimated Salary Benchmark</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{skill.salary_benchmark}</span>
              {skill.salary_benchmark_lpa && (
                <span className="text-sm font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  {skill.salary_benchmark_lpa}
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/50 mt-1">
              Based on regional industry openings and verified hiring bands. Not an individual valuation.
            </p>
          </div>

          {/* Related Job Roles */}
          <div>
            <span className="text-xs font-semibold text-white/70 block mb-2">High-Affinity Job Roles</span>
            <div className="flex flex-wrap gap-2">
              {skill.related_job_roles.map((role, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/90"
                >
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Top Demand Hubs */}
          {skill.top_locations && (
            <div>
              <span className="text-xs font-semibold text-white/70 block mb-1">Top Hiring Locations</span>
              <p className="text-xs text-white/60">{skill.top_locations.join(" • ")}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Sample Benchmark Data:</strong> Figures represent statistical industry standards for market positioning and career planning.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
