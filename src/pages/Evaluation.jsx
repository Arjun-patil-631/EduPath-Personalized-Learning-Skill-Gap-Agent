import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  GitBranch,
  Award,
  Clock,
  Cpu,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { RoadmapAdaptiveBanner } from "../components/roadmap/RoadmapAdaptiveBanner.jsx";
import { LoadingState } from "../components/ui/StateViews.jsx";
import { api } from "../services/api.js";
import { useLearner } from "../hooks/useLearner.js";

export function Evaluation() {
  const navigate = useNavigate();
  const { reloadAll, resetDemo } = useLearner();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvaluation() {
      try {
        setLoading(true);
        const res = await api.getEvaluation();
        if (res.success) {
          setEvaluation(res.data);
        }
      } catch (err) {
        console.error("Failed to load evaluation", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvaluation();
  }, []);

  if (loading || !evaluation) return <LoadingState message="Aggregating execution telemetry and updating skill graph..." />;

  const skillUpdate = evaluation.skillUpdate || {
    skillName: "Statistics",
    previousScore: 42,
    newScore: 67,
    delta: "+25%",
  };

  const readiness = evaluation.readinessUpdate || {
    previous: 52,
    current: 59,
    delta: "+7%",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Banner: Verification Success */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#10B981]/20 via-[#161F30] to-[#10B981]/20 border border-[#10B981]/50 p-6 sm:p-7 shadow-[0_0_32px_rgba(16,185,129,0.15)] text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/50 flex items-center justify-center text-[#34D399] mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <Badge variant="mastery" icon={Sparkles}>
            ALL TEST ASSERTIONS PASSED (5/5)
          </Badge>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#F8FAFC] mt-2">
            Challenge Completed Successfully
          </h1>
          <p className="text-xs font-mono text-[#94A3B8] mt-1">
            Execution: {evaluation.executionTime || "8.4ms"} • Memory: {evaluation.memoryUsage || "14.2 MB"} • Award: +{evaluation.earnedXp || 350} XP
          </p>
        </div>
      </div>

      {/* CORE DEMONSTRATION 1: SKILL UPDATE (Statistics: 42% → 67%) */}
      <div className="bg-[#161F30] rounded-2xl border-2 border-[#0EA5E9]/50 p-6 sm:p-7 shadow-[0_0_30px_rgba(14,165,233,0.15)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 flex items-center justify-center text-[#38BDF8]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#38BDF8] font-bold">
                TELEMETRY SKILL UPDATE
              </span>
              <h3 className="font-display font-bold text-xl text-[#F8FAFC]">
                Competency Metric Progression
              </h3>
            </div>
          </div>
          <Badge variant="mastery">Significant Gain</Badge>
        </div>

        {/* Big visual jump display */}
        <div className="p-6 bg-[#0B0F19] rounded-xl border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-sm font-mono text-[#94A3B8]">Target Skill Axis:</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F8FAFC]">
              {skillUpdate.skillName}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-center">
            {/* Previous */}
            <div className="bg-[#161F30] px-5 py-3 rounded-xl border border-[#1E293B]">
              <span className="text-xs font-mono text-[#64748B] block">Previous</span>
              <span className="font-mono text-2xl font-bold text-[#FBBF24]">
                {skillUpdate.previousScore}%
              </span>
            </div>

            <ArrowRight className="w-6 h-6 text-[#0EA5E9] shrink-0" />

            {/* New */}
            <div className="bg-[#10B981]/15 px-6 py-3 rounded-xl border border-[#10B981]/50 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <span className="text-xs font-mono text-[#34D399] block font-semibold">Updated Score</span>
              <span className="font-mono text-3xl font-extrabold text-[#34D399]">
                {skillUpdate.newScore}%
              </span>
            </div>

            {/* Delta */}
            <div className="text-left hidden sm:block">
              <span className="text-xs font-mono text-[#10B981] font-bold block">
                {skillUpdate.delta}
              </span>
              <span className="text-[11px] text-[#94A3B8] font-mono">
                Remediates primary gap
              </span>
            </div>
          </div>
        </div>

        {/* Overall Readiness Delta */}
        <div className="flex items-center justify-between text-xs font-mono bg-[#111827] px-4 py-2.5 rounded-lg border border-[#1E293B]">
          <span className="text-[#94A3B8]">Overall ML Engineer Role Readiness:</span>
          <div className="flex items-center gap-2">
            <span className="text-[#FBBF24]">{readiness.previous}%</span>
            <span className="text-[#64748B]">→</span>
            <span className="text-[#34D399] font-bold">{readiness.current}%</span>
            <span className="text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded text-[10px]">
              {readiness.delta} Overall
            </span>
          </div>
        </div>
      </div>

      {/* CORE DEMONSTRATION 2: ROADMAP UPDATED BANNER */}
      <RoadmapAdaptiveBanner evaluationData={evaluation} onResetDemo={resetDemo} />

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1E293B]">
        <Button
          variant="ghost"
          size="md"
          icon={RefreshCw}
          onClick={async () => {
            await resetDemo();
            navigate("/roadmap");
          }}
        >
          Reset Demo State
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="lg"
            icon={GitBranch}
            onClick={() => navigate("/roadmap")}
            className="flex-1 sm:flex-none"
          >
            View Adaptive Roadmap
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon={LayoutDashboard}
            onClick={() => navigate("/dashboard")}
            className="flex-1 sm:flex-none shadow-[0_0_24px_rgba(14,165,233,0.35)]"
          >
            Go to Active Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
