# EduPath End-to-End Demo

This guide demonstrates the complete adaptive learning loop in EduPath.

The demo shows how a learner's demonstrated performance changes their skill state, readiness, roadmap, and next-best action.

---

## Demo Scenario

Target role:

Machine Learning Engineer

Clean baseline:

Role Readiness: 60%

Statistics: 42%

The learner then receives a targeted learning plan and completes a Bayesian Probability & Likelihood challenge.

Expected result:

Statistics: 42% → 67%

Role Readiness: 60% → 65%

The roadmap and next-best action then adapt.

---

# 1. Start the Services

Start FastAPI:

cd backend

python run.py

Start the frontend:

npm run dev

Start the Dockerized n8n instance.

Verify:

FastAPI:

http://127.0.0.1:8000

n8n:

http://localhost:5678

---

# 2. Reset the Demo

Always reset before performing the demo.

Run:

curl -X POST http://127.0.0.1:8000/api/v1/demo/reset -H "Content-Type: application/json" -d "{}"

Refresh the frontend.

Verify the baseline:

Role Readiness: approximately 60%

Statistics: approximately 42%

The learner should not yet have completed the demonstration challenge.

---

# 3. Trigger the Planner

Run:

curl -X POST http://localhost:5678/webhook/edupath/planner -H "Content-Type: application/json" -d "{}"

This triggers the n8n planner workflow.

The workflow:

Get Learner Profile
      ↓
Get Skill Gaps
      ↓
Get Roadmap
      ↓
Build Planner Context
      ↓
Gemini Planner
      ↓
Validate Output
      ↓
Persist Plan

---

# 4. Verify the Plan

The generated plan can be checked using:

GET /api/v1/planner/plan/latest

The plan should contain focused learning steps based on the learner's current state.

The planner should respect the learner's weekly commitment.

For the demo learner:

Weekly commitment:

12 hours

---

# 5. Open the Challenge

Open the EduPath frontend.

Navigate to the active challenge.

Demo challenge:

Bayesian Probability & Likelihood Challenge

Challenge ID:

act_prob_771

The challenge provides a practical way for the learner to demonstrate the targeted skill.

---

# 6. Complete the Challenge

Complete the challenge through the frontend.

Submit the solution.

The system evaluates the submission.

The evaluation result becomes new learner evidence.

---

# 7. Observe the Evaluation

After successful evaluation, the learner's Statistics skill should update.

Expected demonstration:

Statistics:

42% → 67%

This represents a 25-point improvement based on the demonstrated challenge result.

---

# 8. Observe Readiness Recalculation

The new evidence is then used to recalculate role readiness.

Expected result:

Role Readiness:

60% → 65%

---

# 9. Observe Roadmap Adaptation

After readiness and skill-gap recalculation, the roadmap is updated.

The system can insert or reorder learning work based on the new learner state.

The demo can show a new practice/remediation node such as:

Probability Practice

The important behavior is that the roadmap is no longer identical to the original state.

---

# 10. Observe Next Best Action

Return to the dashboard.

The Next Best Action should reflect the updated learner state.

The demo can show a new action such as:

Loss Function Derivatives & SGD Lab

The recommendation changes because the learner has demonstrated improvement in the previous targeted area.

---

# 11. Complete Demo Flow

The full sequence is:

Reset
 ↓
Learner State
 ↓
Skill Gap
 ↓
AI Planner
 ↓
Learning Plan
 ↓
Challenge
 ↓
Evaluation
 ↓
Skill Update
 ↓
Readiness Update
 ↓
Roadmap Adaptation
 ↓
Next Best Action

---

# 12. Expected Result

Before the challenge:

Readiness: 60%

Statistics: 42%

After the challenge:

Statistics: 67%

Readiness: 65%

Then:

Roadmap changes

Next Best Action changes

This demonstrates the core adaptive loop.

---

# 13. Demo Reset

If the demo needs to be repeated, run the reset endpoint again:

curl -X POST http://127.0.0.1:8000/api/v1/demo/reset -H "Content-Type: application/json" -d "{}"

Then refresh the frontend and repeat the flow.

---

# 14. Judge Explanation

The key explanation for the demo is:

"EduPath doesn't just generate a roadmap. The learner demonstrates a skill through a challenge, that result becomes new evidence, and the system recalculates readiness and adapts the roadmap and next-best action."

The important distinction is that the AI does not directly own the learner's state.

The backend remains the source of truth.