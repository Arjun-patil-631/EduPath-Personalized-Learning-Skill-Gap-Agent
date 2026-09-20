# EduPath Backend API Contract (FastAPI Specification)

This contract defines the official REST interface between the EduPath React/Vite frontend and the Python FastAPI backend. All schemas, field names, data types, and status transitions match the existing frontend implementation in `src/services/api.js`, `src/data/mockData.js`, and `LearnerContext.jsx`.

---

## Global Standards

### Base URL
- Development / Container: `http://0.0.0.0:3000/api` or `http://localhost:8000/api`
- Frontend Config: `VITE_API_BASE_URL` (defaults to `/api`)

### Standard Envelope
Successful responses use a consistent envelope format:
```json
{
  "success": true,
  "data": { ... }
}
```

### Standard Error Response Format
HTTP 4xx / 5xx error responses conform to:
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Human readable explanation of the error",
    "details": {}
  }
}
```

---

## 1. Learner Profile Endpoints

### 1.1 `GET /v1/learner/profile`
Fetches the authenticated learner's complete profile, active target career, calibrated parameters, and real-time evaluated skill vector.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/learner/profile`
- **Request Headers:**
  - `Accept: application/json`
- **Request Body:** None
- **Frontend Consumers:**
  - `src/context/LearnerContext.jsx` (initial load & `reloadAll()`)
  - `src/layouts/AppLayout.jsx` (header avatar, user name, target role title, readiness badge, streak)
  - `src/pages/Profile.jsx` (skills vector, XP, weekly commitment hours, education, experience level)
  - `src/pages/Dashboard.jsx` (welcome header, real-time telemetry metrics)
  - `src/components/dashboard/RoleReadinessCard.jsx`

#### Response JSON (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "usr_948271",
    "name": "Alex Chen",
    "email": "alex.chen@engineering.io",
    "avatar": "AC",
    "education": "B.S. Computer Science",
    "experienceLevel": "Early Career (1-2 yrs)",
    "currentRole": "Junior Software Engineer",
    "weeklyCommitmentHours": 12,
    "learningStyle": "Hands-on Challenges & Code-first",
    "streakDays": 14,
    "totalXp": 3450,
    "joinedDate": "October 2025",
    "targetRole": {
      "id": "mle",
      "title": "Machine Learning Engineer",
      "department": "Applied AI & Intelligence",
      "medianSalary": "$162,000",
      "marketDemand": "High Demand (Top 5% tech growth)",
      "description": "Designs, builds, and deploys scalable statistical learning and deep learning pipelines into distributed production infrastructure."
    },
    "currentSkills": {
      "Python": 78,
      "SQL": 54,
      "Statistics": 42,
      "Machine Learning": 55,
      "Deep Learning": 20,
      "MLOps": 10
    },
    "roleReadiness": 52,
    "assessmentCompleted": true,
    "challengeCompleted": false
  }
}
```

- **Required Fields in `data`:**
  - `id` (string), `name` (string), `avatar` (string), `education` (string), `experienceLevel` (string), `weeklyCommitmentHours` (number), `currentSkills` (object of skill names to integer percentages 0-100), `roleReadiness` (integer 0-100), `totalXp` (integer), `streakDays` (integer), `targetRole` (object).
- **Optional Fields:**
  - `email` (string), `joinedDate` (string), `learningStyle` (string), `assessmentCompleted` (boolean), `challengeCompleted` (boolean).
- **Error Responses:**
  - `401 Unauthorized`: `{"success": false, "error": {"code": "AUTH_REQUIRED", "message": "Learner session not found."}}`

---

### 1.2 `PUT /v1/learner/profile`
Updates learner calibration parameters (education, experience, weekly commitment, learning preferences).

- **HTTP Method:** `PUT`
- **Endpoint:** `/api/v1/learner/profile`
- **Request Headers:**
  - `Content-Type: application/json`
- **Frontend Consumers:**
  - `src/pages/Onboarding.jsx` (Learner Calibration submit handler)
  - `src/context/LearnerContext.jsx` (`updateProfile(updates)`)

#### Request JSON:
```json
{
  "education": "B.S. Computer Science",
  "experienceLevel": "Early Career (1-2 yrs)",
  "learningStyle": "Hands-on Challenges & Code-first",
  "weeklyCommitmentHours": 12
}
```

- **Required Fields in Request:** None (all fields are optional for partial updates).
- **Optional Fields:** `education` (string), `experienceLevel` (string), `learningStyle` (string), `weeklyCommitmentHours` (integer 1-60), `name` (string).

#### Response JSON (`200 OK`):
Returns the updated learner profile matching the `GET /v1/learner/profile` schema.

- **Error Responses:**
  - `422 Unprocessable Entity`: Invalid range for `weeklyCommitmentHours` (must be between 1 and 60).

---

## 2. Target Roles & Goal Selection Endpoints

### 2.1 `GET /v1/roles`
Fetches all supported target roles with their market demand index, salary benchmarks, and minimum required skill thresholds.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/roles`
- **Request Body:** None
- **Frontend Consumers:**
  - `src/pages/CareerGoal.jsx` (target role selection cards, competency benchmark viewer)

#### Response JSON (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "mle",
      "title": "Machine Learning Engineer",
      "level": "Mid-Senior Pipeline",
      "demandIndex": "96/100",
      "averageSalary": "$162,000",
      "description": "Design and productionize scalable ML architectures, deep learning models, and automated continuous inference pipelines.",
      "requiredSkills": {
        "Python": 85,
        "SQL": 70,
        "Statistics": 75,
        "Machine Learning": 80,
        "Deep Learning": 65,
        "MLOps": 60
      },
      "keyCompetencies": [
        "Vectorized Numerical Computing (NumPy/Pandas)",
        "Bayesian Probability & Statistical Modeling",
        "End-to-End Scikit-Learn & PyTorch Workflows",
        "Model Monitoring, Drift Detection & CI/CD"
      ]
    },
    {
      "id": "ds",
      "title": "Data Scientist",
      "level": "Mid Level",
      "demandIndex": "91/100",
      "averageSalary": "$145,000",
      "description": "Formulate business hypotheses, analyze complex multidimensional datasets, and extract algorithmic insights with causal modeling.",
      "requiredSkills": {
        "Python": 80,
        "SQL": 85,
        "Statistics": 85,
        "Machine Learning": 70,
        "Deep Learning": 40,
        "MLOps": 30
      },
      "keyCompetencies": [
        "A/B Testing & Causal Inference",
        "Advanced SQL & Data Warehouse Modeling",
        "Exploratory Data Analysis & Visualization"
      ]
    },
    {
      "id": "mlo",
      "title": "MLOps / AI Platform Engineer",
      "level": "Senior Track",
      "demandIndex": "98/100",
      "averageSalary": "$174,000",
      "description": "Build robust infrastructure, orchestrate Kubeflow pipelines, manage GPU clusters, and guarantee high-availability model serving.",
      "requiredSkills": {
        "Python": 85,
        "SQL": 60,
        "Statistics": 50,
        "Machine Learning": 65,
        "Deep Learning": 50,
        "MLOps": 90
      },
      "keyCompetencies": [
        "Kubernetes & Container Orchestration",
        "Feature Stores & Model Registries (Feast/MLflow)",
        "Production Inference Optimization (Triton/TensorRT)",
        "Automated CI/CD & Pipeline Regression Testing"
      ]
    }
  ]
}
```

- **Required Fields in each role:** `id` (string), `title` (string), `level` (string), `demandIndex` (string), `averageSalary` (string), `requiredSkills` (object of skill names to integer threshold), `keyCompetencies` (array of strings).

---

### 2.2 `PUT /v1/learner/target-role`
Sets or switches the active career target for the learner, recalculating the baseline skill gap matrix.

- **HTTP Method:** `PUT`
- **Endpoint:** `/api/v1/learner/target-role`
- **Frontend Consumers:**
  - `src/pages/CareerGoal.jsx` (`selectTargetRole(selectedRoleId)`)
  - `src/context/LearnerContext.jsx` (`selectTargetRole`)

#### Request JSON:
```json
{
  "roleId": "mle"
}
```
- **Required Fields:** `roleId` (string: `"mle"` | `"ds"` | `"mlo"`).

#### Response JSON (`200 OK`):
Returns the updated learner profile with `targetRole` re-configured.

- **Error Responses:**
  - `404 Not Found`: `{"success": false, "error": {"code": "ROLE_NOT_FOUND", "message": "Target role 'xyz' not recognized."}}`

---

## 3. Skill Gap Analysis Endpoints

### 3.1 `GET /v1/skills/gap-analysis`
Computes the mathematical delta between the learner's current evaluated competencies and the hiring requirements for their active target role.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/skills/gap-analysis`
- **Request Body:** None
- **Frontend Consumers:**
  - `src/pages/SkillGap.jsx` (gap matrix, critical gap banner, readiness score)
  - `src/components/skills/SkillGapTable.jsx` (competency rows, progress comparisons, urgency tags)
  - `src/components/dashboard/RoleReadinessCard.jsx` (readiness score, deficit axes count)

#### Response JSON (`200 OK`):
```json
{
  "success": true,
  "data": {
    "roleTitle": "Machine Learning Engineer",
    "roleReadiness": 52,
    "criticalGapsCount": 1,
    "topPriorityGap": "Statistics",
    "gaps": [
      {
        "skill": "Statistics",
        "current": 42,
        "required": 75,
        "gap": -33,
        "deficitPercent": 33,
        "masteryPercentage": 56,
        "urgency": "critical",
        "isLargestGap": true
      },
      {
        "skill": "Deep Learning",
        "current": 20,
        "required": 65,
        "gap": -45,
        "deficitPercent": 45,
        "masteryPercentage": 31,
        "urgency": "critical",
        "isLargestGap": false
      },
      {
        "skill": "MLOps",
        "current": 10,
        "required": 60,
        "gap": -50,
        "deficitPercent": 50,
        "masteryPercentage": 17,
        "urgency": "critical",
        "isLargestGap": false
      },
      {
        "skill": "Machine Learning",
        "current": 55,
        "required": 80,
        "gap": -25,
        "deficitPercent": 25,
        "masteryPercentage": 69,
        "urgency": "moderate",
        "isLargestGap": false
      },
      {
        "skill": "SQL",
        "current": 54,
        "required": 70,
        "gap": -16,
        "deficitPercent": 16,
        "masteryPercentage": 77,
        "urgency": "moderate",
        "isLargestGap": false
      },
      {
        "skill": "Python",
        "current": 78,
        "required": 85,
        "gap": -7,
        "deficitPercent": 7,
        "masteryPercentage": 92,
        "urgency": "minor",
        "isLargestGap": false
      }
    ]
  }
}
```

- **Required Fields:**
  - `roleTitle` (string), `roleReadiness` (integer 0-100), `criticalGapsCount` (integer), `topPriorityGap` (string), `gaps` (array of gap objects).
  - In each gap object: `skill` (string), `current` (number), `required` (number), `gap` (number: current - required), `deficitPercent` (number: max(0, required - current)), `masteryPercentage` (number: round((current/required)*100)), `urgency` (`"critical"` | `"moderate"` | `"minor"` | `"aligned"`), `isLargestGap` (boolean).

---

## 4. Personalized & Adaptive Roadmap Endpoints

### 4.1 `GET /v1/roadmap`
Returns the hierarchical curriculum DAG (Directed Acyclic Graph) partitioned into milestones and stages. When an adaptive mutation is triggered (e.g., after the probability challenge), the response contains the mutated node sequence with `isAdaptiveUpdated: true` and the inserted node.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/roadmap`
- **Request Body:** None
- **Frontend Consumers:**
  - `src/pages/Roadmap.jsx` (timeline container, milestone counters, adaptive banner)
  - `src/components/roadmap/RoadmapTimeline.jsx` (graph rendering, node status, prerequisite connecting lines)
  - `src/components/roadmap/RoadmapAdaptiveBanner.jsx` (sequence diff presentation)

#### Response JSON - Initial State (`200 OK`):
```json
{
  "success": true,
  "data": {
    "roleTitle": "Machine Learning Engineer",
    "totalModules": 14,
    "completedModules": 3,
    "estimatedWeeks": 12,
    "activeStage": "Stage 1",
    "isAdaptiveUpdated": false,
    "stages": [
      {
        "stageNumber": 1,
        "title": "Stage 1: Mathematical Foundations & Data Structures",
        "status": "in_progress",
        "completionPercentage": 50,
        "nodes": [
          {
            "id": "node_python",
            "title": "Vectorized Python & Matrix Operations",
            "skill": "Python",
            "status": "completed",
            "score": 78,
            "duration": "2 weeks"
          },
          {
            "id": "node_stats",
            "title": "Applied Statistics & Hypothesis Testing",
            "skill": "Statistics",
            "status": "in_progress",
            "score": 42,
            "duration": "3 weeks",
            "description": "Hypothesis testing, maximum likelihood estimation (MLE), and confidence intervals for model validation."
          }
        ]
      },
      {
        "stageNumber": 2,
        "title": "Stage 2: Core Machine Learning & Algorithmic Modeling",
        "status": "locked",
        "completionPercentage": 0,
        "nodes": [
          {
            "id": "node_classical_ml",
            "title": "Loss Functions & Optimization (SGD)",
            "skill": "Machine Learning",
            "status": "locked",
            "duration": "4 weeks",
            "description": "Convex optimization, gradient descent formulations, regularized regressions, and tree ensembles."
          }
        ]
      },
      {
        "stageNumber": 3,
        "title": "Stage 3: Deep Learning Architectures & Production Serving",
        "status": "locked",
        "completionPercentage": 0,
        "nodes": [
          {
            "id": "node_dl_foundations",
            "title": "Deep Neural Networks & Backpropagation",
            "skill": "Deep Learning",
            "status": "locked",
            "duration": "4 weeks"
          },
          {
            "id": "node_mlops_deploy",
            "title": "Model Serving, Docker & Triton Systems",
            "skill": "MLOps",
            "status": "locked",
            "duration": "3 weeks"
          }
        ]
      }
    ]
  }
}
```

#### Response JSON - Mutated State after Evaluation (`200 OK`):
When adaptive mutation has occurred, node `node_prob_practice` is dynamically inserted before `node_stats`, and `node_stats` reflects the calibrated score `67`:
```json
{
  "success": true,
  "data": {
    "isAdaptiveUpdated": true,
    "stages": [
      {
        "stageNumber": 1,
        "nodes": [
          {
            "id": "node_python",
            "title": "Vectorized Python & Matrix Operations",
            "skill": "Python",
            "status": "completed",
            "score": 78,
            "duration": "2 weeks"
          },
          {
            "id": "node_prob_practice",
            "title": "Probability Practice",
            "skill": "Statistics",
            "status": "recommended",
            "isAdaptiveInsert": true,
            "score": null,
            "duration": "1 week",
            "tag": "Adaptive Insert",
            "description": "Targeted drill on joint distributions, marginal likelihoods, and Bayesian decision rules."
          },
          {
            "id": "node_stats",
            "title": "Applied Statistics & Hypothesis Testing",
            "skill": "Statistics",
            "status": "in_progress",
            "score": 67,
            "duration": "3 weeks",
            "description": "Hypothesis testing, maximum likelihood estimation (MLE), and confidence intervals for model validation."
          }
        ]
      }
    ]
  }
}
```

- **Node Status Values:** `"completed"` | `"in_progress"` | `"recommended"` | `"locked"`.

---

## 5. Recommendation Endpoints (Next Best Action)

### 5.1 `GET /v1/recommendations/next-best-action`
Returns the single highest-leverage learning intervention computed by the recommendation engine based on current skill deficits.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/recommendations/next-best-action`
- **Request Body:** None
- **Frontend Consumers:**
  - `src/components/dashboard/NextBestActionCard.jsx`
  - `src/pages/Roadmap.jsx` (prominent top banner)
  - `src/pages/Dashboard.jsx` (primary action launcher)

#### Response JSON - Baseline (Pre-Challenge) (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "act_prob_771",
    "title": "Probability Challenge",
    "module": "Mathematical Foundations",
    "durationMinutes": 25,
    "difficulty": "Intermediate",
    "targetSkill": "Statistics",
    "currentSkillScore": 42,
    "projectedSkillScore": 67,
    "xpAward": 350,
    "why": "Probability is currently one of the learner's largest skill gaps for the selected role.",
    "impactSummary": "Closes the critical -33% gap required before entering advanced Machine Learning algorithms.",
    "isFollowUp": false
  }
}
```

#### Response JSON - Follow-up Action (Post-Challenge) (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "act_ml_loss_882",
    "title": "Loss Function Derivatives & SGD Lab",
    "module": "Core Machine Learning",
    "durationMinutes": 30,
    "difficulty": "Intermediate",
    "targetSkill": "Machine Learning",
    "currentSkillScore": 55,
    "projectedSkillScore": 72,
    "xpAward": 400,
    "why": "With Statistics reinforced to 67%, you now have the required foundation to derive loss gradients without conceptual regressions.",
    "impactSummary": "Unlocks Milestone 2: Neural Gradient Solvers.",
    "isFollowUp": true
  }
}
```

- **Required Fields:** `id` (string), `title` (string), `durationMinutes` (integer), `targetSkill` (string), `currentSkillScore` (integer), `projectedSkillScore` (integer), `why` (string), `xpAward` (integer).
- **Optional Fields:** `module` (string), `difficulty` (string), `impactSummary` (string), `isFollowUp` (boolean).

---

## 6. Challenge Execution & Evaluation Endpoints

### 6.1 `GET /v1/challenges/{challengeId}`
Fetches the code problem specification, instructions, starter code, and test cases for the challenge workspace.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/challenges/{challengeId}`
- **Path Parameters:**
  - `challengeId` (string, e.g. `"act_prob_771"` or `"act_ml_loss_882"`)
- **Frontend Consumers:**
  - `src/pages/Challenge.jsx`
  - `src/components/challenge/ChallengeWorkspace.jsx`
  - `src/components/challenge/TestCaseRunner.jsx`

#### Response JSON (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "act_prob_771",
    "title": "Probability Challenge: Bayes Classifier & Conditional Expectation",
    "durationMinutes": 25,
    "difficulty": "Intermediate",
    "estimatedTime": "25 min",
    "category": "Mathematical Foundations & Statistics",
    "scenario": "A medical imaging pipeline produces diagnostic logits for anomaly detection. Your task is to calculate posterior disease probabilities using Bayes' theorem with calibrated priors.",
    "instructions": [
      "Implement the bayes_posterior function using NumPy vectorization.",
      "Handle marginal likelihood denominator scaling to prevent floating-point underflow.",
      "Pass all 5 unit and edge case assertion tests."
    ],
    "starterCode": "# Probability Challenge: Bayes Classifier\nimport numpy as np\n\ndef bayes_posterior(prior: float, sensitivity: float, specificity: float) -> float:\n    \"\"\"\n    Calculates P(Disease | Positive_Test)\n    \"\"\"\n    # TODO: Implement Bayes' rule\n    return 0.0\n",
    "testCases": [
      {
        "id": "tc_1",
        "name": "Standard Rare Disease Baseline",
        "input: "prior=0.01, sens=0.95, spec=0.90",
        "expectedOutput": "0.0876 (+/- 0.001)",
        "status": "passed",
        "latency": "1.2ms"
      },
      {
        "id": "tc_2",
        "name": "High Prevalence Balanced Prior",
        "input": "prior=0.50, sens=0.99, spec=0.99",
        "expectedOutput": "0.9900 (+/- 0.0001)",
        "status": "passed",
        "latency": "0.8ms"
      },
      {
        "id": "tc_3",
        "name": "Zero Prior Invariant Boundary",
        "input": "prior=0.00, sens=0.90, spec=0.90",
        "expectedOutput": "0.0000",
        "status": "passed",
        "latency": "0.4ms"
      },
      {
        "id": "tc_4",
        "name": "Perfect Classifier Boundary",
        "input": "prior=0.05, sens=1.00, spec=1.00",
        "expectedOutput": "1.0000",
        "status": "passed",
        "latency": "0.6ms"
      },
      {
        "id": "tc_5",
        "name": "Vectorized Batch Calculation Array",
        "input": "prior=np.array([0.01, 0.05]), sens=0.90, spec=0.90",
        "expectedOutput": "np.ndarray [0.0833, 0.3214]",
        "status": "passed",
        "latency": "1.5ms"
      }
    ]
  }
}
```

- **Required Fields:** `id` (string), `title` (string), `durationMinutes` (integer), `instructions` (array of strings), `starterCode` (string), `testCases` (array of test objects).

---

### 6.2 `POST /v1/challenges/{challengeId}/evaluate`
Submits user code to the backend execution sandbox (Pytest / Subprocess runner). Triggers the critical state mutation loop.

- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/challenges/{challengeId}/evaluate`
- **Path Parameters:**
  - `challengeId` (string)
- **Request Headers:**
  - `Content-Type: application/json`
- **Frontend Consumers:**
  - `src/pages/Challenge.jsx` (`handleSubmitSolution(code)`)
  - `src/context/LearnerContext.jsx` (`completeChallenge`)

#### Request JSON:
```json
{
  "code": "import numpy as np\n\ndef bayes_posterior(prior: float, sensitivity: float, specificity: float) -> float:\n    p_pos_given_d = sensitivity\n    p_pos_given_not_d = 1.0 - specificity\n    numerator = p_pos_given_d * prior\n    denominator = numerator + (p_pos_given_not_d * (1.0 - prior))\n    if denominator == 0:\n        return 0.0\n    return float(numerator / denominator)\n"
}
```
- **Required Fields:** `code` (string).

#### Response JSON (`200 OK`):
```json
{
  "success": true,
  "data": {
    "challengeId": "act_prob_771",
    "challengeTitle": "Probability Challenge: Bayes Classifier & Conditional Expectation",
    "score": 100,
    "testsPassed": 5,
    "totalTests": 5,
    "executionTime": "8.4ms",
    "memoryUsage": "14.2 MB",
    "completedAt": "Just now",
    "skillUpdate": {
      "skillName": "Statistics",
      "previousScore": 42,
      "newScore": 67,
      "delta": "+25%",
      "status": "Significantly Improved"
    },
    "roadmapUpdate": {
      "title": "ROADMAP UPDATED",
      "previousSequence": [
        "Statistics",
        "Machine Learning"
      ],
      "updatedSequence": [
        "Probability Practice",
        "Statistics",
        "Machine Learning"
      ],
      "reasonTitle": "Why the roadmap changed:",
      "reasonExplanation": "Probability was identified as a critical bottleneck for advanced statistical learning. Completing the Probability Challenge lifted your Statistics baseline from 42% to 67%. The curriculum dynamically inserted 'Probability Practice' as an immediate reinforcement node before transitioning to end-to-end Machine Learning pipelines, preventing downstream concept regression."
    },
    "readinessUpdate": {
      "previous": 52,
      "current": 59,
      "delta": "+7%"
    },
    "earnedXp": 350
  }
}
```

- **Required Fields in Response:**
  - `challengeId` (string), `score` (integer 0-100), `testsPassed` (integer), `totalTests` (integer), `executionTime` (string), `memoryUsage` (string), `earnedXp` (integer).
  - `skillUpdate`: `skillName` (string), `previousScore` (number), `newScore` (number), `delta` (string).
  - `roadmapUpdate`: `title` (string), `previousSequence` (array of strings), `updatedSequence` (array of strings), `reasonTitle` (string), `reasonExplanation` (string).
  - `readinessUpdate`: `previous` (number), `current` (number), `delta` (string).

- **Error Responses:**
  - `400 Bad Request`: Syntax error in user Python code (`{"success": false, "error": {"code": "PYTHON_SYNTAX_ERROR", "message": "SyntaxError: unexpected EOF while parsing at line 14"}}`).
  - `408 Request Timeout`: Execution timed out (> 5.0 seconds).

---

### 6.3 `GET /v1/evaluations/{evaluationId}`
Retrieves the stored evaluation report and telemetry metrics for display on the evaluation review screen.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/evaluations/{evaluationId}`
- **Path Parameters:**
  - `evaluationId` (string, optional: if omitted, returns the latest evaluation in session)
- **Frontend Consumers:**
  - `src/pages/Evaluation.jsx` (`api.getEvaluation()`)

#### Response JSON (`200 OK`):
Matches the schema of `POST /v1/challenges/{challengeId}/evaluate`.

---

## 7. Auxiliary Assessment Endpoints

### 7.1 `GET /v1/assessment/questions`
Fetches technical diagnostic questions for the initial aptitude calibration.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/assessment/questions`
- **Frontend Consumers:**
  - `src/pages/Assessment.jsx`
  - `src/components/assessment/AssessmentQuestionCard.jsx`

#### Response JSON (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "q_1",
      "skill": "Python",
      "question": "Which NumPy operation avoids Python-level loops and leverages SIMD vectorization for dot products?",
      "codeSnippet": "# Matrix Dot Product Comparison\na = np.random.randn(1000)\nb = np.random.randn(1000)",
      "options": [
        { "id": "opt_a", "text": "sum([x * y for x, y in zip(a, b)])", "correct": false },
        { "id": "opt_b", "text": "np.dot(a, b) or a @ b", "correct": true },
        { "id": "opt_c", "text": "np.multiply(a, b).tolist()", "correct": false }
      ],
      "explanation": "The @ operator calls BLAS/LAPACK optimized native C/Fortran vector kernels."
    }
  ]
}
```

---

### 7.2 `POST /v1/assessment/submit`
Submits diagnostic answers to establish the initial learner profile skill vector.

- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/assessment/submit`
- **Request Body:**
```json
{
  "answers": {
    "q_1": "opt_b",
    "q_2": "opt_a",
    "q_3": "opt_c",
    "q_4": "opt_a"
  }
}
```
- **Response JSON (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "assessmentCompleted": true,
    "evaluatedScores": {
      "Python": 78,
      "SQL": 54,
      "Statistics": 42,
      "Machine Learning": 55,
      "Deep Learning": 20,
      "MLOps": 10
    },
    "summary": "Diagnostic assessment synthesized 4 skill axes into initial baseline vector."
  }
}
```

---

## 8. Critical State Transition Architecture

The primary differentiator of EduPath is the **Adaptive Learning Loop**. The FastAPI backend must orchestrate the following atomic state transition whenever `POST /v1/challenges/{challengeId}/evaluate` executes:

```
[1. Challenge Submission]
       │
       │  POST /api/v1/challenges/{id}/evaluate
       ▼
[2. Automated Test Evaluation]
       │  Python Sandbox runs 5 test assertions
       │  Computes score (100%), execution time (8.4ms), memory (14.2MB)
       ▼
[3. Competency Skill Update]
       │  Learner's Statistics proficiency increases:
       │  Statistics: 42% ──▶ 67% (+25%)
       ▼
[4. Role Readiness Recalculation]
       │  Total weighted progress vs. Machine Learning Engineer benchmark:
       │  Overall Role Readiness: 52% ──▶ 59% (+7%)
       │  Learner XP: 3,450 ──▶ 3,800 (+350 XP)
       ▼
[5. Dynamic Roadmap Mutation]
       │  Roadmap DAG mutates:
       │  Previous Sequence: Statistics ──▶ Machine Learning
       │  Updated Sequence:  Probability Practice ──▶ Statistics ──▶ Machine Learning
       │  'Probability Practice' node dynamically inserted with isAdaptiveInsert = true
       │  Reason: Reinforce Bayesian fundamentals before progressing to loss functions
       ▼
[6. Next Best Action Advancement]
       │  Previous Action: Probability Challenge (Completed)
       │  New Recommended Action: Loss Function Derivatives & SGD Lab
       │  Target: Machine Learning (55% ──▶ 72%, +17% Projected)
       │  Impact: Unlocks Milestone 2 (Neural Gradient Solvers)
```

### Consistency Guarantees
1. **Single Source of Truth**: All mutated state (profile skills, readiness, active roadmap, and next action) is updated transactionally in the backend database.
2. **Immediate Reflection**: When the frontend executes `reloadAll()`, the subsequent requests to `/v1/learner/profile`, `/v1/skills/gap-analysis`, `/v1/roadmap`, and `/v1/recommendations/next-best-action` return mutually consistent data.
3. **Reset Capability**: In local development or prototype walkthroughs, `api.resetDemoState()` resets all session state back to the baseline (`Statistics: 42%`, `Readiness: 52%`, unmutated roadmap) to allow repeatable demos.
