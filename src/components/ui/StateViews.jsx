import React from "react";
import { Loader2, AlertCircle, Inbox, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "./Button.jsx";

export function LoadingState({ message = "Synchronizing neural telemetry..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[260px]">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#1E293B] border-t-[#0EA5E9] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-[#0EA5E9]/20 animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-mono text-[#94A3B8] tracking-wide">{message}</p>
    </div>
  );
}

export function ErrorState({
  title = "Telemetry Service Error",
  message = "Failed to communicate with the intelligence API service.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#161F30]/80 rounded-2xl border border-[#EF4444]/30 max-w-md mx-auto my-6">
      <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#F87171] mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-display font-semibold text-lg text-[#F8FAFC] mb-1">{title}</h3>
      <p className="text-xs text-[#94A3B8] mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title = "No Records Found",
  description = "No items match your active filters or parameters.",
  actionText,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-[#161F30]/50 rounded-2xl border border-[#1E293B] max-w-lg mx-auto my-4">
      <div className="w-12 h-12 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#64748B] mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display font-semibold text-base text-[#F8FAFC] mb-1.5">{title}</h3>
      <p className="text-xs text-[#94A3B8] mb-5 max-w-xs">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

export function SuccessState({
  title = "Evaluation Passed",
  description = "All telemetry and requirements verified successfully.",
  actionText = "Continue Flow",
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#161F30] rounded-2xl border border-[#10B981]/30 max-w-md mx-auto my-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
      <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-4">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h3 className="font-display font-semibold text-lg text-[#F8FAFC] mb-1.5">{title}</h3>
      <p className="text-xs text-[#94A3B8] mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
