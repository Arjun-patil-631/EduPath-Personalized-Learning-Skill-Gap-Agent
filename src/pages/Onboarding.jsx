import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UserCheck, GraduationCap, Clock, Code, Sparkles } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { useLearner } from "../hooks/useLearner.js";

export function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useLearner();

  const [education, setEducation] = useState("B.S. Computer Science");
  const [experienceLevel, setExperienceLevel] = useState("Early Career (1-2 yrs)");
  const [learningStyle, setLearningStyle] = useState("Hands-on Challenges & Code-first");
  const [weeklyHours, setWeeklyHours] = useState(12);

  const handleNext = async () => {
    if (updateProfile) {
      await updateProfile({
        education,
        experienceLevel,
        learningStyle,
        weeklyCommitmentHours: weeklyHours,
      });
    }
    navigate("/profile");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pb-4 border-b border-[#1E293B]">
        <span className="text-[#0EA5E9] font-semibold">STAGE 01: LEARNER CALIBRATION</span>
        <span>Step 1 of 5: Calibration → Profile → Target Career → Skill Gap → Adaptive Roadmap</span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <Badge variant="cyan" icon={UserCheck}>
          Learner Profile Calibration
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#F8FAFC]">
          Initialize Your Technical Baseline
        </h1>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          EduPath tailors each roadmap calculation to your weekly availability, educational context, and hands-on code preferences.
        </p>
      </div>

      {/* Configuration Form */}
      <div className="space-y-6">
        {/* Education Background */}
        <Card title="Academic or Engineering Background" icon={GraduationCap}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "B.S. Computer Science",
              "B.S. Electrical / Data Engineering",
              "Coding Bootcamp Graduate",
              "Mathematics or Statistics Degree",
              "Self-Taught / Practicing Engineer",
            ].map((edu) => (
              <button
                key={edu}
                type="button"
                onClick={() => setEducation(edu)}
                className={`p-3.5 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                  education === edu
                    ? "bg-[#0EA5E9]/15 border-[#0EA5E9] text-[#F8FAFC] shadow-[0_0_12px_rgba(14,165,233,0.2)]"
                    : "bg-[#111827] border-[#1E293B] text-[#94A3B8] hover:border-[#334155]"
                }`}
              >
                {edu}
              </button>
            ))}
          </div>
        </Card>

        {/* Experience Level */}
        <Card title="Current Technical Experience Level" icon={Code}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Student / Transitioning", desc: "No professional software role yet" },
              { label: "Early Career (1-2 yrs)", desc: "Junior engineer or analyst" },
              { label: "Mid Career (3+ yrs)", desc: "Software engineer pivoting to AI/ML" },
            ].map((exp) => (
              <button
                key={exp.label}
                type="button"
                onClick={() => setExperienceLevel(exp.label)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  experienceLevel === exp.label
                    ? "bg-[#0EA5E9]/15 border-[#0EA5E9] text-[#F8FAFC] shadow-[0_0_12px_rgba(14,165,233,0.2)]"
                    : "bg-[#111827] border-[#1E293B] text-[#94A3B8] hover:border-[#334155]"
                }`}
              >
                <div className="text-xs font-mono font-bold text-[#F8FAFC] mb-1">
                  {exp.label}
                </div>
                <div className="text-[11px] text-[#64748B]">{exp.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Weekly Time Commitment */}
        <Card title="Weekly Time Commitment" icon={Clock}>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#94A3B8]">Dedicated Learning Hours:</span>
              <span className="text-[#0EA5E9] font-bold text-base">{weeklyHours} Hours / Week</span>
            </div>
            <input
              type="range"
              min="4"
              max="30"
              step="2"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full h-2 bg-[#111827] rounded-lg appearance-none cursor-pointer accent-[#0EA5E9]"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#64748B]">
              <span>4 hrs (Light)</span>
              <span>12 hrs (Recommended)</span>
              <span>30 hrs (Accelerated Bootcamp)</span>
            </div>
          </div>
        </Card>

        {/* Continue Action */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1E293B]">
          <span className="text-xs font-mono text-[#64748B]">
            Sample user Alex Chen will be initialized with baseline competencies.
          </span>
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            onClick={handleNext}
          >
            Generate Learner Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
