import React, { useState } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  GitBranch,
  Target,
  User,
  Zap,
  Menu,
  X,
  Flame,
  Briefcase,
  RotateCcw,
  Sparkles,
  Terminal,
  Activity,
  Layers,
} from "lucide-react";
import { useLearner } from "../hooks/useLearner.js";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";

export function AppLayout() {
  const { profile, skillGapData, resetDemo } = useLearner();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const readiness = profile?.roleReadiness || (skillGapData ? skillGapData.roleReadiness : 52);
  const targetRoleTitle = profile?.targetRole?.title || "Machine Learning Engineer";

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Skill Gap Matrix", href: "/skill-gap", icon: Target },
    { name: "Adaptive Roadmap", href: "/roadmap", icon: GitBranch },
    { name: "Active Challenge", href: "/challenge", icon: Zap },
    { name: "Diagnostic Test", href: "/assessment", icon: Terminal },
    { name: "Learner Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col font-sans">
      {/* Persistent Master Top Header */}
      <header className="sticky top-0 z-40 bg-[#111827]/90 backdrop-blur-md border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white shadow-[0_0_16px_rgba(14,165,233,0.4)] group-hover:shadow-[0_0_24px_rgba(14,165,233,0.6)] transition-all">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-[#F8FAFC] tracking-tight leading-tight flex items-center gap-1.5">
                  EduPath
                  <span className="text-[10px] font-mono font-medium text-[#0EA5E9] bg-[#0EA5E9]/10 px-1.5 py-0.5 rounded border border-[#0EA5E9]/20">
                    ADAPTIVE
                  </span>
                </span>
                <span className="text-[10px] font-mono text-[#64748B] hidden sm:inline">
                  AI Career Preparation Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.slice(0, 4).map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                      isActive
                        ? "bg-[#161F30] text-[#0EA5E9] font-semibold border border-[#334155]"
                        : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#161F30]/50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right Status Controls & Metrics */}
          <div className="flex items-center gap-3">
            {/* Active Target Role Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-[#161F30] border border-[#1E293B] px-3 py-1.5 rounded-lg">
              <Briefcase className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span className="text-xs font-mono text-[#94A3B8]">Target:</span>
              <span className="text-xs font-mono font-semibold text-[#F8FAFC]">
                {targetRoleTitle}
              </span>
            </div>

            {/* Role Readiness Metric */}
            <div className="flex items-center gap-2 bg-[#161F30] border border-[#1E293B] px-3 py-1.5 rounded-lg">
              <Activity className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-xs font-mono text-[#94A3B8] hidden sm:inline">Readiness:</span>
              <span className="text-xs font-mono font-bold text-[#34D399]">
                {readiness}%
              </span>
            </div>

            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#161F30] border border-[#1E293B] px-2.5 py-1.5 rounded-lg text-xs font-mono text-[#FBBF24]">
              <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{profile?.streakDays || 14}d</span>
            </div>

            {/* Reset Demo Button */}
            <button
              onClick={resetDemo}
              title="Reset sample state to test adaptive loop again"
              className="p-2 rounded-lg bg-[#161F30] border border-[#1E293B] hover:border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-mono transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">Reset State</span>
            </button>

            {/* User Avatar */}
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E293B] to-[#334155] border border-[#0EA5E9]/40 flex items-center justify-center font-mono text-xs font-bold text-[#0EA5E9] hover:border-[#0EA5E9] transition-all"
            >
              {profile?.avatar || "AC"}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#161F30] border border-[#1E293B] text-[#94A3B8]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1E293B] bg-[#111827] px-4 py-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono transition-colors ${
                    isActive
                      ? "bg-[#161F30] text-[#0EA5E9] font-semibold"
                      : "text-[#94A3B8] hover:bg-[#161F30]/50 hover:text-[#F8FAFC]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Persistent Technical System Status Footer */}
      <footer className="border-t border-[#1E293B] bg-[#0B0F19] py-4 text-xs font-mono text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>EduPath Cognitive Loop Engine Active</span>
            <span className="text-[#334155]">•</span>
            <span className="text-[#94A3B8]">FastAPI Ready</span>
          </div>

          <div className="flex items-center gap-4 text-[#94A3B8]">
            <Link to="/career-goal" className="hover:text-[#0EA5E9] transition-colors">
              Target Roles
            </Link>
            <Link to="/assessment" className="hover:text-[#0EA5E9] transition-colors">
              Diagnostics
            </Link>
            <Link to="/skill-gap" className="hover:text-[#0EA5E9] transition-colors">
              Skill Matrix
            </Link>
            <Link to="/roadmap" className="hover:text-[#0EA5E9] transition-colors">
              Roadmap
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
