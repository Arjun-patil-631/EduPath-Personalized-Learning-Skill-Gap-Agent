import React from "react";
import { CheckCircle2, Terminal, Clock, Sparkles } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";

export function RecentActivityFeed({ challengeCompleted }) {
  const activities = [
    ...(challengeCompleted
      ? [
          {
            id: "act_prob",
            title: "Probability Challenge Completed",
            skill: "Statistics",
            delta: "+25% (42% → 67%)",
            timestamp: "Just now",
            type: "challenge",
            isHighlight: true,
          },
        ]
      : []),
    {
      id: "act_diag",
      title: "Diagnostic Assessment Completed",
      skill: "Baseline Profile Vectorized",
      delta: "6 Skill Axes Measured",
      timestamp: "Today",
      type: "assessment",
      isHighlight: false,
    },
    {
      id: "act_py",
      title: "Vectorized Python & Matrix Operations",
      skill: "Python",
      delta: "Mastery: 78%",
      timestamp: "Yesterday",
      type: "module",
      isHighlight: false,
    },
    {
      id: "act_sql",
      title: "SQL Relational Aggregate Check",
      skill: "SQL",
      delta: "Mastery: 54%",
      timestamp: "3 days ago",
      type: "module",
      isHighlight: false,
    },
  ];

  return (
    <Card title="Telemetry Activity Feed" subtitle="Continuous evaluation ledger">
      <div className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
              item.isHighlight
                ? "bg-[#10B981]/10 border-[#10B981]/30 shadow-[0_0_16px_rgba(16,185,129,0.15)]"
                : "bg-[#111827] border-[#1E293B] hover:border-[#334155]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.isHighlight
                    ? "bg-[#10B981]/20 text-[#34D399]"
                    : "bg-[#1E293B] text-[#0EA5E9]"
                }`}
              >
                {item.isHighlight ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F8FAFC]">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#94A3B8] font-mono">{item.skill}</span>
                  <span className="text-[10px] text-[#64748B]">•</span>
                  <span className="text-[11px] text-[#64748B] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.timestamp}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <Badge variant={item.isHighlight ? "mastery" : "cyan"}>
                {item.delta}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
