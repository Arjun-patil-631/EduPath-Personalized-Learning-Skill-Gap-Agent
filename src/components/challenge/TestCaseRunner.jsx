import React from "react";
import { CheckCircle2, XCircle, Clock, Cpu, Play } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";

export function TestCaseRunner({ testCases = [], isRunning = false, activeTab = "tests" }) {
  return (
    <div className="bg-[#0B0F19] rounded-xl border border-[#1E293B] overflow-hidden">
      {/* Test runner top bar */}
      <div className="px-4 py-2.5 bg-[#111827] border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <Cpu className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span>Test Suite Verification Matrix</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="cyan">5 / 5 Assertions</Badge>
        </div>
      </div>

      {/* Test cases list */}
      <div className="p-3 divide-y divide-[#1E293B]/60 space-y-2">
        {testCases.map((tc, idx) => (
          <div key={tc.id || idx} className="pt-2 first:pt-0">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <div className="flex items-center gap-2">
                {tc.status === "passed" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                ) : (
                  <XCircle className="w-4 h-4 text-[#EF4444]" />
                )}
                <span className="text-[#F8FAFC] font-semibold">{tc.name}</span>
              </div>
              <span className="text-[#64748B] flex items-center gap-1">
                <Clock className="w-3 h-3" /> {tc.latency}
              </span>
            </div>

            <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-[#94A3B8] bg-[#161F30]/50 p-2 rounded border border-[#1E293B]/40">
              <div>
                <span className="text-[#64748B]">Input: </span>
                <span className="text-[#38BDF8]">{tc.input}</span>
              </div>
              <div>
                <span className="text-[#64748B]">Expected: </span>
                <span className="text-[#34D399]">{tc.expectedOutput}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
