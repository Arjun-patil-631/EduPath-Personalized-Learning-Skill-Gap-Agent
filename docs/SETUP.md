# EduPath Setup Guide

This guide explains how to run EduPath locally.

## Prerequisites

Install the following:

- Git
- Python 3.x
- Node.js and npm
- Docker Desktop
- Access to a Google Gemini API credential for the AI workflow

Verify installations:

python --version
node --version
npm --version
docker --version

---

## 1. Clone the Repository

Clone the repository:

git clone <GITHUB_REPOSITORY_URL>

Enter the project:

cd EduPath-Personalized-Learning-Skill-Gap-Agent

---

## 2. Backend Setup

Open a terminal and enter the backend directory:

cd backend

Start the FastAPI backend:

python run.py

The backend should be available at:

http://127.0.0.1:8000

FastAPI Swagger documentation:

http://127.0.0.1:8000/docs

The backend is responsible for learner state, skill calculations, readiness, roadmap logic, challenge evaluation, and persistence.

---

## 3. Frontend Setup

Open a second terminal in the project root.

Install dependencies:

npm install

Start the development server:

npm run dev

Open the local URL displayed by Vite.

The frontend communicates with the FastAPI backend.

---

## 4. Start n8n

EduPath uses n8n for AI workflow orchestration.

Start the Dockerized n8n instance used by the project.

n8n should be available at:

http://localhost:5678

The planner workflow uses the webhook:

POST /webhook/edupath/planner

The n8n container communicates with the local FastAPI backend through:

host.docker.internal:8000

---

## 5. Gemini Configuration

The planner workflow uses Google Gemini.

Configure the Gemini credential inside n8n before running the planner workflow.

Do not commit:

- API keys
- passwords
- access tokens
- credentials
- secret environment files

to the repository.

---

## 6. Verify the Setup

After starting all services, verify:

Backend:

http://127.0.0.1:8000/docs

Frontend:

Use the Vite URL shown by npm run dev.

n8n:

http://localhost:5678

All three services should be running before performing the complete demo.

---

## 7. Run Backend Tests

From the backend directory:

pytest

The test suite verifies the backend's core behavior.

---

## Service Overview

Frontend:

React / Vite

Backend:

FastAPI / Python

Database:

SQLite / SQLAlchemy

AI orchestration:

n8n

AI model:

Google Gemini

Infrastructure:

Docker

---

## Troubleshooting

### Backend does not start

Verify that Python is installed and that the command is being executed from the backend directory.

### Frontend dependencies are missing

Run:

npm install

before:

npm run dev

### n8n cannot reach FastAPI

When n8n is running inside Docker, use:

host.docker.internal:8000

instead of:

localhost:8000

### Planner does not execute

Verify:

1. n8n is running
2. The planner workflow is active
3. The Gemini credential is configured
4. FastAPI is running
5. The planner webhook is being called using POST