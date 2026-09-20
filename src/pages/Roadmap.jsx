import React from "react";
import { useNavigate } from "react-router-dom";
import { GitBranch, Sparkles, ArrowRight, Zap, RefreshCw, CheckCircle2 } from "lucide-react";
import { NextBestActionCard } from "../components/dashboard/NextBestActionCard.jsx";
import { RoadmapAdaptiveBanner } from "../components/roadmap/RoadmapAdaptiveBanner.jsx";
import { RoadmapTimeline } from "../components/roadmap/RoadmapTimeline.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { LoadingState } from "../components/ui/StateViews.jsx";
import { useLearner } from "../hooks/useLearner.js";

export function Roadmap() {
  const navigate = useNavigate();
  const { roadmapData, nextAction, profile, loading, resetDemo } = useLearner();

  if (loading || !roadmapData) return <LoadingState message="Calculating adaptive learning roadmap..." />;

  const isAdaptiveUpdated = roadmapData.isAdaptiveUpdated;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" icon={GitBranch}>
              DYNAMIC LEARNING GRAPH
            </Badge>
            {isAdaptiveUpdated && (
              <Badge variant="mastery" icon={Sparkles}>
                Adaptive Mutation Applied
              </Badge>
            )}
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F8FAFC] mt-1">
            Personalized Engineering Curriculum
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Targeting:{" "}
            <strong className="text-[#0EA5E9]">
              {profile?.targetRole?.title || "Machine Learning Engineer"}
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdaptiveUpdated && (
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={resetDemo}>
              Reset Demo State
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            icon={Zap}
            onClick={() => navigate("/challenge")}
            className="shadow-[0_0_20px_rgba(14,165,233,0.3)]"
          >
            Open Active Challenge
          </Button>
        </div>
      </div>

      {/* Adaptive Roadmap Mutation Banner (Displayed when challenge is completed) */}
      {isAdaptiveUpdated && (
        <RoadmapAdaptiveBanner onResetDemo={resetDemo} />
      )}

      {/* MOST IMPORTANT PRODUCT COMPONENT: Next Best Action Card */}
      <div className="space-y-2">
        <NextBestActionCard
          action={nextAction}
          onStart={() => navigate("/challenge")}
        />
      </div>

      {/* Overview Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs font-mono text-[#64748B]">Curriculum Scope</div>
          <div className="text-xl font-mono font-bold text-[#F8FAFC] mt-1">
            {roadmapData.totalModules || 14} Modules across 3 Stages
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-mono text-[#64748B]">Active Milestone</div>
          <div className="text-xl font-mono font-bold text-[#0EA5E9] mt-1">
            Stage 1: Mathematical Foundations
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-mono text-[#64748B]">Estimated Time to Hiring Benchmark</div>
          <div className="text-xl font-mono font-bold text-[#34D399] mt-1">
            {roadmapData.estimatedWeeks || 12} Weeks (at 12h/wk)
          </div>
        </Card>
      </div>

      {/* Full Roadmap Timeline Graph */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-[#F8FAFC]">
            Milestone Sequence & Prerequisites
          </h2>
          <span className="text-xs font-mono text-[#64748B]">
            Interactive timeline nodes
          </span>
        </div>

        <RoadmapTimeline
          roadmapData={roadmapData}
          onSelectNode={(node) => {
            if (node.isAdaptiveInsert || node.status === "in_progress") {
              navigate("/challenge");
            }
          }}
        />
      </div>
    </div>
  );
}
