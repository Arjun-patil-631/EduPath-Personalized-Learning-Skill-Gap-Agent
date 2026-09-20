import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LearnerProvider } from "./context/LearnerContext.jsx";
import { AppLayout } from "./layouts/AppLayout.jsx";

// Pages
import { Landing } from "./pages/Landing.jsx";
import { Onboarding } from "./pages/Onboarding.jsx";
import { CareerGoal } from "./pages/CareerGoal.jsx";
import { Assessment } from "./pages/Assessment.jsx";
import { Profile } from "./pages/Profile.jsx";
import { SkillGap } from "./pages/SkillGap.jsx";
import { Roadmap } from "./pages/Roadmap.jsx";
import { Challenge } from "./pages/Challenge.jsx";
import { Evaluation } from "./pages/Evaluation.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <LearnerProvider>
      <BrowserRouter>
        <Routes>
          {/* Main App Layout Wrapper */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/calibration" element={<Onboarding />} />
            <Route path="/career-goal" element={<CareerGoal />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/skill-gap" element={<SkillGap />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LearnerProvider>
  );
}
