import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api.js";

const LearnerContext = createContext(null);

export function LearnerProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [skillGapData, setSkillGapData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [nextAction, setNextAction] = useState(null);
  const [learningPlan, setLearningPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reloadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [profRes, gapRes, roadRes, actRes, planRes] = await Promise.all([
        api.getLearnerProfile(),
        api.getSkillGapAnalysis(),
        api.getRoadmap(),
        api.getNextBestAction(),
        api.getLatestLearningPlan(),
      ]);

      if (profRes.success) setProfile(profRes.data);
      if (gapRes.success) setSkillGapData(gapRes.data);
      if (roadRes.success) setRoadmapData(roadRes.data);
      if (actRes.success) setNextAction(actRes.data);
      if (planRes && planRes.success) setLearningPlan(planRes.data);
    } catch (err) {
      console.error("Failed loading learner data:", err);
      setError("Unable to synchronize learner intelligence state.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadAll();
  }, [reloadAll]);

  const selectTargetRole = async (roleId) => {
    const res = await api.setTargetRole(roleId);
    if (res.success) {
      await reloadAll();
    }
    return res;
  };

  const completeChallenge = async (challengeId, code) => {
    const evalResult = await api.submitChallenge(challengeId, code);
    if (evalResult.success) {
      await reloadAll();
    }
    return evalResult;
  };

  const updateProfile = async (updates) => {
    const res = await api.updateLearnerProfile(updates);
    if (res.success) {
      await reloadAll();
    }
    return res;
  };

  const resetDemo = async () => {
    await api.resetDemoState();
    await reloadAll();
  };

  const value = {
    profile,
    skillGapData,
    roadmapData,
    nextAction,
    learningPlan,
    loading,
    error,
    reloadAll,
    updateProfile,
    selectTargetRole,
    completeChallenge,
    resetDemo,
  };

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

export function useLearner() {
  const context = useContext(LearnerContext);
  if (!context) {
    throw new Error("useLearner must be used within a LearnerProvider");
  }
  return context;
}
