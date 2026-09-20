import React from "react";
import { Sparkles, ArrowRight, GitBranch, CheckCircle2, RefreshCw } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";

export function RoadmapAdaptiveBanner({ evaluationData, onResetDemo }) {
  const previous = ["Statistics", "Machine Learning"];
  const updated = ["Probability Practice", "Statistics", "Machine Learning"];

  const explanation =
    evaluationData?.roadmapUpdate?.reasonExplanation ||
    "Probability was identified as the largest prerequisite gap for Machine Learning pipelines. Completing the Probability Challenge lifted your Statistics baseline from 42% to 67%. The adaptive engine dynamically inserted a targeted 'Probability Practice' node before advancing to Machine Learning to reinforce Bayes risk boundaries and prevent regression.";

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[#10B981]/50 bg-gradient-to-br from-[#161F30] via-[#10B981]/10 to-[#161F30] p-6 sm:p-7 shadow-[0_0_36px_rgba(16,185,129,0.18)]">
      {/* Background glow element */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />

      <div className="relative z-10 space-y-5">
        {/* Top bar with alert badge and icon */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#34D399]">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#34D399] font-bold">
                ADAPTIVE CURRICULUM MUTATION
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F8FAFC]">
                ROADMAP UPDATED
              </h3>
            </div>
          </div>

          <Badge variant="mastery" icon={Sparkles}>
            Dynamic Reroute Active
          </Badge>
        </div>

        {/* Previous vs Updated Comparison Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Previous Sequence */}
          <div className="bg-[#0B0F19]/80 rounded-xl p-4 border border-[#1E293B]">
            <div className="text-xs font-mono uppercase text-[#64748B] font-semibold mb-2 flex items-center gap-1.5">
              <span>Previous Sequence:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-sm font-mono text-[#94A3B8]">
              <span className="px-2.5 py-1 bg-[#1E293B] rounded border border-[#334155]">
                {previous[0]}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="px-2.5 py-1 bg-[#1E293B] rounded border border-[#334155]">
                {previous[1]}
              </span>
            </div>
          </div>

          {/* Updated Adaptive Sequence */}
          <div className="bg-[#0B0F19]/90 rounded-xl p-4 border border-[#10B981]/40 shadow-[0_0_16px_rgba(16,185,129,0.12)]">
            <div className="text-xs font-mono uppercase text-[#34D399] font-semibold mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Updated Adaptive Sequence:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-sm font-mono">
              <span className="px-2.5 py-1 bg-[#10B981]/20 text-[#34D399] rounded border border-[#10B981]/50 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse">
                {updated[0]}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="px-2.5 py-1 bg-[#1E293B] text-[#F8FAFC] rounded border border-[#334155]">
                {updated[1]}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="px-2.5 py-1 bg-[#1E293B] text-[#94A3B8] rounded border border-[#334155]">
                {updated[2]}
              </span>
            </div>
          </div>
        </div>

        {/* Explain why the roadmap changed */}
        <div className="bg-[#111827]/90 rounded-xl p-4 sm:p-5 border border-[#1E293B] space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#F8FAFC]">
              Why the roadmap changed:
            </span>
            <span className="text-[11px] font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded">
              Prerequisite Gap Optimization
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
