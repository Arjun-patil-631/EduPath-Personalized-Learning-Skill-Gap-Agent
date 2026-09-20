/**
 * EduPath API Client Service
 * Designed for immediate mock operation and clean Python FastAPI transition.
 * 
 * When connecting to FastAPI:
 * - Set USE_MOCK = false
 * - All response structures strictly match FastAPI / Pydantic schemas.
 */

import {
  INITIAL_LEARNER_PROFILE,
  TARGET_ROLES,
  DIAGNOSTIC_ASSESSMENT_QUESTIONS,
  NEXT_BEST_ACTION_DATA,
  PROBABILITY_CHALLENGE_DETAILS,
  SGD_CHALLENGE_DETAILS,
  EVALUATION_RESULT_DATA,
  ROADMAP_DATA,
} from "../data/mockData.js";

const USE_MOCK = false;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// In-memory reactive state for mock mode session
let sessionState = {
  profile: { ...INITIAL_LEARNER_PROFILE },
  targetRoles: [...TARGET_ROLES],
  currentRole: TARGET_ROLES[0],
  challengeCompleted: false,
  roadmapAdaptiveUpdated: false,
  lastEvaluation: null,
};

// Storage sync for seamless experience across page reloads
const STORAGE_KEY = "edupath_learner_session";
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    sessionState = { ...sessionState, ...parsed };
  }
} catch (e) {
  console.warn("Storage sync failed, using default state", e);
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionState));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

// Simulated network latency to reflect realistic FastAPI roundtrip
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  /**
   * Fetch current learner profile and baseline skills
   * FastAPI: GET /api/v1/learner/profile
   */
  async getLearnerProfile() {
    if (USE_MOCK) {
      await delay(120);
      return {
        success: true,
        data: sessionState.profile,
      };
    }

    const res = await fetch(`${API_BASE_URL}/v1/learner/profile`);
    return await res.json();
  },

  /**
   * Update learner profile calibration parameters
   * FastAPI: PUT /api/v1/learner/profile
   */
  async updateLearnerProfile(updates) {
    if (USE_MOCK) {
      await delay(120);
      sessionState.profile = {
        ...sessionState.profile,
        ...updates,
      };
      persistState();
      return {
        success: true,
        data: sessionState.profile,
      };
    }

    const res = await fetch(`${API_BASE_URL}/v1/learner/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return await res.json();
  },

  /**
   * Fetch all target roles & competency benchmarks
   * FastAPI: GET /api/v1/roles
   */
  async getTargetRoles() {
    if (USE_MOCK) {
      await delay(100);
      return {
        success: true,
        data: sessionState.targetRoles,
      };
    }

    const res = await fetch(`${API_BASE_URL}/v1/roles`);
    return await res.json();
  },

  /**
   * Set or update active target career role
   * FastAPI: PUT /api/v1/learner/target-role
   */
  async setTargetRole(roleId) {
    if (USE_MOCK) {
      await delay(150);
      const role = sessionState.targetRoles.find((r) => r.id === roleId) || sessionState.targetRoles[0];
      sessionState.currentRole = role;
      sessionState.profile.targetRole = {
        id: role.id,
        title: role.title,
        department: "Applied AI & Intelligence",
        medianSalary: role.averageSalary,
        marketDemand: `Demand ${role.demandIndex}`,
        description: role.description,
      };
      persistState();
      return { success: true, data: sessionState.profile };
    }

    const res = await fetch(`${API_BASE_URL}/v1/learner/target-role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleId }),
    });
    return await res.json();
  },

  /**
   * Compute skill gap matrix between current skills and target role requirements
   * FastAPI: GET /api/v1/skills/gap-analysis
   */
  async getSkillGapAnalysis() {
    if (USE_MOCK) {
      await delay(140);
      const role = sessionState.currentRole || TARGET_ROLES[0];
      const currentSkills = sessionState.profile.currentSkills;
      const requiredSkills = role.requiredSkills;

      const gaps = Object.keys(requiredSkills).map((skillName) => {
        const current = currentSkills[skillName] || 0;
        const required = requiredSkills[skillName] || 0;
        const gap = current - required; // negative indicates deficit
        const deficitPercent = Math.max(0, required - current);
        const masteryPercentage = Math.min(100, Math.round((current / required) * 100));

        let urgency = "aligned";
        if (deficitPercent >= 30) urgency = "critical";
        else if (deficitPercent >= 15) urgency = "moderate";
        else if (deficitPercent > 0) urgency = "minor";

        return {
          skill: skillName,
          current,
          required,
          gap,
          deficitPercent,
          masteryPercentage,
          urgency,
          isLargestGap: skillName === "Statistics" && current < 60,
        };
      });

      // Sort by largest deficit first
      gaps.sort((a, b) => a.gap - b.gap);

      const totalRequired = Object.values(requiredSkills).reduce((a, b) => a + b, 0);
      const totalCurrent = Object.keys(requiredSkills).reduce(
        (sum, k) => sum + Math.min(requiredSkills[k], currentSkills[k] || 0),
        0
      );
      const roleReadiness = Math.round((totalCurrent / totalRequired) * 100);

      sessionState.profile.roleReadiness = roleReadiness;
      persistState();

      return {
        success: true,
        data: {
          roleTitle: role.title,
          roleReadiness,
          gaps,
          criticalGapsCount: gaps.filter((g) => g.urgency === "critical").length,
          topPriorityGap: "Statistics",
        },
      };
    }

    const res = await fetch(`${API_BASE_URL}/v1/skills/gap-analysis`);
    return await res.json();
  },

  /**
   * Fetch personalized curriculum roadmap
   * FastAPI: GET /api/v1/roadmap
   */
  async getRoadmap() {
    if (USE_MOCK) {
      await delay(150);
      const isUpdated = sessionState.challengeCompleted || sessionState.roadmapAdaptiveUpdated;

      // Deep clone roadmap data to apply adaptive state dynamically
      const roadmapCopy = JSON.parse(JSON.stringify(ROADMAP_DATA));

      if (isUpdated) {
        // Updated state: Statistics updated to 67%, Probability Practice shown as inserted
        roadmapCopy.stages[0].nodes = [
          {
            id: "node_python",
            title: "Vectorized Python & Matrix Operations",
            skill: "Python",
            status: "completed",
            score: 78,
            duration: "2 weeks",
          },
          {
            id: "node_prob_practice",
            title: "Probability Practice",
            skill: "Statistics",
            status: "recommended",
            isAdaptiveInsert: true,
            score: null,
            duration: "1 week",
            tag: "Adaptive Insert",
            description: "Targeted drill on joint distributions, marginal likelihoods, and Bayesian decision rules.",
          },
          {
            id: "node_stats",
            title: "Applied Statistics & Hypothesis Testing",
            skill: "Statistics",
            status: "in_progress",
            score: 67, // updated!
            duration: "3 weeks",
            description: "Hypothesis testing, maximum likelihood estimation (MLE), and confidence intervals for model validation.",
          },
        ];
      } else {
        // Previous sequence before challenge: Statistics → Machine Learning (without Probability Practice inserted)
        roadmapCopy.stages[0].nodes = [
          {
            id: "node_python",
            title: "Vectorized Python & Matrix Operations",
            skill: "Python",
            status: "completed",
            score: 78,
            duration: "2 weeks",
          },
          {
            id: "node_stats",
            title: "Applied Statistics & Hypothesis Testing",
            skill: "Statistics",
            status: "in_progress",
            score: 42, // baseline before challenge
            duration: "3 weeks",
            description: "Hypothesis testing, maximum likelihood estimation (MLE), and confidence intervals for model validation.",
          },
        ];
      }

      return {
        success: true,
        data: {
          ...roadmapCopy,
          isAdaptiveUpdated: isUpdated,
          activeStage: "Stage 1",
        },
      };
    }

    const res = await fetch(`${API_BASE_URL}/v1/roadmap`);
    return await res.json();
  },

  /**
   * Fetch Next Best Action (Highest leverage intervention)
   * FastAPI: GET /api/v1/recommendations/next-best-action
   */
  async getNextBestAction() {
    if (USE_MOCK) {
      await delay(100);
      const isCompleted = sessionState.challengeCompleted;

      if (isCompleted) {
        return {
          success: true,
          data: {
            id: "act_ml_loss_882",
            title: "Loss Function Derivatives & SGD Lab",
            module: "Core Machine Learning",
            durationMinutes: 30,
            difficulty: "Intermediate",
            targetSkill: "Machine Learning",
            currentSkillScore: 55,
            projectedSkillScore: 72,
            xpAward: 400,
            why: "With Statistics reinforced to 67%, you now have the required foundation to derive loss gradients without conceptual regressions.",
            impactSummary: "Unlocks Milestone 2: Neural Gradient Solvers.",
            isFollowUp: true,
          },
        };
      }

      return {
        success: true,
        data: {
          ...NEXT_BEST_ACTION_DATA,
          currentSkillScore: sessionState.profile.currentSkills.Statistics,
        },
      };
    }

    const res = await fetch(`${API_BASE_URL}/v1/recommendations/next-best-action`);
    return await res.json();
  },

  /**
   * Fetch Diagnostic Assessment questions
   * FastAPI: GET /api/v1/assessment/questions
   */
  async getAssessmentQuestions() {
    if (USE_MOCK) {
      await delay(120);
      return {
        success: true,
        data: DIAGNOSTIC_ASSESSMENT_QUESTIONS,
      };
    }

    const res = await fetch(`${API_BASE_URL}/v1/assessment/questions`);
    return await res.json();
  },

  /**
   * Submit diagnostic assessment answers and generate baseline learner profile
   * FastAPI: POST /api/v1/assessment/submit
   */
  async submitAssessment(answers) {
    if (USE_MOCK) {
      await delay(300);
      sessionState.profile.assessmentCompleted = true;
      persistState();
      return {
        success: true,
        data: {
          assessmentCompleted: true,
          evaluatedScores: sessionState.profile.currentSkills,
          summary: "Diagnostic assessment synthesized 4 skill axes into initial baseline vector.",
        },
      };
    }

    const res = await fetch(`${API_BASE_URL}/v1/assessment/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    return await res.json();
  },

  /**
   * Fetch challenge workspace specification
   * FastAPI: GET /api/v1/challenges/{challengeId}
   */
  async getChallenge(challengeId = "act_prob_771") {
    if (USE_MOCK) {
      await delay(120);
      const challengeData =
        challengeId === "act_ml_loss_882"
          ? SGD_CHALLENGE_DETAILS
          : PROBABILITY_CHALLENGE_DETAILS;
      return {
        success: true,
        data: challengeData,
      };
    }

    const res = await fetch(`${API_BASE_URL}/v1/challenges/${challengeId}`);
    return await res.json();
  },

  /**
   * Submit challenge code solution for evaluation test run
   * FastAPI: POST /api/v1/challenges/{challengeId}/evaluate
   */
  async submitChallenge(challengeId, code) {
    if (USE_MOCK) {
      await delay(600); // Simulate running automated test suite

      if (challengeId === "act_ml_loss_882") {
        sessionState.profile.currentSkills["Machine Learning"] = 72;
        sessionState.profile.roleReadiness = 66;
        sessionState.profile.totalXp += 400;
        sessionState.lastEvaluation = {
          challengeId: "act_ml_loss_882",
          challengeTitle: "Loss Function Derivatives & SGD Lab",
          score: 100,
          testsPassed: 3,
          totalTests: 3,
          executionTime: "4.4ms",
          memoryUsage: "16.1 MB",
          completedAt: "Just now",
          skillUpdate: {
            skillName: "Machine Learning",
            previousScore: 55,
            newScore: 72,
            delta: "+17%",
            status: "Milestone Attained",
          },
          roadmapUpdate: {
            title: "ROADMAP UPDATED",
            previousSequence: ["Statistics", "Machine Learning"],
            updatedSequence: ["Probability Practice", "Statistics", "Machine Learning", "Deep Learning Architectures"],
            reasonTitle: "Why the roadmap changed:",
            reasonExplanation: "Analytical mastery of gradient formulations unlocked Milestone 2. The roadmap has dynamically advanced to Deep Learning neural architectures.",
          },
          readinessUpdate: {
            previous: 59,
            current: 66,
            delta: "+7%",
          },
          earnedXp: 400,
        };
      } else {
        // Update the learner's skill state: Statistics: 42% -> 67%
        sessionState.profile.currentSkills.Statistics = 67;
        sessionState.profile.roleReadiness = 59;
        sessionState.profile.totalXp += 350;
        sessionState.challengeCompleted = true;
        sessionState.roadmapAdaptiveUpdated = true;
        sessionState.lastEvaluation = { ...EVALUATION_RESULT_DATA };
      }

      persistState();

      return {
        success: true,
        data: sessionState.lastEvaluation,
      };
    }

    const res = await fetch(`${API_BASE_URL}/v1/challenges/${challengeId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return await res.json();
  },

  /**
   * Get latest evaluation feedback
   * FastAPI: GET /api/v1/evaluations/{evaluationId}
   */
  async getEvaluation(evaluationId = "latest") {
    if (USE_MOCK) {
      await delay(100);
      return {
        success: true,
        data: sessionState.lastEvaluation || EVALUATION_RESULT_DATA,
      };
    }

    const targetId = evaluationId && evaluationId !== "undefined" ? evaluationId : "latest";
    const res = await fetch(`${API_BASE_URL}/v1/evaluations/${targetId}`);
    return await res.json();
  },

  /**
   * Fetch the latest AI-generated learning plan
   * FastAPI: GET /api/v1/planner/plan/latest
   */
  async getLatestLearningPlan() {
    if (USE_MOCK) {
      return { success: true, data: null };
    }
    const res = await fetch(`${API_BASE_URL}/v1/planner/plan/latest`);
    return await res.json();
  },

  /**
   * Reset demonstration state back to sample initial state
   * (Allows continuous walkthrough of the Core Product Loop)
   */
  async resetDemoState() {
    sessionState = {
      profile: JSON.parse(JSON.stringify(INITIAL_LEARNER_PROFILE)),
      targetRoles: [...TARGET_ROLES],
      currentRole: TARGET_ROLES[0],
      challengeCompleted: false,
      roadmapAdaptiveUpdated: false,
      lastEvaluation: null,
    };
    persistState();

    if (!USE_MOCK) {
      try {
        await fetch(`${API_BASE_URL}/v1/demo/reset`, { method: "POST" });
      } catch (err) {
        console.warn("Backend demo reset failed:", err);
      }
    }

    return { success: true };
  },
};
