import React from "react";

export function Card({
  children,
  className = "",
  hoverable = false,
  glow = false,
  headerAction,
  title,
  subtitle,
  icon: Icon,
  ...props
}) {
  return (
    <div
      className={`relative bg-[#161F30] rounded-2xl border border-[#1E293B] p-5 sm:p-6 transition-all duration-200 ${
        hoverable
          ? "hover:-translate-y-0.5 hover:border-[#334155] hover:shadow-[0_8px_24px_-4px_rgba(2,6,23,0.6)]"
          : ""
      } ${
        glow
          ? "border-[#0EA5E9]/40 shadow-[0_0_24px_rgba(14,165,233,0.15)] ring-1 ring-[#0EA5E9]/20"
          : ""
      } ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction || Icon) && (
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[#1E293B]/70">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-9 h-9 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#0EA5E9] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-display font-semibold text-base text-[#F8FAFC]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
