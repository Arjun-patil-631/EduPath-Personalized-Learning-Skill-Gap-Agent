import React from "react";
import { Sparkles, Clock, Target, CheckCircle2, Bot } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";

export function LearningPlanCard({ plan }) {
  if (!plan || !plan.steps || plan.steps.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[#0EA5E9]/40 bg-gradient-to-br from-[#161F30] via-[#0EA5E9]/10 to-[#161F30] p-6 sm:p-7 shadow-[0_0_32px_rgba(14,165,233,0.15)] space-y-5">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 flex items-center justify-center text-[#38BDF8]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#38BDF8] font-bold">
              AI PLANNER AGENT (n8n + GEMINI)
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F8FAFC]">
              {plan.plan_title}
            </h3>
          </div>
        </div>

        <Badge variant="cyan" icon={Sparkles}>
          Active Autonomous Plan
        </Badge>
      </div>

      {/* Rationale */}
      <p className="text-sm text-[#94A3B8] leading-relaxed bg-[#0B0F19]/80 p-4 rounded-xl border border-[#1E293B]">
        {plan.reason}
      </p>

      {/* Steps Grid */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase text-[#64748B] font-semibold">
          Tailored Milestones ({plan.steps.length} Steps):
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plan.steps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="bg-[#0B0F19]/90 rounded-xl p-4 border border-[#1E293B] space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#0EA5E9] font-bold">
                  Step {idx + 1}: {step.skill}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    step.priority === "high"
                      ? "bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/30"
                      : "bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30"
                  }`}
                >
                  {step.priority} priority
                </span>
              </div>
              <h4 className="text-sm font-display font-semibold text-[#F8FAFC]">
                {step.topic}
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {step.practice}
              </p>
              <div className="pt-2 border-t border-[#1E293B]/60 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  {step.duration_minutes} mins
                </span>
                <span className="flex items-center gap-1 text-[#34D399] max-w-[65%] truncate" title={step.evidence}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  {step.evidence}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
