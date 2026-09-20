/**
 * EduPath Mock Data
 * Structured to mirror FastAPI Pydantic schema responses
 */

export const INITIAL_LEARNER_PROFILE = {
  id: "usr_948271",
  name: "Alex Chen",
  email: "alex.chen@engineering.io",
  avatar: "AC",
  education: "B.S. Computer Science",
  experienceLevel: "Early Career (1-2 yrs)",
  currentRole: "Junior Software Engineer",
  weeklyCommitmentHours: 12,
  learningStyle: "Hands-on Challenges & Code-first",
  streakDays: 14,
  totalXp: 3450,
  joinedDate: "October 2025",
  targetRole: {
    id: "mle",
    title: "Machine Learning Engineer",
    department: "Applied AI & Intelligence",
    medianSalary: "$162,000",
    marketDemand: "High Demand (Top 5% tech growth)",
    description: "Designs, builds, and deploys scalable statistical learning and deep learning pipelines into distributed production infrastructure.",
  },
  currentSkills: {
    Python: 78,
    SQL: 54,
    Statistics: 42,
    "Machine Learning": 55,
    "Deep Learning": 20,
    MLOps: 10,
  },
  roleReadiness: 52, // overall % readiness
  assessmentCompleted: true,
  challengeCompleted: false,
};

export const TARGET_ROLES = [
  {
    id: "mle",
    title: "Machine Learning Engineer",
    level: "Mid-Senior Pipeline",
    demandIndex: "96/100",
    averageSalary: "$162,000",
    description: "Design and productionize scalable ML architectures, deep learning models, and automated continuous inference pipelines.",
    requiredSkills: {
      Python: 85,
      SQL: 70,
      Statistics: 75,
      "Machine Learning": 80,
      "Deep Learning": 65,
      MLOps: 60,
    },
    keyCompetencies: [
      "Vectorized Numerical Computing (NumPy/Pandas)",
      "Bayesian Probability & Statistical Modeling",
      "End-to-End Scikit-Learn & PyTorch Workflows",
      "Model Monitoring, Drift Detection & CI/CD",
    ],
  },
  {
    id: "ds",
    title: "Data Scientist",
    level: "Mid Level",
    demandIndex: "91/100",
    averageSalary: "$145,000",
    description: "Formulate business hypotheses, analyze complex multidimensional datasets, and extract algorithmic insights with causal modeling.",
    requiredSkills: {
      Python: 80,
      SQL: 85,
      Statistics: 85,
      "Machine Learning": 70,
      "Deep Learning": 40,
      MLOps: 30,
    },
    keyCompetencies: [
      "A/B Testing & Causal Inference",
      "Advanced SQL & Data Warehouse Modeling",
      "Exploratory Data Analysis & Visualization",
    ],
  },
  {
    id: "mlo",
    title: "MLOps / AI Platform Engineer",
    level: "Senior Track",
    demandIndex: "98/100",
    averageSalary: "$174,000",
    description: "Build robust infrastructure, orchestrate Kubeflow pipelines, manage GPU clusters, and guarantee high-availability model serving.",
    requiredSkills: {
      Python: 85,
      SQL: 60,
      Statistics: 50,
      "Machine Learning": 65,
      "Deep Learning": 50,
      MLOps: 90,
    },
    keyCompetencies: [
      "Kubernetes & Container Orchestration",
      "Feature Stores & Model Registries (MLflow)",
      "High-throughput Low-latency Inference",
    ],
  },
];

export const DIAGNOSTIC_ASSESSMENT_QUESTIONS = [
  {
    id: "q1",
    skill: "Python",
    title: "Vectorized Operations vs List Comprehensions",
    question: "Given a 2D matrix of dimensions 10,000 x 10,000, which approach achieves minimum runtime and optimal memory cache localization for calculating element-wise row variance in Python?",
    options: [
      { id: "a", text: "Nested for-loops iterating over rows and computing standard sample variance formula manually." },
      { id: "b", text: "Python list comprehension using built-in statistics.variance() mapped across rows." },
      { id: "c", text: "np.var(matrix, axis=1, ddof=1) utilizing SIMD contiguous memory layout via NumPy C-extensions.", correct: true },
      { id: "d", text: "multiprocessing.Pool() mapping built-in math.sqrt over Python generator expressions." },
    ],
    explanation: "NumPy's C-level vectorization executes across contiguous memory blocks with SIMD vector instructions, avoiding Python interpreter overhead and pointer chasing.",
  },
  {
    id: "q2",
    skill: "Statistics",
    title: "Bayesian Conditional Probability & Medical Screening",
    question: "A rare disease has an incidence rate of 0.1% in the population. A diagnostic test has a 99% true positive rate (sensitivity) and a 5% false positive rate. If a patient tests positive, what is the approximate posterior probability P(Disease | Positive)?",
    options: [
      { id: "a", text: "Approximately 95%" },
      { id: "b", text: "Approximately 50%" },
      { id: "c", text: "Approximately 1.94% (less than 2%)", correct: true },
      { id: "d", text: "Approximately 80%" },
    ],
    explanation: "By Bayes' Theorem: P(D|+) = (0.99 * 0.001) / (0.99 * 0.001 + 0.05 * 0.999) = 0.00099 / (0.00099 + 0.04995) ≈ 1.94%. The vast majority of positives are false positives due to the low base rate.",
  },
  {
    id: "q3",
    skill: "Machine Learning",
    title: "Bias-Variance Tradeoff & Regularization",
    question: "You observe a trained gradient-boosted decision tree model achieving 99.4% accuracy on training data but dropping to 64.2% on holdout validation data. Which set of hyperparameter interventions directly addresses this diagnosis?",
    options: [
      { id: "a", text: "Increase max_depth and decrease min_samples_split to allow more expressive decision splits." },
      { id: "b", text: "Reduce learning_rate, limit max_depth (e.g., 3-5), increase min_child_weight, and introduce subsample=0.8.", correct: true },
      { id: "c", text: "Remove L2 regularization and eliminate early stopping patience bounds." },
      { id: "d", text: "One-hot encode all high-cardinality continuous features without binning." },
    ],
    explanation: "The symptom is severe overfitting (high variance). Reducing tree depth, constraining leaf weights, and subsampling rows/features enforces regularization.",
  },
  {
    id: "q4",
    skill: "SQL",
    title: "Window Functions & Moving Aggregations",
    question: "Which SQL clause computes a 7-day rolling average of daily user inference requests partitioned by model_version?",
    options: [
      { id: "a", text: "AVG(requests) GROUP BY model_version, date HAVING date >= date - 7" },
      { id: "b", text: "AVG(requests) OVER (PARTITION BY model_version ORDER BY log_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)", correct: true },
      { id: "c", text: "ROLLING_AVG(requests, 7) OVER (ORDER BY model_version)" },
      { id: "d", text: "SELECT AVG(requests) WHERE date IN (SELECT TOP 7 date FROM logs)" },
    ],
    explanation: "The window frame 'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW' computes exactly over the current record and the prior 6 records in temporal sequence.",
  },
];

export const NEXT_BEST_ACTION_DATA = {
  id: "act_prob_771",
  title: "Probability Challenge",
  module: "Statistical Inference & Bayesian Estimation",
  durationMinutes: 25,
  difficulty: "Intermediate",
  targetSkill: "Statistics",
  currentSkillScore: 42,
  projectedSkillScore: 67,
  xpAward: 350,
  why: "Probability is currently one of the learner's largest skill gaps for the selected role.",
  impactSummary: "Closing this gap eliminates the prerequisite blocker for Advanced Machine Learning & Loss Function Formulations.",
};

export const PROBABILITY_CHALLENGE_DETAILS = {
  id: "act_prob_771",
  title: "Probability Challenge: Bayes Classifier & Conditional Expectation",
  durationMinutes: 25,
  difficulty: "Intermediate",
  estimatedTime: "25 min",
  category: "Applied Probability & Mathematical Modeling",
  scenario: `In modern ML classification engines, calculating the optimal decision boundary requires estimating posterior likelihoods via Bayes' rule. You are tasked with implementing the core probability calculation routine for an anomaly detection filter that classifies network packet bursts given prior failure distributions.`,
  instructions: [
    "Implement the conditional expectation function E[X | Y=y] for bivariate Gaussian sensors.",
    "Calculate the posterior class probability P(Anomaly=1 | Evidence) given prior = 0.04, true_positive_rate = 0.94, and false_positive_rate = 0.08.",
    "Evaluate whether the probability crosses the Bayesian decision threshold tau = 0.35 to trigger an automated alert flag.",
  ],
  starterCode: `# Probability Challenge: Anomaly Classifier Decision Boundary
import numpy as np

def compute_posterior(prior: float, sensitivity: float, false_positive_rate: float) -> float:
    """
    Computes P(Anomaly | Signal) using Bayes' Theorem.
    prior: P(Anomaly)
    sensitivity: P(Signal | Anomaly)
    false_positive_rate: P(Signal | Healthy)
    """
    # TODO: Implement Bayes' formula
    # P(Signal) = prior * sensitivity + (1 - prior) * false_positive_rate
    p_signal = (prior * sensitivity) + ((1.0 - prior) * false_positive_rate)
    posterior = (prior * sensitivity) / p_signal
    return float(np.round(posterior, 4))

def evaluate_decision(posterior: float, threshold: float = 0.35) -> dict:
    """
    Determines alert trigger state based on loss-weighted threshold.
    """
    is_anomaly = posterior >= threshold
    return {
        "posterior_probability": posterior,
        "trigger_alert": is_anomaly,
        "confidence_delta": float(np.round(posterior - threshold, 4))
    }
`,
  testCases: [
    {
      id: "tc_1",
      name: "Standard Base Rate Anomaly Test",
      input: "prior=0.04, sens=0.94, fpr=0.08",
      expectedOutput: "posterior ≈ 0.3287, trigger_alert = False",
      status: "passed",
      latency: "1.2ms",
    },
    {
      id: "tc_2",
      name: "High-Priority Cluster Test",
      input: "prior=0.15, sens=0.98, fpr=0.04",
      expectedOutput: "posterior ≈ 0.8122, trigger_alert = True",
      status: "passed",
      latency: "0.8ms",
    },
    {
      id: "tc_3",
      name: "Rare Outlier Zero-Division Guard",
      input: "prior=0.0001, sens=0.99, fpr=0.01",
      expectedOutput: "posterior ≈ 0.0098, trigger_alert = False",
      status: "passed",
      latency: "1.1ms",
    },
    {
      id: "tc_4",
      name: "Asymmetric Loss Matrix Boundary Check",
      input: "threshold=0.35, posterior=0.3501",
      expectedOutput: "trigger_alert = True",
      status: "passed",
      latency: "0.9ms",
    },
    {
      id: "tc_5",
      name: "Vectorized Precision Metric Batch",
      input: "batch_size=1024 signals",
      expectedOutput: "MAE < 0.0001 across tensor bounds",
      status: "passed",
      latency: "4.4ms",
    },
  ],
};

export const SGD_CHALLENGE_DETAILS = {
  id: "act_ml_loss_882",
  title: "Loss Function Derivatives & SGD Lab: Gradient Descent Optimization",
  durationMinutes: 30,
  difficulty: "Intermediate",
  estimatedTime: "30 min",
  category: "Machine Learning & Numerical Optimization",
  scenario: "Following calibration in probability distributions, this challenge tests formulating loss functions and calculating analytical gradients for Stochastic Gradient Descent (SGD) with momentum on non-convex manifolds.",
  instructions: [
    "Formulate the Mean Squared Error (MSE) loss vector with L2 ridge regularization.",
    "Derive and compute analytical gradients with respect to weight tensor W.",
    "Implement an SGD update step with momentum beta = 0.9 and learning rate eta = 0.01.",
  ],
  starterCode: `# Loss Function Derivatives & SGD Lab
import numpy as np

def compute_mse_gradient(X: np.ndarray, y: np.ndarray, w: np.ndarray, l2_reg: float = 0.01) -> np.ndarray:
    """
    Computes analytical gradient of L2-regularized MSE loss.
    Grad = -(2/N) * X.T @ (y - X @ w) + 2 * l2_reg * w
    """
    N = X.shape[0]
    predictions = X @ w
    residuals = y - predictions
    grad = -(2.0 / N) * (X.T @ residuals) + (2.0 * l2_reg * w)
    return grad

def sgd_momentum_step(w: np.ndarray, grad: np.ndarray, velocity: np.ndarray, lr: float = 0.01, beta: float = 0.9):
    """
    Updates weights using momentum-augmented Stochastic Gradient Descent.
    """
    new_velocity = beta * velocity + (1.0 - beta) * grad
    new_weights = w - lr * new_velocity
    return new_weights, new_velocity
`,
  testCases: [
    {
      id: "tc_1",
      name: "Zero-Residual Equilibrium Assertion",
      input: "X=I_4, y=[1,2,3,4], w=[1,2,3,4]",
      expectedOutput: "Gradient norm < 0.02 (regularization term only)",
      status: "passed",
      latency: "0.9ms",
    },
    {
      id: "tc_2",
      name: "Convex Manifold Monotonic Descent",
      input: "X random Gaussian (100x5), lr=0.01",
      expectedOutput: "Loss strictly decreases across 10 iterations",
      status: "passed",
      latency: "2.1ms",
    },
    {
      id: "tc_3",
      name: "Momentum Velocity Smoothing",
      input: "Oscillating gradient vectors, beta=0.9",
      expectedOutput: "Velocity dampens cross-axis oscillation > 65%",
      status: "passed",
      latency: "1.4ms",
    },
  ],
};

export const EVALUATION_RESULT_DATA = {
  challengeId: "act_prob_771",
  challengeTitle: "Probability Challenge: Bayes Classifier & Conditional Expectation",
  score: 100,
  testsPassed: 5,
  totalTests: 5,
  executionTime: "8.4ms",
  memoryUsage: "14.2 MB",
  completedAt: "Just now",
  skillUpdate: {
    skillName: "Statistics",
    previousScore: 42,
    newScore: 67,
    delta: "+25%",
    status: "Significant Mastery Gain",
  },
  roadmapUpdate: {
    title: "ROADMAP UPDATED",
    previousSequence: ["Statistics", "Machine Learning"],
    updatedSequence: ["Probability Practice", "Statistics", "Machine Learning"],
    reasonTitle: "Why the roadmap changed:",
    reasonExplanation:
      "Probability is currently one of the learner's largest skill gaps for the selected role. Demonstrating applied competency in Bayesian estimation elevated your Statistics score from 42% to 67%. To solidify these gains before progressing to complex ML loss formulations, the adaptive engine inserted a targeted 'Probability Practice' lab. This reduces prerequisite friction and accelerates mastery in gradient descent algorithms.",
  },
  readinessUpdate: {
    previous: 52,
    current: 59,
    delta: "+7%",
  },
  earnedXp: 350,
};

export const ROADMAP_DATA = {
  role: "Machine Learning Engineer",
  totalModules: 14,
  completedModules: 4,
  estimatedWeeks: 12,
  stages: [
    {
      id: "stage_1",
      name: "Stage 1: Mathematical Foundations & Probability",
      status: "in_progress",
      nodes: [
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
          status: "recommended", // Newly inserted adaptive node!
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
          score: 67, // updated from 42
          duration: "3 weeks",
          description: "Hypothesis testing, maximum likelihood estimation (MLE), and confidence intervals for model validation.",
        },
      ],
    },
    {
      id: "stage_2",
      name: "Stage 2: Core Machine Learning & Feature Engineering",
      status: "locked",
      nodes: [
        {
          id: "node_ml",
          title: "Machine Learning Foundations",
          skill: "Machine Learning",
          status: "upcoming",
          score: 55,
          duration: "3 weeks",
          description: "Supervised & unsupervised models, regularization, loss surfaces, and ensemble architectures.",
        },
        {
          id: "node_sql",
          title: "SQL & Relational Feature Extraction",
          skill: "SQL",
          status: "upcoming",
          score: 54,
          duration: "2 weeks",
          description: "Analytical window functions, partitioning, and automated feature store generation.",
        },
      ],
    },
    {
      id: "stage_3",
      name: "Stage 3: Deep Learning & Production MLOps",
      status: "locked",
      nodes: [
        {
          id: "node_dl",
          title: "Deep Learning & PyTorch Architectures",
          skill: "Deep Learning",
          status: "locked",
          score: 20,
          duration: "4 weeks",
          description: "Backpropagation, convolutional neural nets, transformers, and GPU tensor acceleration.",
        },
        {
          id: "node_mlops",
          title: "MLOps: Deployment, Serving & Drift",
          skill: "MLOps",
          status: "locked",
          score: 10,
          duration: "3 weeks",
          description: "Docker, FastAPI model serving, Triton inference server, and automated drift telemetry.",
        },
      ],
    },
  ],
};
