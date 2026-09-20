# EduPath — Adaptive AI Career Preparation Platform

> **Don't just follow a roadmap. Build the skills, prove them, and let the roadmap adapt.**

EduPath is an **adaptive AI career preparation platform** that continuously determines what a learner should learn next based on their **skills, target role, progress, and demonstrated performance**.

Built for the **Product Space Agentic AI Hackathon — September 2026**.

---

## 🚀 The Problem

Most learning platforms provide static roadmaps and track progress mainly through course completion.

But completing a course does not necessarily mean a learner has **demonstrated the required skill**.

The real question is:

> **What should this learner learn next based on what they can actually demonstrate?**

---

## 💡 Our Solution

EduPath creates a continuous adaptive learning loop:

```text
Learner Evidence
      ↓
Skill Gap Analysis
      ↓
AI Learning Planner
      ↓
Personalized Learning Step
      ↓
Practical Challenge
      ↓
Evaluation
      ↓
New Skill Evidence
      ↓
Roadmap Adaptation
      ↓
Next Best Action
      ↺
```

**AI proposes. The system validates and adapts.**

The FastAPI backend remains the **source of truth**, while AI generates learning plans and evaluations.

---

## 🤖 Agentic AI

EduPath uses AI as part of a workflow rather than as a standalone chatbot.

* **Planner Agent** — Generates personalized learning steps based on learner context.
* **Evaluation Agent** — Evaluates practical challenges and produces skill evidence.
* **Adaptation Engine** — Updates skills, readiness, gaps, roadmap, and next-best action using validated evidence.

---

## 🎯 Working Demo

**Target Role:** Machine Learning Engineer

Initial state:

```text
Role Readiness: 60%
Statistics: 42%
```

The learner completes:

> **Bayesian Probability & Likelihood Challenge**

After evaluation:

```text
Statistics:     42% → 67%
Role Readiness: 60% → 65%
```

The new evidence changes the learner's roadmap and **Next Best Action**.

This demonstrates the complete adaptive learning loop.

---

## 🛠️ Tech Stack

* **Frontend:** React + Vite
* **Backend:** Python + FastAPI
* **Database:** SQLite + SQLAlchemy
* **AI:** Google Gemini
* **Orchestration:** n8n
* **Infrastructure:** Docker
* **Testing:** Pytest

---

## 📚 Documentation

Detailed technical information is available in the `docs/` directory.

| Documentation                           | Description                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------- |
| [SETUP.md](docs/SETUP.md)               | Complete installation and environment setup                                                 |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, data flow, agents, and adaptation logic                                |
| [DEMO.md](docs/DEMO.md)                 | End-to-end demo flow, reset procedure, planner, challenge, evaluation, and expected results |
| [API.md](docs/API.md)                   | Backend API endpoints, request/response details, and API usage                              |

---

## 🔗 Project Links

* 🎥 **Demo Video:** ADD LINK
* 🚀 **Live Demo:** ADD LINK
* 📊 **Presentation:** ADD LINK
* 💻 **GitHub:** ADD LINK
* 🏆 **Hackathon Submission:** ADD LINK

---

## 🏆 Hackathon

Built for the **Product Space Agentic AI Hackathon — September 2026**.

> **Generate → Practice → Evaluate → Learn from Evidence → Adapt**
