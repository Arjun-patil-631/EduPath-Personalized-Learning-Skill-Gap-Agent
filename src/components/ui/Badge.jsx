import React from "react";

export function Badge({
  children,
  variant = "tag", // 'mastery' | 'deficit' | 'critical' | 'cyan' | 'tag'
  className = "",
  icon: Icon,
}) {
  const variantStyles = {
    mastery: "bg-[#10B981]/12 text-[#34D399] border-[#10B981]/30",
    deficit: "bg-[#F59E0B]/12 text-[#FBBF24] border-[#F59E0B]/30",
    critical: "bg-[#EF4444]/12 text-[#F87171] border-[#EF4444]/30",
    cyan: "bg-[#0EA5E9]/12 text-[#38BDF8] border-[#0EA5E9]/30",
    tag: "bg-[#1E293B] text-[#94A3B8] border-[#334155]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border tracking-wider uppercase font-medium select-none whitespace-nowrap ${variantStyles[variant] || variantStyles.tag} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
