import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  GitBranch,
  Zap,
  TrendingUp,
  AlertCircle,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { NextBestActionCard } from "../components/dashboard/NextBestActionCard.jsx";
import { RoleReadinessCard } from "../components/dashboard/RoleReadinessCard.jsx";
import { RecentActivityFeed } from "../components/dashboard/RecentActivityFeed.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { ProgressBar } from "../components/ui/ProgressBar.jsx";
import { LoadingState } from "../components/ui/StateViews.jsx";
import { useLearner } from "../hooks/useLearner.js";

export function Dashboard() {
  const navigate = useNavigate();
  const { profile, skillGapData, nextAction, roadmapData, loading, resetDemo } = useLearner();

  if (loading || !profile) return <LoadingState message="Connecting to EduPath neural telemetry..." />;

  const isChallengeCompleted = profile.currentSkills?.Statistics === 67;
  const skills = profile.currentSkills || {};

  return (
    <div className="space-y-8 py-2 max-w-6xl mx-auto">
      {/* Welcome Greeting & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#0EA5E9] uppercase tracking-wider font-semibold">
              ENGINEERING COMMAND CENTER
            </span>
            {isChallengeCompleted && (
              <Badge variant="mastery" icon={Sparkles}>
                Statistics Calibrated (+25%)
              </Badge>
            )}
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F8FAFC] mt-0.5">
            Welcome back, {profile.name}
          </h1>
          <p className="text-xs font-mono text-[#94A3B8] mt-0.5">
            Targeting:{" "}
            <strong className="text-[#F8FAFC]">
              {profile.targetRole?.title || "Machine Learning Engineer"}
            </strong>{" "}
            • Week 3 of 12
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Target}
            onClick={() => navigate("/skill-gap")}
          >
            Skill Gaps
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={GitBranch}
            onClick={() => navigate("/roadmap")}
          >
            Roadmap
          </Button>
        </div>
      </div>

      {/* MOST IMPORTANT PRODUCT COMPONENT: Next Best Action Card */}
      <NextBestActionCard
        action={nextAction}
        onStart={() => navigate("/challenge")}
      />

      {/* Main Grid: Readiness & Telemetry Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Role Readiness Card (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <RoleReadinessCard profile={profile} skillGapData={skillGapData} />

          {/* Current Skill Baseline Vector Card */}
          <Card
            title="Skill Proficiency Distribution"
            subtitle="Real-time telemetry across core role axes"
            headerAction={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/skill-gap")}
                icon={ArrowRight}
              >
                Full Matrix
              </Button>
            }
          >
            <div className="space-y-4 pt-1">
              {Object.entries(skills).map(([skill, score]) => {
                const isUpdated = skill === "Statistics" && score === 67;
                return (
                  <div key={skill} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#F8FAFC]">{skill}</span>
                        {isUpdated && (
                          <span className="text-[10px] text-[#34D399] bg-[#10B981]/15 px-1.5 py-0.2 rounded font-mono font-bold">
                            +25% Updated
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-semibold ${
                          score >= 70
                            ? "text-[#34D399]"
                            : score >= 50
                            ? "text-[#38BDF8]"
                            : "text-[#FBBF24]"
                        }`}
                      >
                        {score}%
                      </span>
                    </div>
                    <ProgressBar
                      value={score}
                      variant={
                        score >= 70
                          ? "emerald"
                          : score >= 50
                          ? "cyan"
                          : "amber"
                      }
                      height="h-2"
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Activity Feed & Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <RecentActivityFeed challengeCompleted={isChallengeCompleted} />

          {/* Quick Demo Controller Card */}
          <Card
            title="Adaptive Engine Walkthrough"
            subtitle="Core loop test controls"
          >
            <div className="space-y-3 text-xs text-[#94A3B8]">
              <p>
                EduPath continuously monitors competency deltas. Completing the Probability Challenge adapts the curriculum sequence and promotes Statistics to 67%.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Zap}
                  onClick={() => navigate("/challenge")}
                  className="w-full justify-start"
                >
                  Run Probability Challenge
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={RefreshCw}
                  onClick={resetDemo}
                  className="w-full justify-start text-[#94A3B8]"
                >
                  Reset Demo State (42% Stats)
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
