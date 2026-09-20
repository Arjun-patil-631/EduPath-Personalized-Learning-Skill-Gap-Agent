import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, CheckCircle2, TrendingUp, DollarSign, Layers } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { TARGET_ROLES } from "../data/mockData.js";
import { useLearner } from "../hooks/useLearner.js";

export function CareerGoal() {
  const navigate = useNavigate();
  const { selectTargetRole } = useLearner();
  const [selectedRoleId, setSelectedRoleId] = useState("mle"); // Default: Machine Learning Engineer

  const currentRole = TARGET_ROLES.find((r) => r.id === selectedRoleId) || TARGET_ROLES[0];

  const handleConfirmRole = async () => {
    await selectTargetRole(selectedRoleId);
    navigate("/skill-gap");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pb-4 border-b border-[#1E293B]">
        <span className="text-[#0EA5E9] font-semibold">STAGE 03: TARGET CAREER SPECIFICATION</span>
        <span>Step 3 of 5: Calibration → Profile → Target Career → Skill Gap → Adaptive Roadmap</span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <Badge variant="cyan" icon={Briefcase}>
          Target Role Selection
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#F8FAFC]">
          Select Your Target Career Objective
        </h1>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Your personalized skill gap matrix and dynamic curriculum mutations will be calculated specifically against the hiring expectations of this role.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TARGET_ROLES.map((role) => {
          const isSelected = selectedRoleId === role.id;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#161F30] border-[#0EA5E9] ring-1 ring-[#0EA5E9]/50 shadow-[0_0_24px_rgba(14,165,233,0.2)]"
                  : "bg-[#111827] border-[#1E293B] hover:border-[#334155] opacity-80"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={isSelected ? "cyan" : "tag"}>{role.level}</Badge>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-[#0EA5E9]" />
                  )}
                </div>
                <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
                  {role.title}
                </h3>
                <div className="text-xs font-mono text-[#34D399] font-semibold">
                  {role.averageSalary}
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] mt-3 line-clamp-2">
                {role.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* In-depth Role Specification Card */}
      <Card
        title={`${currentRole.title} Competency Benchmark`}
        subtitle="Hiring threshold vectors configured for sample evaluation"
        icon={Layers}
      >
        <div className="space-y-6">
          {/* Key details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-[#111827] p-3.5 rounded-xl border border-[#1E293B]">
              <span className="text-[#64748B]">Demand Index</span>
              <div className="text-sm font-bold text-[#38BDF8] mt-0.5">
                {currentRole.demandIndex} (High Growth)
              </div>
            </div>
            <div className="bg-[#111827] p-3.5 rounded-xl border border-[#1E293B]">
              <span className="text-[#64748B]">Median Base Compensation</span>
              <div className="text-sm font-bold text-[#34D399] mt-0.5">
                {currentRole.averageSalary}
              </div>
            </div>
            <div className="bg-[#111827] p-3.5 rounded-xl border border-[#1E293B]">
              <span className="text-[#64748B]">Benchmark Evaluator</span>
              <div className="text-sm font-bold text-[#F8FAFC] mt-0.5">
                FastAPI Diagnostic Suite
              </div>
            </div>
          </div>

          {/* Required Skills Matrix breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-[#F8FAFC] font-semibold">
              Minimum Competency Thresholds (% Target)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(currentRole.requiredSkills).map(([skill, benchmark]) => (
                <div
                  key={skill}
                  className="bg-[#111827] p-3 rounded-xl border border-[#1E293B] flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-[#CBD5E1]">{skill}</span>
                  <span className="text-xs font-mono font-bold text-[#0EA5E9]">
                    {benchmark}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Competencies list */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-[#F8FAFC] font-semibold">
              Key Role Expectations
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#94A3B8]">
              {currentRole.keyCompetencies.map((comp, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* CTA Bottom Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E293B]">
        <Button variant="ghost" onClick={() => navigate("/profile")}>
          Back to Profile
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={ArrowRight}
          onClick={handleConfirmRole}
        >
          Confirm Role & Analyze Skill Gaps
        </Button>
      </div>
    </div>
  );
}
