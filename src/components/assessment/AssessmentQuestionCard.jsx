import React from "react";
import { CheckCircle2, Circle, HelpCircle } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";

export function AssessmentQuestionCard({
  question,
  selectedOption,
  onSelectOption,
  showExplanation = false,
  questionNumber,
  totalQuestions,
}) {
  if (!question) return null;

  return (
    <div className="bg-[#161F30] rounded-2xl border border-[#1E293B] p-6 sm:p-7 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <Badge variant="cyan">{question.skill}</Badge>
          <span className="text-xs font-mono text-[#64748B]">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <Badge variant="tag">Single Choice</Badge>
      </div>

      {/* Question Title & Prompt */}
      <div className="space-y-3">
        <h2 className="font-display font-bold text-xl text-[#F8FAFC]">
          {question.title}
        </h2>
        <p className="text-sm text-[#CBD5E1] leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Interactive Options */}
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const isCorrect = opt.correct;

          let optionStyle = "bg-[#111827] border-[#1E293B] hover:border-[#334155] text-[#94A3B8]";
          if (isSelected) {
            optionStyle = "bg-[#0EA5E9]/10 border-[#0EA5E9] text-[#F8FAFC] shadow-[0_0_12px_rgba(14,165,233,0.2)]";
          }
          if (showExplanation && isCorrect) {
            optionStyle = "bg-[#10B981]/15 border-[#10B981] text-[#34D399]";
          } else if (showExplanation && isSelected && !isCorrect) {
            optionStyle = "bg-[#EF4444]/15 border-[#EF4444] text-[#F87171]";
          }

          return (
            <button
              key={opt.id}
              onClick={() => onSelectOption(opt.id)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
            >
              <div className="mt-0.5 shrink-0">
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0EA5E9]" />
                ) : (
                  <Circle className="w-4 h-4 text-[#64748B]" />
                )}
              </div>
              <span className="text-sm font-sans leading-relaxed">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation when submitted or reviewing */}
      {showExplanation && question.explanation && (
        <div className="p-4 bg-[#111827] rounded-xl border border-[#1E293B] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-[#38BDF8] font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Diagnostic Rationale:</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
