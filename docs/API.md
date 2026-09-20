# EduPath API Reference

EduPath exposes a FastAPI backend for learner state, skill analysis, roadmap management, planning, challenges, evaluation, and adaptation.

Base URL:

http://127.0.0.1:8000

Swagger UI:

http://127.0.0.1:8000/docs

---

# Learner

## Get Learner Profile

GET

/api/v1/learner/profile

Returns the current learner profile and learner state.

Example information includes:

- Target role
- Current skills
- Weekly commitment
- Learning style
- Role readiness
- Assessment status
- Challenge status

---

# Skill Gap

## Get Skill Gap Analysis

GET

/api/v1/skills/gap-analysis

Returns the learner's skill gaps relative to the target role.

The response can include:

- Role title
- Role readiness
- Critical gap count
- Top priority gap
- Current skill score
- Required skill score
- Gap
- Deficit percentage
- Mastery
- Urgency

---

# Roadmap

## Get Roadmap

GET

/api/v1/roadmap

Returns the learner's current roadmap.

Roadmap information can include:

- Target role
- Total modules
- Completed modules
- Estimated duration
- Active stage
- Roadmap nodes
- Node status
- Score
- Duration
- Adaptive insertion state

---

# Planner

## Generate Planner Workflow

The planner is triggered through n8n.

POST

http://localhost:5678/webhook/edupath/planner

The webhook starts the AI planning workflow.

The workflow retrieves the learner's current state, sends the required context to Gemini, validates the generated plan, and persists the resulting plan through FastAPI.

---

## Get Latest Planner Plan

GET

/api/v1/planner/plan/latest

Returns the most recently persisted learning plan.

The plan contains focused learning steps generated from the learner's current context.

---

# Next Best Action

## Get Next Best Action

GET

/api/v1/recommendations/next-best-action

Returns the learner's current recommended next action.

The response can include:

- ID
- Title
- Module
- Duration
- Difficulty
- Target skill
- Current skill score
- Projected skill score
- XP award
- Reason
- Impact summary
- Follow-up status

The recommendation is based on the learner's current state after skill and roadmap updates.

---

# Challenges

## Evaluate Challenge

POST

/api/v1/challenges/{challenge_id}/evaluate

Example demo challenge:

act_prob_771

Example endpoint:

/api/v1/challenges/act_prob_771/evaluate

The endpoint evaluates the learner's challenge submission and produces the evidence used by the adaptive learning loop.

---

# Demo

## Reset Demo State

POST

/api/v1/demo/reset

Resets the demo learner to the clean baseline used for the end-to-end demonstration.

Example:

curl -X POST http://127.0.0.1:8000/api/v1/demo/reset -H "Content-Type: application/json" -d "{}"

Expected baseline:

Role Readiness: approximately 60%

Statistics: approximately 42%

---

# Complete API Flow

The main adaptive flow is:

GET /api/v1/learner/profile
        ↓
GET /api/v1/skills/gap-analysis
        ↓
GET /api/v1/roadmap
        ↓
POST /webhook/edupath/planner
        ↓
GET /api/v1/planner/plan/latest
        ↓
POST /api/v1/challenges/{challenge_id}/evaluate
        ↓
GET /api/v1/recommendations/next-best-action

The challenge evaluation triggers the skill evidence and adaptation process.

---

# API Documentation

For the complete interactive API reference, run the backend and open:

http://127.0.0.1:8000/docs

Swagger provides the authoritative list of currently available backend endpoints and their request/response schemas.