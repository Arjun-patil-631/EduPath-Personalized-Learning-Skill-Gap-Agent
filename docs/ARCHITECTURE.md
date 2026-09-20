# EduPath Architecture

## Overview

EduPath is built around a continuous adaptive learning loop.

The system combines:

- React/Vite frontend
- FastAPI backend
- SQLite and SQLAlchemy
- n8n workflow orchestration
- Google Gemini
- Deterministic learner-state and adaptation logic

The key architectural principle is:

AI proposes. The backend validates and adapts.

---

## High-Level Architecture

React / Vite
      |
      v
FastAPI Backend
      |
      +----------------------+
      |                      |
      v                      v
Learner State          Deterministic
Database               EduPath Engines
      |                      |
      +----------+-----------+
                 |
                 v
                n8n
          Workflow Orchestration
                 |
                 v
              Gemini
        Planner / Evaluation
                 |
                 v
        Validated AI Output
                 |
                 v
          FastAPI Persistence
                 |
                 v
       Skill + Readiness Update
                 |
                 v
         Roadmap Adaptation
                 |
                 v
        Next Best Action
                 |
                 v
             Frontend

---

## Frontend

The frontend provides the learner experience.

Core areas include:

- Landing
- Onboarding
- Assessment
- Learner Profile
- Career Goal
- Skill Gap
- Roadmap
- Challenge
- Evaluation
- Dashboard

The frontend communicates with the FastAPI backend through API requests.

It displays the learner's current state but does not serve as the authoritative source of learner data.

---

## Backend

FastAPI acts as the application's source of truth.

Responsibilities include:

- Learner state
- Current skills
- Skill gap calculations
- Role readiness
- Roadmap state
- Challenge evaluation
- Skill evidence updates
- Readiness recalculation
- Roadmap adaptation
- Next-best-action calculation
- Persistence

This keeps critical learner-state calculations deterministic and independent from the LLM.

---

## Database

EduPath uses:

- SQLite
- SQLAlchemy

The database stores the persistent application state required by the learning loop.

The backend reads and writes learner state through the application layer.

---

## n8n Orchestration

n8n is responsible for orchestrating the AI planning workflow.

Planner flow:

Webhook
   ↓
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
Validate Planner Output
   ↓
FastAPI Persistence

n8n connects the different application and AI steps without moving authoritative learner-state logic into the workflow.

---

## AI Planner

The planner receives learner-specific context including:

- Learner profile
- Current skills
- Target role
- Skill gaps
- Current roadmap
- Weekly commitment
- Learning style

The planner generates a focused learning plan.

The output is constrained by:

- Learner context
- Existing roadmap
- Prerequisites
- Weekly learning commitment
- Required output structure

AI-generated output is validated before it is persisted.

---

## Evaluation

The evaluation stage receives the learner's challenge submission.

The result is converted into structured evidence about the learner's demonstrated skill.

This evidence is then passed back to the backend.

---

## Adaptation Engine

The adaptation process is deterministic.

The flow is:

Challenge Evaluation
        ↓
Skill Evidence Update
        ↓
Readiness Recalculation
        ↓
Skill Gap Recalculation
        ↓
Roadmap Mutation
        ↓
Next Best Action

This prevents the LLM from directly deciding authoritative learner state.

---

## Why This Architecture?

The system intentionally separates AI reasoning from application state.

The AI is useful for:

- Planning
- Reasoning
- Evaluation
- Personalized recommendations

The deterministic backend is responsible for:

- State
- Validation
- Calculations
- Persistence
- Adaptation

This makes the adaptive loop more predictable and testable.

---

## Core Product Loop

The complete EduPath loop is:

Learner Evidence
      ↓
Skill Gap
      ↓
Learning Plan
      ↓
Practice
      ↓
Evaluation
      ↓
New Evidence
      ↓
Updated Skill State
      ↓
Updated Readiness
      ↓
Updated Roadmap
      ↓
Next Best Action
      ↺

The learner's demonstrated performance therefore becomes the input for the next cycle.