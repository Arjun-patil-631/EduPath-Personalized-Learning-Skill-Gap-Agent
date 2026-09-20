import React from "react";
import { AlertTriangle, CheckCircle2, TrendingUp, ArrowDownRight, Zap } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { ProgressBar } from "../ui/ProgressBar.jsx";

export function SkillGapTable({ gaps = [], roleTitle = "Machine Learning Engineer" }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#1E293B] bg-[#161F30]">
      {/* Table Header */}
      <div className="p-5 border-b border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#161F30]/80">
        <div>
          <h3 className="font-display font-semibold text-lg text-[#F8FAFC]">
            Skill Deficit & Target Competency Matrix
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Measured against {roleTitle} industry hiring benchmarks (Current vs Required)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" />
          <span>Current</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F8FAFC] ml-2" />
          <span>Target Benchmark</span>
        </div>
      </div>

      {/* Rows Container */}
      <div className="divide-y divide-[#1E293B]">
        {gaps.map((item) => {
          const isCritical = item.urgency === "critical";
          const isLargest = item.isLargestGap;

          return (
            <div
              key={item.skill}
              className={`p-4 sm:p-5 transition-colors ${
                isLargest
                  ? "bg-[#F59E0B]/5 hover:bg-[#F59E0B]/10"
                  : "hover:bg-[#1E293B]/60"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Skill Name & Badges */}
                <div className="space-y-1.5 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-semibold text-base text-[#F8FAFC]">
                      {item.skill}
                    </span>
                    {isLargest && (
                      <Badge variant="deficit" icon={Zap}>
                        PRIMARY GAP
                      </Badge>
                    )}
                    {isCritical && !isLargest && (
                      <Badge variant="critical">CRITICAL DEFICIT</Badge>
                    )}
                    {item.gap >= 0 && (
                      <Badge variant="mastery" icon={CheckCircle2}>
                        ALIGNED
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs font-mono text-[#64748B] flex items-center gap-2">
                    <span>Target: {item.required}%</span>
                    <span>•</span>
                    <span
                      className={
                        item.gap < 0
                          ? "text-[#FBBF24] font-semibold"
                          : "text-[#34D399] font-semibold"
                      }
                    >
                      Gap: {item.gap > 0 ? `+${item.gap}` : item.gap}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Visual Comparison */}
                <div className="flex-1 max-w-xl">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#94A3B8]">
                      Current Proficiency:{" "}
                      <strong className="text-[#F8FAFC]">{item.current}%</strong>
                    </span>
                    <span className="text-[#64748B]">
                      Goal: <strong className="text-[#F8FAFC]">{item.required}%</strong>
                    </span>
                  </div>
                  <ProgressBar
                    value={item.current}
                    targetValue={item.required}
                    variant={
                      item.current >= item.required
                        ? "emerald"
                        : item.current >= 50
                        ? "cyan"
                        : "amber"
                    }
                    height="h-2.5"
                  />
                </div>

                {/* Status Column */}
                <div className="flex items-center justify-between lg:justify-end gap-3 min-w-[130px]">
                  <div className="text-right">
                    <div className="text-xs font-mono text-[#94A3B8]">Readiness</div>
                    <div className="text-sm font-mono font-bold text-[#F8FAFC]">
                      {item.masteryPercentage}%
                    </div>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.gap >= 0
                        ? "bg-[#10B981]/15 text-[#34D399]"
                        : isCritical
                        ? "bg-[#EF4444]/15 text-[#F87171]"
                        : "bg-[#F59E0B]/15 text-[#FBBF24]"
                    }`}
                  >
                    {item.gap >= 0 ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
