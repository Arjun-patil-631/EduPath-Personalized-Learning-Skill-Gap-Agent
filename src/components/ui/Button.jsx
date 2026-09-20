import React from "react";

export function Button({
  children,
  variant = "primary", // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = "md", // 'sm' | 'md' | 'lg'
  className = "",
  icon: Icon,
  disabled = false,
  loading = false,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer";

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 rounded gap-1.5 h-8",
    md: "text-sm px-4 py-2 rounded-lg gap-2 h-10",
    lg: "text-base px-6 py-3 rounded-lg gap-2.5 h-12 font-semibold",
  };

  const variantClasses = {
    primary:
      "bg-[#0EA5E9] hover:bg-[#0284C7] text-[#F8FAFC] border border-[#38BDF8] shadow-[0_0_16px_rgba(14,165,233,0.3)] hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] active:translate-y-px",
    secondary:
      "bg-[#161F30] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#334155] hover:border-[#0EA5E9] active:translate-y-px",
    ghost:
      "bg-transparent hover:bg-[#161F30] text-[#94A3B8] hover:text-[#F8FAFC] border border-transparent active:translate-y-px",
    danger:
      "bg-[#93000A]/30 hover:bg-[#93000A]/60 text-[#FFB4AB] border border-[#FFB4AB]/30",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
