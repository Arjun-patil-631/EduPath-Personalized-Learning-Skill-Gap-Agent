import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  GitBranch,
  Target,
  Zap,
  Terminal,
  Activity,
  Layers,
  Cpu,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Card } from "../components/ui/Card.jsx";
import { TARGET_ROLES } from "../data/mockData.js";

export function Landing() {
  const navigate = useNavigate();

  const loopSteps = [
    { title: "Assessment", desc: "Diagnostic testing of core competencies" },
    { title: "Learner Profile", desc: "Vectorized baseline skill measurements" },
    { title: "Target Role", desc: "Targeting ML Engineer hiring thresholds" },
    { title: "Skill Gap", desc: "Deficit calculation vs industry expectations" },
    { title: "Personalized Roadmap", desc: "Milestone curriculum mapped to gaps" },
    { title: "Next Best Action", desc: "High-leverage micro-challenges" },
    { title: "Challenge", desc: "Hands-on code execution & test cases" },
    { title: "Evaluation", desc: "Instant telemetry & automated feedback" },
    { title: "Skill Update", desc: "Dynamic mastery recalculation" },
    { title: "Adaptive Roadmap", desc: "Curriculum mutation & prerequisite reroute" },
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161F30] border border-[#0EA5E9]/30 text-xs font-mono text-[#38BDF8]">
          <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span>ADAPTIVE CAREER ACCELERATION ENGINE</span>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-[#F8FAFC] tracking-tight leading-[1.15]">
            Engineering Career Mastery, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#10B981]">
              Dynamically Adapted to Your Skill Gaps
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] font-sans leading-relaxed max-w-2xl mx-auto">
            EduPath assesses your technical proficiency, benchmarks deficits against real-world roles like Machine Learning Engineer, and dynamically mutates your roadmap upon every completed challenge.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            onClick={() => navigate("/onboarding")}
            className="w-full sm:w-auto shadow-[0_0_24px_rgba(14,165,233,0.4)]"
          >
            Start Learner Calibration
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={Terminal}
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto"
          >
            Jump to Active Dashboard
          </Button>
        </div>

        {/* Live Sample Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 text-left">
          <div className="bg-[#161F30] p-4 rounded-xl border border-[#1E293B]">
            <div className="text-xs font-mono text-[#64748B]">Target Archetype</div>
            <div className="text-sm font-mono font-bold text-[#F8FAFC] mt-0.5">ML Engineer</div>
          </div>
          <div className="bg-[#161F30] p-4 rounded-xl border border-[#1E293B]">
            <div className="text-xs font-mono text-[#64748B]">Sample Baseline</div>
            <div className="text-sm font-mono font-bold text-[#FBBF24] mt-0.5">Stats: 42%</div>
          </div>
          <div className="bg-[#161F30] p-4 rounded-xl border border-[#1E293B]">
            <div className="text-xs font-mono text-[#64748B]">Adaptive Delta</div>
            <div className="text-sm font-mono font-bold text-[#34D399] mt-0.5">42% → 67%</div>
          </div>
          <div className="bg-[#161F30] p-4 rounded-xl border border-[#1E293B]">
            <div className="text-xs font-mono text-[#64748B]">Curriculum Reroute</div>
            <div className="text-sm font-mono font-bold text-[#0EA5E9] mt-0.5">Instant Mutate</div>
          </div>
        </div>
      </section>

      {/* Core Product Loop Visualizer */}
      <section className="bg-[#161F30] rounded-2xl border border-[#1E293B] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#0EA5E9] font-bold">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="font-display font-bold text-2xl text-[#F8FAFC] mt-1">
              The 10-Step Adaptive Product Loop
            </h2>
          </div>
          <Badge variant="cyan" icon={Activity}>
            Self-Correcting Cycle
          </Badge>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {loopSteps.map((step, idx) => (
            <div
              key={step.title}
              className="bg-[#111827] rounded-xl p-4 border border-[#1E293B] hover:border-[#334155] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#0EA5E9]">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  {idx === 5 ? (
                    <span className="text-[10px] font-mono text-[#FBBF24] bg-[#F59E0B]/15 px-1.5 py-0.5 rounded">
                      Core Action
                    </span>
                  ) : idx === 9 ? (
                    <span className="text-[10px] font-mono text-[#34D399] bg-[#10B981]/15 px-1.5 py-0.5 rounded">
                      Adaptive
                    </span>
                  ) : null}
                </div>
                <h3 className="font-display font-semibold text-sm text-[#F8FAFC]">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Target Career Roles Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F8FAFC]">
            Target Career Benchmarks
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto">
            Calibrated against engineering hiring standards and competency distributions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TARGET_ROLES.map((role) => (
            <Card
              key={role.id}
              hoverable
              className="flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="cyan">{role.level}</Badge>
                  <span className="text-xs font-mono text-[#34D399] font-semibold">
                    {role.averageSalary}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-[#F8FAFC]">
                  {role.title}
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1E293B] space-y-3">
                <div className="text-xs font-mono text-[#64748B]">Benchmark Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(role.requiredSkills).slice(0, 4).map(([skill, req]) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-[#111827] text-[#94A3B8] rounded text-[11px] font-mono border border-[#1E293B]"
                    >
                      {skill}: {req}%
                    </span>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => navigate("/career-goal")}
                >
                  Configure This Target
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
