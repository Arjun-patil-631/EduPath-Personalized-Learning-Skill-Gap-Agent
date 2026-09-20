# EduPath n8n Agentic Workflows

This directory contains the production n8n workflows connecting autonomous AI reasoning agents (powered by Google Gemini) with the deterministic FastAPI EduPath state engine.

## Workflows Included

1. **`planner_workflow.json` (EduPath Planner Agent)**
   - **Trigger:** Webhook `POST /webhook/edupath/planner` (or test via n8n UI).
   - **Flow:**
     1. Webhook receives planning request.
     2. Fetches authoritative live learner state from FastAPI:
        - `GET http://host.docker.internal:8000/api/v1/learner/profile`
        - `GET http://host.docker.internal:8000/api/v1/skills/gap-analysis`
        - `GET http://host.docker.internal:8000/api/v1/roadmap`
     3. Combines state into a prompt context using `Edit Fields`.
     4. Prompts **Google Gemini** with strict constraints (1-3 steps, within weekly hours, high/medium/low priority).
     5. Validates structure with a JavaScript Code Node (`Validate Planner Output`).
     6. Persists the validated learning plan to FastAPI via `POST http://host.docker.internal:8000/api/v1/planner/plan`.

2. **`evaluation_workflow.json` (EduPath Evaluation Agent)**
   - **Trigger:** Webhook `POST /webhook/edupath/evaluate`.
   - **Flow:**
     1. Receives code submission and test metrics.
     2. Evaluates algorithmic correctness with Google Gemini.
     3. Validates score (0-100), feedback, and evidence.
     4. Posts authoritative evaluation to FastAPI:
        - `POST http://host.docker.internal:8000/api/v1/evaluations/submit`
     5. Returns the complete adaptation envelope containing dynamic skill delta, recalculated readiness, mutated roadmap DAG, and updated Next Best Action.

## Importing Workflows into n8n

### Option A: Via Docker CLI
```bash
# Copy and import planner workflow
docker cp n8n/planner_workflow.json n8n:/tmp/planner_workflow.json
docker exec n8n n8n import:workflow --input=/tmp/planner_workflow.json

# Copy and import evaluation workflow
docker cp n8n/evaluation_workflow.json n8n:/tmp/evaluation_workflow.json
docker exec n8n n8n import:workflow --input=/tmp/evaluation_workflow.json
```

### Option B: Via n8n Web UI
1. Open http://localhost:5678.
2. In the top-right menu of the canvas, select **Import from File...**
3. Select `n8n/planner_workflow.json` or `n8n/evaluation_workflow.json`.
4. Ensure the Google Gemini credentials are selected.
5. Click **Save** and **Activate**.
