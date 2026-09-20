import React from "react";
import { Link } from "react-router-dom";
import { Target, TrendingUp, Flame, Award, ChevronRight, Briefcase } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { ProgressBar } from "../ui/ProgressBar.jsx";

export function RoleReadinessCard({ profile, skillGapData }) {
  if (!profile) return null;

  const targetRole = profile.targetRole || {
    title: "Machine Learning Engineer",
    medianSalary: "$162,000",
    marketDemand: "High Demand",
  };

  const readiness = profile.roleReadiness || (skillGapData ? skillGapData.roleReadiness : 52);

  return (
    <Card className="relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 flex items-center justify-center text-[#0EA5E9]">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
                TARGET CAREER ROLE
              </span>
              <Badge variant="cyan">Active Goal</Badge>
            </div>
            <h3 className="font-display font-bold text-xl text-[#F8FAFC]">
              {targetRole.title}
            </h3>
          </div>
        </div>

        <Link
          to="/career-goal"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0EA5E9] hover:text-[#38BDF8] transition-colors"
        >
          <span>Switch Target Role</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Readiness Metric Gauge */}
      <div className="py-5 space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono text-[#94A3B8] uppercase">
              Role Readiness Benchmark
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-mono font-bold text-[#F8FAFC] tracking-tight">
                {readiness}%
              </span>
              <span className="text-xs font-mono text-[#10B981] font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {readiness >= 55 ? "+7% post-evaluation" : "Baseline Evaluated"}
              </span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="text-xs font-mono text-[#64748B]">Industry Market Cap</span>
            <div className="text-sm font-mono font-semibold text-[#34D399]">
              {targetRole.medianSalary || "$162k Median"}
            </div>
          </div>
        </div>

        <ProgressBar
          value={readiness}
          targetValue={80} // 80% is hiring benchmark threshold
          variant={readiness >= 65 ? "emerald" : readiness >= 45 ? "cyan" : "amber"}
          height="h-3"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-1">
          <span>0% Beginner</span>
          <span className="text-[#F8FAFC]">▲ 80% Hiring Threshold</span>
          <span>100% Senior Expert</span>
        </div>
      </div>

      {/* Auxiliary Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#1E293B]">
        <div className="bg-[#111827] rounded-xl p-3 border border-[#1E293B]/70">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mb-1 font-mono">
            <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Streak</span>
          </div>
          <div className="text-base font-mono font-bold text-[#F8FAFC]">
            {profile.streakDays || 14} <span className="text-xs font-normal text-[#64748B]">Days</span>
          </div>
        </div>

        <div className="bg-[#111827] rounded-xl p-3 border border-[#1E293B]/70">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mb-1 font-mono">
            <Award className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>Mastery XP</span>
          </div>
          <div className="text-base font-mono font-bold text-[#F8FAFC]">
            {(profile.totalXp || 3450).toLocaleString()}
          </div>
        </div>

        <div className="bg-[#111827] rounded-xl p-3 border border-[#1E293B]/70">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mb-1 font-mono">
            <Target className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Pace</span>
          </div>
          <div className="text-base font-mono font-bold text-[#F8FAFC]">
            {profile.weeklyCommitmentHours || 12}h<span className="text-xs font-normal text-[#64748B]">/wk</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
