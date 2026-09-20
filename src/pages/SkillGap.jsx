import React from "react";
import { useNavigate } from "react-router-dom";
import { Target, ArrowRight, AlertTriangle, Zap, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { SkillGapTable } from "../components/skills/SkillGapTable.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { LoadingState } from "../components/ui/StateViews.jsx";
import { useLearner } from "../hooks/useLearner.js";

export function SkillGap() {
  const navigate = useNavigate();
  const { skillGapData, profile, loading } = useLearner();

  if (loading || !skillGapData) return <LoadingState message="Analyzing skill deficits against target role..." />;

  const gaps = skillGapData.gaps || [];
  const targetRoleTitle = skillGapData.roleTitle || "Machine Learning Engineer";
  const roleReadiness = skillGapData.roleReadiness || 52;

  // Identify Statistics gap (42 vs 75)
  const statsGap = gaps.find((g) => g.skill === "Statistics");

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pb-4 border-b border-[#1E293B]">
        <span className="text-[#0EA5E9] font-semibold">STAGE 04: SKILL GAP MATRIX</span>
        <span>Step 4 of 5: Calibration → Profile → Target Career → Skill Gap → Adaptive Roadmap</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" icon={Target}>
              Competency Deficit Analysis
            </Badge>
            <span className="text-xs font-mono text-[#64748B]">Target: {targetRoleTitle}</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F8FAFC]">
            Skill Gap Matrix & Hiring Benchmarks
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Calculated by subtracting current measured proficiency from minimum required hiring benchmarks.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={ArrowRight}
          onClick={() => navigate("/roadmap")}
          className="shadow-[0_0_20px_rgba(14,165,233,0.3)]"
        >
          View Personalized Roadmap
        </Button>
      </div>

      {/* Critical Gap Alert Banner (Mandated focus on Statistics/Probability) */}
      <div className="bg-gradient-to-r from-[#161F30] via-[#F59E0B]/10 to-[#161F30] rounded-2xl border border-[#F59E0B]/40 p-5 sm:p-6 shadow-[0_0_24px_rgba(245,158,11,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#FBBF24] shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-[#FBBF24]">
                  Key Actionable Finding
                </span>
                <Badge variant="deficit">Highest Priority Blocker</Badge>
              </div>
              <h3 className="font-display font-bold text-lg text-[#F8FAFC] mt-0.5">
                Statistics Deficit: 42% Current vs 75% Required (-33% Gap)
              </h3>
              <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed max-w-2xl font-sans">
                Probability and Bayes estimation form the critical mathematical bottleneck preventing progression into production Machine Learning algorithms. Resolving this gap yields the highest velocity toward hiring readiness.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            icon={ArrowRight}
            onClick={() => navigate("/roadmap")}
            className="shrink-0 border-[#F59E0B]/40 text-[#FBBF24] hover:border-[#FBBF24]"
          >
            Review Remediation
          </Button>
        </div>
      </div>

      {/* Role Readiness Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs font-mono text-[#64748B] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>Overall Role Readiness</span>
          </div>
          <div className="text-3xl font-mono font-bold text-[#F8FAFC] mt-1">
            {roleReadiness}%
          </div>
          <div className="text-[11px] font-mono text-[#64748B] mt-1">
            Industry hiring threshold: 80%
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-mono text-[#64748B] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Identified Deficits</span>
          </div>
          <div className="text-3xl font-mono font-bold text-[#FBBF24] mt-1">
            {gaps.filter((g) => g.gap < 0).length}{" "}
            <span className="text-sm font-normal text-[#94A3B8]">Axes</span>
          </div>
          <div className="text-[11px] font-mono text-[#64748B] mt-1">
            Top blocker: Statistics (-33%)
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-mono text-[#64748B] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Highest Proficiency</span>
          </div>
          <div className="text-3xl font-mono font-bold text-[#34D399] mt-1">
            Python: 78%
          </div>
          <div className="text-[11px] font-mono text-[#64748B] mt-1">
            Target: 85% (Near benchmark)
          </div>
        </Card>
      </div>

      {/* Full Skill Gap Breakdown Table */}
      <SkillGapTable gaps={gaps} roleTitle={targetRoleTitle} />

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/career-goal")}>
          Back to Target Career
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={ArrowRight}
          onClick={() => navigate("/roadmap")}
        >
          View Personalized Roadmap & Next Action
        </Button>
      </div>
    </div>
  );
}
