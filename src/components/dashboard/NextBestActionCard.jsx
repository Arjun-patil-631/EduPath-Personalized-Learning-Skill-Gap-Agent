import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Clock, Award, Target, Zap } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";

export function NextBestActionCard({ action, onStart, compact = false }) {
  const navigate = useNavigate();

  if (!action) return null;

  const projectedDelta = Math.max(
    0,
    (action.projectedSkillScore ?? 67) - (action.currentSkillScore ?? 42)
  );

  const handleStart = () => {
    if (onStart) {
      onStart(action);
    } else {
      navigate(`/challenge?id=${action.id}`);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#161F30] via-[#161F30] to-[#1E293B] rounded-2xl border border-[#0EA5E9]/40 p-6 sm:p-7 shadow-[0_0_32px_rgba(14,165,233,0.12)]">
      {/* Decorative ambient glow lines */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent opacity-80" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          {/* Header Pill & Meta */}
          <div className="flex flex-wrap items-center gap-2.5">
            {action.isFollowUp ? (
              <Badge variant="mastery" icon={Sparkles}>
                ADAPTIVE NEXT ACTION UNLOCKED
              </Badge>
            ) : (
              <Badge variant="cyan" icon={Sparkles}>
                RECOMMENDED NEXT BEST ACTION
              </Badge>
            )}
            <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-mono">
              <Clock className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>{action.durationMinutes || 25} minutes</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-mono">
              <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>+{action.xpAward || 350} XP</span>
            </div>
            <Badge variant="deficit">
              {action.difficulty || "Intermediate"}
            </Badge>
          </div>

          {/* Title */}
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F8FAFC] tracking-tight">
              {action.title}
            </h2>
            <p className="text-xs font-mono text-[#0EA5E9] mt-1">
              Module: {action.module || "Statistical Inference & Bayesian Estimation"}
            </p>
          </div>

          {/* The Explicit "Why" block mandated by product specifications */}
          <div className="bg-[#0B0F19]/80 border border-[#1E293B] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#FBBF24] shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#FBBF24]">
                  Why:
                </span>
                <p className="text-sm text-[#F8FAFC] font-medium leading-relaxed">
                  {action.why}
                </p>
                {action.impactSummary && (
                  <p className="text-xs text-[#94A3B8] leading-relaxed pt-1">
                    {action.impactSummary}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Skill Projected Jump Preview */}
          {!compact && (
            <div className="flex items-center gap-4 text-xs font-mono bg-[#111827]/70 px-4 py-2.5 rounded-lg border border-[#1E293B] w-fit">
              <Target className="w-4 h-4 text-[#0EA5E9]" />
              <span className="text-[#94A3B8]">Target Skill Impact:</span>
              <span className="text-[#F8FAFC] font-semibold">
                {action.targetSkill || "Statistics"}:
              </span>
              <span className="text-[#FBBF24]">{action.currentSkillScore || 42}%</span>
              <span className="text-[#94A3B8]">→</span>
              <span className="text-[#34D399] font-bold">
                {action.projectedSkillScore || 67}%
              </span>
              <span className="text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded text-[10px]">
                +{projectedDelta}% Projected
              </span>
            </div>
          )}
        </div>

        {/* CTA Launchpad */}
        <div className="flex flex-col items-start md:items-end justify-center shrink-0 pt-2 md:pt-0">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            className="w-full md:w-auto text-base shadow-[0_0_24px_rgba(14,165,233,0.4)] hover:shadow-[0_0_32px_rgba(14,165,233,0.6)]"
            icon={ArrowRight}
          >
            Start Challenge
          </Button>
          <span className="text-[11px] font-mono text-[#64748B] mt-2 text-center md:text-right">
            Instant evaluation & adaptive roadmap update
          </span>
        </div>
      </div>
    </div>
  );
}
