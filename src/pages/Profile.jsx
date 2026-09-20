import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  GraduationCap,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { ProgressBar } from "../components/ui/ProgressBar.jsx";
import { useLearner } from "../hooks/useLearner.js";
import { LoadingState } from "../components/ui/StateViews.jsx";

export function Profile() {
  const navigate = useNavigate();
  const { profile, loading } = useLearner();

  if (loading || !profile) return <LoadingState message="Compiling learner profile vector..." />;

  const skills = profile.currentSkills || {};
  const targetRole = profile.targetRole || {
    title: "Machine Learning Engineer",
    medianSalary: "$162,000",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#1E293B] border border-[#0EA5E9]/50 flex items-center justify-center font-mono text-2xl font-bold text-white shadow-[0_0_24px_rgba(14,165,233,0.3)]">
            {profile.avatar || "AC"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F8FAFC]">
                {profile.name}
              </h1>
              <Badge variant="mastery" icon={CheckCircle2}>
                Verified Diagnostic
              </Badge>
            </div>
            <p className="text-xs font-mono text-[#94A3B8] mt-1">
              Target Career Role:{" "}
              <strong className="text-[#0EA5E9]">{targetRole.title}</strong>
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={ArrowRight}
          onClick={() => navigate("/career-goal")}
          className="shadow-[0_0_20px_rgba(14,165,233,0.3)]"
        >
          Select Target Career Role
        </Button>
      </div>

      {/* Profile Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs font-mono text-[#64748B] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Role Readiness</span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#F8FAFC] mt-1">
            {profile.roleReadiness}%
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-mono text-[#64748B] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Day Streak</span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#F8FAFC] mt-1">
            {profile.streakDays} Days
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-mono text-[#64748B] flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>Total XP</span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#F8FAFC] mt-1">
            {profile.totalXp.toLocaleString()}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-mono text-[#64748B] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Weekly Target</span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#F8FAFC] mt-1">
            {profile.weeklyCommitmentHours} hrs
          </div>
        </Card>
      </div>

      {/* Current Skill Baseline Vector */}
      <Card
        title="Evaluated Skill Vector"
        subtitle="Measured proficiency scores generated from diagnostic assessment"
        icon={Layers}
      >
        <div className="space-y-4">
          {Object.entries(skills).map(([skill, score]) => (
            <div key={skill} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[#F8FAFC]">{skill}</span>
                <span
                  className={
                    score >= 70
                      ? "text-[#34D399]"
                      : score >= 50
                      ? "text-[#38BDF8]"
                      : "text-[#FBBF24]"
                  }
                >
                  {score}%
                </span>
              </div>
              <ProgressBar
                value={score}
                variant={score >= 70 ? "emerald" : score >= 50 ? "cyan" : "amber"}
                height="h-2"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Contextual Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Background & Education" icon={GraduationCap}>
          <div className="space-y-2 text-xs font-mono text-[#94A3B8]">
            <div className="flex justify-between py-1 border-b border-[#1E293B]">
              <span>Degree:</span>
              <span className="text-[#F8FAFC]">{profile.education}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1E293B]">
              <span>Experience:</span>
              <span className="text-[#F8FAFC]">{profile.experienceLevel}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Current Title:</span>
              <span className="text-[#F8FAFC]">{profile.currentRole}</span>
            </div>
          </div>
        </Card>

        <Card title="Learning Parameters" icon={Clock}>
          <div className="space-y-2 text-xs font-mono text-[#94A3B8]">
            <div className="flex justify-between py-1 border-b border-[#1E293B]">
              <span>Learning Style:</span>
              <span className="text-[#F8FAFC]">{profile.learningStyle}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1E293B]">
              <span>Weekly Cadence:</span>
              <span className="text-[#F8FAFC]">{profile.weeklyCommitmentHours} hrs / week</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Member Since:</span>
              <span className="text-[#F8FAFC]">{profile.joinedDate}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* CTA Footer */}
      <div className="pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => navigate("/assessment")}>
          Retake Diagnostic Test
        </Button>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/skill-gap")}
            className="flex-1 sm:flex-none"
          >
            Skill Gap Matrix
          </Button>
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            onClick={() => navigate("/career-goal")}
            className="flex-1 sm:flex-none shadow-[0_0_20px_rgba(14,165,233,0.3)]"
          >
            Configure Target Career
          </Button>
        </div>
      </div>
    </div>
  );
}
