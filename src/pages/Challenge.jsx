import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Zap, ArrowLeft, Terminal, AlertCircle } from "lucide-react";
import { ChallengeWorkspace } from "../components/challenge/ChallengeWorkspace.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { LoadingState, ErrorState } from "../components/ui/StateViews.jsx";
import { api } from "../services/api.js";
import { useLearner } from "../hooks/useLearner.js";

export function Challenge() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get("id") || "act_prob_771";

  const { completeChallenge } = useLearner();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadChallenge() {
      try {
        setLoading(true);
        const res = await api.getChallenge(challengeId);
        if (res.success) {
          setChallenge(res.data);
        }
      } catch (err) {
        setError("Failed to initialize challenge workspace specification.");
      } finally {
        setLoading(false);
      }
    }
    loadChallenge();
  }, [challengeId]);

  const handleSubmitSolution = async (code) => {
    try {
      setSubmitting(true);
      const res = await completeChallenge(challengeId, code);
      if (res.success) {
        navigate("/evaluation");
      }
    } catch (err) {
      setError("Evaluation execution encountered an error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Instantiating sandboxed Python evaluation kernel..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!challenge) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-2">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pb-3 border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate("/roadmap")}
          >
            Roadmap
          </Button>
          <span className="text-[#334155]">/</span>
          <span className="text-[#0EA5E9] font-semibold">Active Technical Challenge</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" icon={Terminal}>
            FastAPI Runner Emulation
          </Badge>
        </div>
      </div>

      {/* Challenge Workspace Component */}
      <ChallengeWorkspace
        challenge={challenge}
        onSubmit={handleSubmitSolution}
        isSubmitting={submitting}
      />
    </div>
  );
}
