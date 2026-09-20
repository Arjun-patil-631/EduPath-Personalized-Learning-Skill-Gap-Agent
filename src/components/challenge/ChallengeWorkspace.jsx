import React, { useState, useEffect } from "react";
import { Play, CheckCircle2, RotateCcw, Clock, AlertTriangle, Code, Terminal, Sparkles, Send } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";
import { TestCaseRunner } from "./TestCaseRunner.jsx";

export function ChallengeWorkspace({ challenge, onSubmit, isSubmitting = false }) {
  const [code, setCode] = useState(challenge?.starterCode || "");
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' | 'tests'
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60); // 25 min timer
  const [testResults, setTestResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    if (challenge?.starterCode) {
      setCode(challenge.starterCode);
    }
  }, [challenge]);

  // 25-minute countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
      setTestResults(challenge?.testCases || []);
      setActiveTab("tests");
    }, 450);
  };

  const handleResetCode = () => {
    if (challenge?.starterCode) {
      setCode(challenge.starterCode);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(code);
    }
  };

  if (!challenge) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Problem Briefing & Context (5 cols) */}
      <div className="lg:col-span-5 space-y-5">
        {/* Challenge Header Card */}
        <div className="bg-[#161F30] rounded-2xl border border-[#1E293B] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="cyan" icon={Terminal}>
              PYTHON 3.12 / NUMPY
            </Badge>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#FBBF24] bg-[#F59E0B]/10 px-2.5 py-1 rounded-full border border-[#F59E0B]/30">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(secondsRemaining)} remaining</span>
            </div>
          </div>

          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[#F8FAFC]">
              {challenge.title}
            </h1>
            <p className="text-xs font-mono text-[#0EA5E9] mt-1">
              Category: {challenge.category}
            </p>
          </div>

          {/* Explicit Why Banner */}
          <div className="bg-[#0B0F19] rounded-xl p-3.5 border border-[#F59E0B]/30 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded bg-[#F59E0B]/20 flex items-center justify-center text-[#FBBF24] shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3" />
              </div>
              <div>
                <span className="font-mono text-[#FBBF24] uppercase font-bold tracking-wider text-[11px] block">
                  Adaptive Reason:
                </span>
                <p className="text-[#F8FAFC] mt-0.5 leading-relaxed font-medium">
                  Probability is currently one of the learner's largest skill gaps for the selected role.
                </p>
              </div>
            </div>
          </div>

          {/* Scenario formulation */}
          <div className="space-y-2 text-sm text-[#94A3B8] leading-relaxed">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#F8FAFC] font-semibold">
              Scenario Description
            </h3>
            <p className="text-xs text-[#CBD5E1]">{challenge.scenario}</p>
          </div>

          {/* Mathematical Grounding */}
          <div className="bg-[#111827] rounded-xl p-3.5 border border-[#1E293B] space-y-1.5">
            <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
              Bayesian Formulation Reference
            </span>
            <div className="font-mono text-xs text-[#38BDF8] bg-[#0B0F19] p-2.5 rounded border border-[#1E293B]">
              P(Anomaly | Signal) = [P(Signal | Anomaly) * P(Anomaly)] / P(Signal)
            </div>
          </div>

          {/* Instructions List */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#F8FAFC] font-semibold">
              Task Checklist
            </h3>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              {challenge.instructions.map((inst, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded bg-[#1E293B] text-[#0EA5E9] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column: Code Editor & Test Runner (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-[#161F30] rounded-2xl border border-[#1E293B] overflow-hidden shadow-[0_8px_24px_-4px_rgba(2,6,23,0.6)]">
          {/* Editor Tabs & Controls */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("editor")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activeTab === "editor"
                    ? "bg-[#161F30] text-[#0EA5E9] border border-[#334155] font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>solution.py</span>
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activeTab === "tests"
                    ? "bg-[#161F30] text-[#0EA5E9] border border-[#334155] font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Test Cases (5)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                title="Reset starter template"
                className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] rounded hover:bg-[#1E293B] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <Button
                variant="secondary"
                size="sm"
                icon={Play}
                loading={isRunningTests}
                onClick={handleRunTests}
              >
                Run Tests
              </Button>
            </div>
          </div>

          {/* Active View: Code Editor */}
          {activeTab === "editor" && (
            <div className="relative bg-[#0B0F19] min-h-[420px] font-mono text-xs text-[#F8FAFC]">
              {/* Fake line numbers + editor area */}
              <div className="flex">
                <div className="py-4 pl-3 pr-2 select-none text-[#475569] text-right font-mono text-[11px] leading-6 border-r border-[#1E293B]/60 min-w-[38px]">
                  {code.split("\n").map((_, idx) => (
                    <div key={idx}>{idx + 1}</div>
                  ))}
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full min-h-[420px] p-4 bg-transparent text-[#F8FAFC] font-mono text-xs leading-6 resize-none focus:outline-none selection:bg-[#0EA5E9]/30"
                  spellCheck={false}
                  placeholder="# Write your Python solution here..."
                />
              </div>
            </div>
          )}

          {/* Active View: Test Cases */}
          {activeTab === "tests" && (
            <div className="p-4 bg-[#0B0F19] min-h-[420px]">
              <TestCaseRunner
                testCases={testResults || challenge.testCases}
                isRunning={isRunningTests}
              />
            </div>
          )}

          {/* Bottom Execution Bar */}
          <div className="p-4 bg-[#111827] border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>FastAPI Test Harness Ready (NumPy 1.26.4 / Python 3.12)</span>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={Send}
              loading={isSubmitting}
              onClick={handleSubmit}
              className="w-full sm:w-auto"
            >
              Submit & Evaluate Solution
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
