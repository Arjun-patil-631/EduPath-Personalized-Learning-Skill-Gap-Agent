import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { AssessmentQuestionCard } from "../components/assessment/AssessmentQuestionCard.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { LoadingState, ErrorState } from "../components/ui/StateViews.jsx";
import { api } from "../services/api.js";
import { useLearner } from "../hooks/useLearner.js";

export function Assessment() {
  const navigate = useNavigate();
  const { reloadAll } = useLearner();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        const res = await api.getAssessmentQuestions();
        if (res.success) {
          setQuestions(res.data);
          // Pre-populate with default selections for smooth demo experience
          const defaults = {};
          res.data.forEach((q) => {
            const correct = q.options.find((o) => o.correct);
            if (correct) defaults[q.id] = correct.id;
          });
          setSelectedAnswers(defaults);
        }
      } catch (err) {
        setError("Failed to load diagnostic assessment questions.");
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const handleSelectOption = (optionId) => {
    const currentQ = questions[currentIndex];
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await api.submitAssessment(selectedAnswers);
      await reloadAll();
      navigate("/profile");
    } catch (err) {
      setError("Failed to submit diagnostic assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Compiling technical diagnostic questions..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!questions.length) return null;

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Top Meta */}
      <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span className="text-[#0EA5E9] font-semibold">STAGE 03: DIAGNOSTIC BENCHMARK</span>
        </div>
        <span>Step 3 of 4 in Onboarding Loop</span>
      </div>

      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F8FAFC]">
          Initial Technical Competency Assessment
        </h1>
        <p className="text-xs text-[#94A3B8] font-sans">
          This test measures your foundational aptitude across Python vectorization, statistical distributions, machine learning bias-variance, and relational query aggregation.
        </p>
      </div>

      {/* Assessment Question Card */}
      <AssessmentQuestionCard
        question={currentQ}
        selectedOption={selectedAnswers[currentQ.id]}
        onSelectOption={handleSelectOption}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
      />

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E293B]">
        <Button
          variant="ghost"
          size="md"
          icon={ArrowLeft}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Previous Question
        </Button>

        <div className="flex items-center gap-2">
          {isLastQuestion ? (
            <Button
              variant="primary"
              size="lg"
              icon={CheckCircle2}
              loading={submitting}
              onClick={handleSubmit}
              className="shadow-[0_0_20px_rgba(14,165,233,0.3)]"
            >
              Complete Assessment & Generate Profile
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              onClick={handleNext}
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
