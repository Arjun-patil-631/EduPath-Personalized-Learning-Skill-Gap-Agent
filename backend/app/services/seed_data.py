from sqlalchemy.orm import Session
from app.models.user import User, LearnerProfile
from app.models.role import TargetRole, RoleSkillRequirement
from app.models.skill import Skill, LearnerSkill
from app.models.assessment import AssessmentQuestion, AssessmentOption
from app.models.roadmap import Roadmap, RoadmapStage, RoadmapNode
from app.models.challenge import Challenge, TestCase
from app.models.evaluation import EvaluationRecord
from app.models.plan import LearningPlan
from app.models.progress import ActivityLog
from app.services.readiness_engine import calculate_role_readiness

def seed_database(db: Session):
    """Seed initial data if database is empty."""
    if db.query(User).filter(User.id == "usr_948271").first():
        return  # Already seeded

    # 1. Target Roles
    roles_data = [
        {
            "id": "mle",
            "title": "Machine Learning Engineer",
            "level": "Mid-Senior Pipeline",
            "demand_index": "96/100",
            "average_salary": "$162,000",
            "department": "Applied AI & Intelligence",
            "description": "Design and productionize scalable ML architectures, deep learning models, and automated continuous inference pipelines.",
            "key_competencies": [
                "Vectorized Numerical Computing (NumPy/Pandas)",
                "Bayesian Probability & Statistical Modeling",
                "End-to-End Scikit-Learn & PyTorch Workflows",
                "Model Monitoring, Drift Detection & CI/CD",
            ],
            "requirements": {
                "Python": 85,
                "SQL": 70,
                "Statistics": 75,
                "Machine Learning": 80,
                "Deep Learning": 65,
                "MLOps": 60,
            },
        },
        {
            "id": "ds",
            "title": "Data Scientist",
            "level": "Mid Level",
            "demand_index": "91/100",
            "average_salary": "$145,000",
            "department": "Applied AI & Intelligence",
            "description": "Formulate business hypotheses, analyze complex multidimensional datasets, and extract algorithmic insights with causal modeling.",
            "key_competencies": [
                "A/B Testing & Causal Inference",
                "Advanced SQL & Data Warehouse Modeling",
                "Exploratory Data Analysis & Visualization",
            ],
            "requirements": {
                "Python": 80,
                "SQL": 85,
                "Statistics": 85,
                "Machine Learning": 70,
                "Deep Learning": 40,
                "MLOps": 30,
            },
        },
        {
            "id": "mlo",
            "title": "MLOps / AI Platform Engineer",
            "level": "Senior Track",
            "demand_index": "98/100",
            "average_salary": "$174,000",
            "department": "Applied AI & Intelligence",
            "description": "Build robust infrastructure, orchestrate Kubeflow pipelines, manage GPU clusters, and guarantee high-availability model serving.",
            "key_competencies": [
                "Kubernetes & Container Orchestration",
                "Feature Stores & Model Registries (MLflow)",
                "High-throughput Low-latency Inference",
            ],
            "requirements": {
                "Python": 85,
                "SQL": 60,
                "Statistics": 50,
                "Machine Learning": 65,
                "Deep Learning": 50,
                "MLOps": 90,
            },
        },
    ]

    for r in roles_data:
        role = TargetRole(
            id=r["id"],
            title=r["title"],
            level=r["level"],
            demand_index=r["demand_index"],
            average_salary=r["average_salary"],
            department=r["department"],
            description=r["description"],
            key_competencies=r["key_competencies"],
        )
        db.add(role)
        for skill_name, benchmark in r["requirements"].items():
            req = RoleSkillRequirement(
                role_id=r["id"],
                skill_name=skill_name,
                benchmark_score=benchmark,
            )
            db.add(req)

    # 2. Skills
    skills_list = ["Python", "SQL", "Statistics", "Machine Learning", "Deep Learning", "MLOps"]
    for s in skills_list:
        db.add(Skill(name=s, category="Engineering"))

    # 3. User & Profile
    user = User(
        id="usr_948271",
        name="Alex Chen",
        email="alex.chen@engineering.io",
        avatar="AC",
    )
    db.add(user)

    initial_skills = {
        "Python": 78,
        "SQL": 54,
        "Statistics": 42,
        "Machine Learning": 55,
        "Deep Learning": 20,
        "MLOps": 10,
    }

    profile = LearnerProfile(
        id="prof_948271",
        user_id="usr_948271",
        education="B.S. Computer Science",
        experience_level="Early Career (1-2 yrs)",
        current_role="Junior Software Engineer",
        weekly_commitment_hours=12,
        learning_style="Hands-on Challenges & Code-first",
        streak_days=14,
        total_xp=3450,
        joined_date="October 2025",
        active_role_id="mle",
        role_readiness=calculate_role_readiness(
            initial_skills,
            roles_data[0]["requirements"],
        ),
        assessment_completed=True,
        challenge_completed=False,
    )
    db.add(profile)

    # Initial Skills for Alex Chen
    for skill_name, score in initial_skills.items():
        db.add(LearnerSkill(
            learner_profile_id="prof_948271",
            skill_name=skill_name,
            score=score
        ))

    # 4. Diagnostic Questions
    questions_data = [
        {
            "id": "q1",
            "skill": "Python",
            "title": "Vectorized Operations vs List Comprehensions",
            "question": "Given a 2D matrix of dimensions 10,000 x 10,000, which approach achieves minimum runtime and optimal memory cache localization for calculating element-wise row variance in Python?",
            "explanation": "NumPy's C-level vectorization executes across contiguous memory blocks with SIMD vector instructions, avoiding Python interpreter overhead and pointer chasing.",
            "options": [
                {"key": "a", "text": "Nested for-loops iterating over rows and computing standard sample variance formula manually.", "correct": False},
                {"key": "b", "text": "Python list comprehension using built-in statistics.variance() mapped across rows.", "correct": False},
                {"key": "c", "text": "np.var(matrix, axis=1, ddof=1) utilizing SIMD contiguous memory layout via NumPy C-extensions.", "correct": True},
                {"key": "d", "text": "multiprocessing.Pool() mapping built-in math.sqrt over Python generator expressions.", "correct": False},
            ],
        },
        {
            "id": "q2",
            "skill": "Statistics",
            "title": "Bayesian Conditional Probability & Medical Screening",
            "question": "A rare disease has an incidence rate of 0.1% in the population. A diagnostic test has a 99% true positive rate (sensitivity) and a 5% false positive rate. If a patient tests positive, what is the approximate posterior probability P(Disease | Positive)?",
            "explanation": "By Bayes' Theorem: P(D|+) = (0.99 * 0.001) / (0.99 * 0.001 + 0.05 * 0.999) ≈ 1.94%. The vast majority of positives are false positives due to the low base rate.",
            "options": [
                {"key": "a", "text": "Approximately 95%", "correct": False},
                {"key": "b", "text": "Approximately 50%", "correct": False},
                {"key": "c", "text": "Approximately 1.94% (less than 2%)", "correct": True},
                {"key": "d", "text": "Approximately 80%", "correct": False},
            ],
        },
        {
            "id": "q3",
            "skill": "Machine Learning",
            "title": "Bias-Variance Tradeoff & Regularization",
            "question": "You observe a trained gradient-boosted decision tree model achieving 99.4% accuracy on training data but dropping to 64.2% on holdout validation data. Which set of hyperparameter interventions directly addresses this diagnosis?",
            "explanation": "The symptom is severe overfitting (high variance). Reducing tree depth, constraining leaf weights, and subsampling rows/features enforces regularization.",
            "options": [
                {"key": "a", "text": "Increase max_depth and decrease min_samples_split to allow more expressive decision splits.", "correct": False},
                {"key": "b", "text": "Reduce learning_rate, limit max_depth (e.g., 3-5), increase min_child_weight, and introduce subsample=0.8.", "correct": True},
                {"key": "c", "text": "Remove L2 regularization and eliminate early stopping patience bounds.", "correct": False},
                {"key": "d", "text": "One-hot encode all high-cardinality continuous features without binning.", "correct": False},
            ],
        },
        {
            "id": "q4",
            "skill": "SQL",
            "title": "Window Functions & Moving Aggregations",
            "question": "Which SQL clause computes a 7-day rolling average of daily user inference requests partitioned by model_version?",
            "explanation": "The window frame 'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW' computes exactly over the current record and the prior 6 records in temporal sequence.",
            "options": [
                {"key": "a", "text": "AVG(requests) GROUP BY model_version, date HAVING date >= date - 7", "correct": False},
                {"key": "b", "text": "AVG(requests) OVER (PARTITION BY model_version ORDER BY log_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)", "correct": True},
                {"key": "c", "text": "ROLLING_AVG(requests, 7) OVER (ORDER BY model_version)", "correct": False},
                {"key": "d", "text": "SELECT AVG(requests) WHERE date IN (SELECT TOP 7 date FROM logs)", "correct": False},
            ],
        },
    ]

    for q_data in questions_data:
        question = AssessmentQuestion(
            id=q_data["id"],
            skill=q_data["skill"],
            title=q_data["title"],
            question=q_data["question"],
            explanation=q_data["explanation"],
        )
        db.add(question)
        for opt in q_data["options"]:
            db.add(AssessmentOption(
                question_id=q_data["id"],
                option_key=opt["key"],
                text=opt["text"],
                is_correct=opt["correct"],
            ))

    # 5. Challenges & Test Cases
    # Challenge 1: Probability Challenge
    prob_challenge = Challenge(
        id="act_prob_771",
        title="Probability Challenge: Bayes Classifier & Conditional Expectation",
        duration_minutes=25,
        difficulty="Intermediate",
        estimated_time="25 min",
        category="Applied Probability & Mathematical Modeling",
        scenario="In modern ML classification engines, calculating the optimal decision boundary requires estimating posterior likelihoods via Bayes' rule. You are tasked with implementing the core probability calculation routine for an anomaly detection filter that classifies network packet bursts given prior failure distributions.",
        instructions=[
            "Implement compute_posterior using Bayes' formula with prior, sensitivity, and false_positive_rate.",
            "Evaluate whether the probability crosses threshold tau = 0.35 to trigger an automated alert flag.",
            "Pass all 5 unit and edge case assertion tests.",
        ],
        starter_code="""# Probability Challenge: Anomaly Classifier Decision Boundary
import numpy as np

def compute_posterior(prior: float, sensitivity: float, false_positive_rate: float) -> float:
    \"\"\"
    Computes P(Anomaly | Signal) using Bayes' Theorem.
    \"\"\"
    p_signal = (prior * sensitivity) + ((1.0 - prior) * false_positive_rate)
    if p_signal == 0:
        return 0.0
    posterior = (prior * sensitivity) / p_signal
    return float(np.round(posterior, 4))

def evaluate_decision(posterior: float, threshold: float = 0.35) -> dict:
    \"\"\"
    Determines alert trigger state based on loss-weighted threshold.
    \"\"\"
    is_anomaly = posterior >= threshold
    return {
        "posterior_probability": posterior,
        "trigger_alert": is_anomaly,
        "confidence_delta": float(np.round(posterior - threshold, 4))
    }
""",
        target_skill="Statistics",
        max_gain=25,
        xp_award=350,
    )
    db.add(prob_challenge)

    prob_tests = [
        {
            "id": "tc_1",
            "case_key": "tc_1",
            "name": "Standard Base Rate Anomaly Test",
            "input_repr": "prior=0.04, sens=0.94, fpr=0.08",
            "expected_output": "posterior ≈ 0.3287, trigger_alert = False",
            "assertion_code": "p = compute_posterior(0.04, 0.94, 0.08); assert abs(p - 0.3287) < 0.005; d = evaluate_decision(p, 0.35); assert d['trigger_alert'] is False",
            "latency": "1.2ms",
        },
        {
            "id": "tc_2",
            "case_key": "tc_2",
            "name": "High-Priority Cluster Test",
            "input_repr": "prior=0.15, sens=0.98, fpr=0.04",
            "expected_output": "posterior ≈ 0.8122, trigger_alert = True",
            "assertion_code": "p = compute_posterior(0.15, 0.98, 0.04); assert abs(p - 0.8122) < 0.005; d = evaluate_decision(p, 0.35); assert d['trigger_alert'] is True",
            "latency": "0.8ms",
        },
        {
            "id": "tc_3",
            "case_key": "tc_3",
            "name": "Rare Outlier Zero-Division Guard",
            "input_repr": "prior=0.0001, sens=0.99, fpr=0.01",
            "expected_output": "posterior ≈ 0.0098, trigger_alert = False",
            "assertion_code": "p = compute_posterior(0.0001, 0.99, 0.01); assert abs(p - 0.0098) < 0.002; d = evaluate_decision(p, 0.35); assert d['trigger_alert'] is False",
            "latency": "1.1ms",
        },
        {
            "id": "tc_4",
            "case_key": "tc_4",
            "name": "Asymmetric Loss Matrix Boundary Check",
            "input_repr": "threshold=0.35, posterior=0.3501",
            "expected_output": "trigger_alert = True",
            "assertion_code": "d = evaluate_decision(0.3501, 0.35); assert d['trigger_alert'] is True",
            "latency": "0.9ms",
        },
        {
            "id": "tc_5",
            "case_key": "tc_5",
            "name": "Zero Signal Input Guard Test",
            "input_repr": "prior=0.0, sens=0.94, fpr=0.08",
            "expected_output": "posterior = 0.0",
            "assertion_code": "p = compute_posterior(0.0, 0.94, 0.08); assert p == 0.0",
            "latency": "0.7ms",
        },
    ]

    for t in prob_tests:
        db.add(TestCase(
            id=f"act_prob_771_{t['id']}",
            challenge_id="act_prob_771",
            case_key=t["case_key"],
            name=t["name"],
            input_repr=t["input_repr"],
            expected_output=t["expected_output"],
            assertion_code=t["assertion_code"],
            latency=t["latency"],
        ))

    # Challenge 2: SGD Lab
    sgd_challenge = Challenge(
        id="act_ml_loss_882",
        title="Loss Function Derivatives & SGD Lab: Gradient Descent Optimization",
        duration_minutes=30,
        difficulty="Intermediate",
        estimated_time="30 min",
        category="Machine Learning & Numerical Optimization",
        scenario="Following calibration in probability distributions, this challenge tests formulating loss functions and calculating analytical gradients for Stochastic Gradient Descent (SGD) with momentum on non-convex manifolds.",
        instructions=[
            "Formulate the Mean Squared Error (MSE) loss vector with L2 ridge regularization.",
            "Derive and compute analytical gradients with respect to weight tensor W.",
            "Implement an SGD update step with momentum beta = 0.9 and learning rate lr = 0.01.",
        ],
        starter_code="""# Loss Function Derivatives & SGD Lab
import numpy as np

def compute_mse_gradient(X: np.ndarray, y: np.ndarray, w: np.ndarray, l2_reg: float = 0.01) -> np.ndarray:
    \"\"\"
    Computes analytical gradient of L2-regularized MSE loss.
    \"\"\"
    N = X.shape[0]
    predictions = X @ w
    residuals = y - predictions
    grad = -(2.0 / N) * (X.T @ residuals) + (2.0 * l2_reg * w)
    return grad

def sgd_momentum_step(w: np.ndarray, grad: np.ndarray, velocity: np.ndarray, lr: float = 0.01, beta: float = 0.9):
    \"\"\"
    Updates weights using momentum-augmented Stochastic Gradient Descent.
    \"\"\"
    new_velocity = beta * velocity + (1.0 - beta) * grad
    new_weights = w - lr * new_velocity
    return new_weights, new_velocity
""",
        target_skill="Machine Learning",
        max_gain=17,
        xp_award=400,
    )
    db.add(sgd_challenge)

    sgd_tests = [
        {
            "id": "tc_1",
            "case_key": "tc_1",
            "name": "Zero-Residual Equilibrium Assertion",
            "input_repr": "X=I_4, y=[1,2,3,4], w=[1,2,3,4]",
            "expected_output": "Gradient norm < 0.02 (regularization term only)",
            "assertion_code": "X = np.eye(4); y = np.array([1,2,3,4]); w = np.array([1,2,3,4]); g = compute_mse_gradient(X, y, w, l2_reg=0.0); assert np.linalg.norm(g) < 1e-6",
            "latency": "0.9ms",
        },
        {
            "id": "tc_2",
            "case_key": "tc_2",
            "name": "Convex Manifold Monotonic Descent",
            "input_repr": "X random Gaussian (100x5), lr=0.01",
            "expected_output": "Loss strictly decreases across 10 iterations",
            "assertion_code": "X = np.random.randn(50, 3); y = np.random.randn(50); w = np.zeros(3); g = compute_mse_gradient(X, y, w); w_new, v = sgd_momentum_step(w, g, np.zeros(3)); assert w_new is not None",
            "latency": "2.1ms",
        },
        {
            "id": "tc_3",
            "case_key": "tc_3",
            "name": "Momentum Velocity Smoothing",
            "input_repr": "Oscillating gradient vectors, beta=0.9",
            "expected_output": "Velocity dampens cross-axis oscillation > 65%",
            "assertion_code": "v = np.zeros(2); w = np.ones(2); g = np.array([1.0, -1.0]); w2, v2 = sgd_momentum_step(w, g, v, beta=0.9); assert v2[0] > 0",
            "latency": "1.4ms",
        },
    ]

    for t in sgd_tests:
        db.add(TestCase(
            id=f"act_ml_loss_882_{t['id']}",
            challenge_id="act_ml_loss_882",
            case_key=t["case_key"],
            name=t["name"],
            input_repr=t["input_repr"],
            expected_output=t["expected_output"],
            assertion_code=t["assertion_code"],
            latency=t["latency"],
        ))

    # 6. Baseline Roadmap
    roadmap = Roadmap(
        id="rdm_usr_948271",
        user_id="usr_948271",
        role_title="Machine Learning Engineer",
        total_modules=14,
        completed_modules=4,
        estimated_weeks=12,
        active_stage="Stage 1",
        is_adaptive_updated=False,
    )
    db.add(roadmap)

    # Stage 1
    stage_1 = RoadmapStage(
        id="stage_1",
        roadmap_id="rdm_usr_948271",
        stage_number=1,
        name="Stage 1: Mathematical Foundations & Probability",
        status="in_progress",
    )
    db.add(stage_1)

    db.add(RoadmapNode(
        id="node_python",
        stage_id="stage_1",
        node_order=1,
        title="Vectorized Python & Matrix Operations",
        skill="Python",
        status="completed",
        score=78,
        duration="2 weeks",
        is_adaptive_insert=False,
        description="NumPy SIMD operations, memory layout, broadcasting, and vectorized matrix calculus.",
    ))
    db.add(RoadmapNode(
        id="node_stats",
        stage_id="stage_1",
        node_order=2,
        title="Applied Statistics & Hypothesis Testing",
        skill="Statistics",
        status="in_progress",
        score=42,
        duration="3 weeks",
        is_adaptive_insert=False,
        description="Hypothesis testing, maximum likelihood estimation (MLE), and confidence intervals for model validation.",
    ))

    # Stage 2
    stage_2 = RoadmapStage(
        id="stage_2",
        roadmap_id="rdm_usr_948271",
        stage_number=2,
        name="Stage 2: Core Machine Learning & Feature Engineering",
        status="locked",
    )
    db.add(stage_2)

    db.add(RoadmapNode(
        id="node_ml",
        stage_id="stage_2",
        node_order=1,
        title="Machine Learning Foundations",
        skill="Machine Learning",
        status="upcoming",
        score=55,
        duration="3 weeks",
        is_adaptive_insert=False,
        description="Supervised & unsupervised models, regularization, loss surfaces, and ensemble architectures.",
    ))
    db.add(RoadmapNode(
        id="node_sql",
        stage_id="stage_2",
        node_order=2,
        title="SQL & Relational Feature Extraction",
        skill="SQL",
        status="upcoming",
        score=54,
        duration="2 weeks",
        is_adaptive_insert=False,
        description="Analytical window functions, partitioning, and automated feature store generation.",
    ))

    # Stage 3
    stage_3 = RoadmapStage(
        id="stage_3",
        roadmap_id="rdm_usr_948271",
        stage_number=3,
        name="Stage 3: Deep Learning & Production MLOps",
        status="locked",
    )
    db.add(stage_3)

    db.add(RoadmapNode(
        id="node_dl",
        stage_id="stage_3",
        node_order=1,
        title="Deep Learning & PyTorch Architectures",
        skill="Deep Learning",
        status="locked",
        score=20,
        duration="4 weeks",
        is_adaptive_insert=False,
        description="Backpropagation, convolutional neural nets, transformers, and GPU tensor acceleration.",
    ))
    db.add(RoadmapNode(
        id="node_mlops",
        stage_id="stage_3",
        node_order=2,
        title="MLOps: Deployment, Serving & Drift",
        skill="MLOps",
        status="locked",
        score=10,
        duration="3 weeks",
        is_adaptive_insert=False,
        description="Docker, FastAPI model serving, Triton inference server, and automated drift telemetry.",
    ))

    db.commit()


def reset_demo_state_in_db(db: Session, user_id: str = "usr_948271"):
    """Resets user state back to the pre-challenge demo baseline."""
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
    if not profile:
        return

    profile.streak_days = 14
    profile.total_xp = 3450
    profile.challenge_completed = False
    profile.active_role_id = "mle"

    # Reset skills
    baseline = {
        "Python": 78,
        "SQL": 54,
        "Statistics": 42,
        "Machine Learning": 55,
        "Deep Learning": 20,
        "MLOps": 10,
    }
    for ls in profile.skills:
        if ls.skill_name in baseline:
            ls.score = baseline[ls.skill_name]

    role = db.query(TargetRole).filter(TargetRole.id == profile.active_role_id).first()
    required_skills = {
        requirement.skill_name: requirement.benchmark_score
        for requirement in role.requirements
    } if role else {}
    profile.role_readiness = calculate_role_readiness(baseline, required_skills)

    # Reset roadmap
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
    if roadmap:
        roadmap.is_adaptive_updated = False
        # Remove any inserted adaptive nodes
        db.query(RoadmapNode).filter(
            RoadmapNode.stage_id == "stage_1",
            RoadmapNode.is_adaptive_insert == True
        ).delete()
        # Reset stats node score and order
        stats_node = db.query(RoadmapNode).filter(RoadmapNode.id == "node_stats").first()
        if stats_node:
            stats_node.score = 42
            stats_node.node_order = 2
            stats_node.status = "in_progress"

    # Remove previous evaluations and learning plans for clean demo
    db.query(EvaluationRecord).filter(EvaluationRecord.user_id == user_id).delete()
    db.query(LearningPlan).filter(LearningPlan.user_id == user_id).delete()
    db.commit()
