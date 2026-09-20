import React from "react";
import { CheckCircle2, Lock, Sparkles, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";

export function RoadmapTimeline({ roadmapData, onSelectNode }) {
  if (!roadmapData || !roadmapData.stages) return null;

  return (
    <div className="space-y-8">
      {roadmapData.stages.map((stage, stageIdx) => (
        <div
          key={stage.id}
          className="bg-[#161F30] rounded-2xl border border-[#1E293B] p-5 sm:p-7 space-y-5"
        >
          {/* Stage Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1E293B]">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center font-mono text-xs font-bold text-[#0EA5E9]">
                0{stageIdx + 1}
              </span>
              <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
                {stage.name}
              </h3>
            </div>
            <Badge
              variant={
                stage.status === "completed"
                  ? "mastery"
                  : stage.status === "in_progress"
                  ? "cyan"
                  : "tag"
              }
            >
              {stage.status === "completed"
                ? "Stage Completed"
                : stage.status === "in_progress"
                ? "Active Stage"
                : "Prerequisites Required"}
            </Badge>
          </div>

          {/* Stage Nodes Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stage.nodes.map((node) => {
              const isCompleted = node.status === "completed";
              const isAdaptive = node.isAdaptiveInsert;
              const isInProgress = node.status === "in_progress" || node.status === "recommended";
              const isLocked = node.status === "locked" || node.status === "upcoming";

              return (
                <div
                  key={node.id}
                  onClick={() => onSelectNode && onSelectNode(node)}
                  className={`relative rounded-xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                    isAdaptive
                      ? "bg-gradient-to-b from-[#10B981]/15 to-[#161F30] border-[#10B981]/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-[#10B981]/30"
                      : isCompleted
                      ? "bg-[#111827] border-[#10B981]/30 hover:border-[#10B981]/50"
                      : isInProgress
                      ? "bg-[#1E293B]/70 border-[#0EA5E9]/40 hover:border-[#0EA5E9] shadow-[0_0_16px_rgba(14,165,233,0.1)]"
                      : "bg-[#0B0F19]/60 border-[#1E293B] opacity-60"
                  }`}
                >
                  {/* Top node badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-[#94A3B8]">{node.skill}</span>
                    {isAdaptive ? (
                      <Badge variant="mastery" icon={Sparkles}>
                        Adaptive Insert
                      </Badge>
                    ) : isCompleted ? (
                      <Badge variant="mastery" icon={CheckCircle2}>
                        Mastered
                      </Badge>
                    ) : isInProgress ? (
                      <Badge variant="cyan">In Progress</Badge>
                    ) : (
                      <Badge variant="tag" icon={Lock}>
                        Locked
                      </Badge>
                    )}
                  </div>

                  {/* Node Title & Description */}
                  <div className="space-y-1.5 mb-4">
                    <h4 className="font-display font-semibold text-base text-[#F8FAFC]">
                      {node.title}
                    </h4>
                    {node.description && (
                      <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                        {node.description}
                      </p>
                    )}
                  </div>

                  {/* Node Footer Metadata */}
                  <div className="pt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-xs font-mono text-[#64748B]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{node.duration}</span>
                    </div>

                    {node.score !== null && node.score !== undefined ? (
                      <span
                        className={`font-semibold ${
                          node.score >= 70
                            ? "text-[#34D399]"
                            : node.score >= 50
                            ? "text-[#38BDF8]"
                            : "text-[#FBBF24]"
                        }`}
                      >
                        Score: {node.score}%
                      </span>
                    ) : isAdaptive ? (
                      <span className="text-[#34D399] font-semibold">Priority Lab</span>
                    ) : (
                      <span>Prerequisite</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
