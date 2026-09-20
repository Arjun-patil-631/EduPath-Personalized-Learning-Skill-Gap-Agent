import React from "react";

export function ProgressBar({
  value = 0,
  max = 100,
  targetValue = null,
  variant = "cyan", // 'cyan' | 'emerald' | 'amber' | 'crimson'
  height = "h-2.5",
  showLabels = false,
  label = "",
  sublabel = "",
  className = "",
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const targetPercentage = targetValue !== null ? Math.min(100, Math.max(0, Math.round((targetValue / max) * 100))) : null;

  const barColors = {
    cyan: "bg-[#0EA5E9] shadow-[0_0_12px_rgba(14,165,233,0.5)]",
    emerald: "bg-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.4)]",
    amber: "bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.4)]",
    crimson: "bg-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.4)]",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          <span className="text-[#94A3B8] font-sans font-medium">{label}</span>
          <div className="flex items-center gap-2">
            {sublabel && <span className="text-[#64748B]">{sublabel}</span>}
            <span className="text-[#F8FAFC] font-semibold">{percentage}%</span>
          </div>
        </div>
      )}
      <div className={`relative w-full ${height} bg-[#111827] rounded-full overflow-hidden border border-[#1E293B]`}>
        {/* Fill bar */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColors[variant] || barColors.cyan}`}
          style={{ width: `${percentage}%` }}
        />
        {/* Target Benchmark Marker */}
        {targetPercentage !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[#F8FAFC] z-10 shadow-[0_0_6px_#FFFFFF]"
            style={{ left: `${targetPercentage}%` }}
            title={`Required Benchmark: ${targetPercentage}%`}
          />
        )}
      </div>
    </div>
  );
}
